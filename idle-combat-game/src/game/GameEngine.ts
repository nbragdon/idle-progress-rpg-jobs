// src/game/GameEngine.ts
// Pure game logic - no React dependencies

import type { GameState, PlayerStats, JobState, SkillState, BattleState } from "../types/game";
import { JOB_DATA, SKILL_DATA, ABILITY_DATA, BOSS_DATA } from "../core/data";
import { 
  calculateLevelFromExp, 
  isJobUnlocked, 
  isJobAvailable,
  isSkillUnlocked,
  isSkillAvailable,
  isAbilityUnlocked,
  isAbilityAvailable
} from "../core/utils";
import { StatValue } from "../types/game";
import type { DamageType, AscensionUpgradeId } from "../types/data";
import { DamageValue, StatusEffectValue } from "../types/data";
import { 
  calculateMaxHP,
  calculateDamageReduction,
  calculateCritChance,
  getEffectiveCooldown,
  getEffectiveBaseDamage
} from "../core/combatSystem";
import {
  updateStatusEffects,
  processPoisonDamage,
  areCooldownsFrozen,
  isPhysicalDisabled,
  isMagicalDisabled,
  getDamageModifier,
  updateShieldEffect,
  createActiveStatusEffect,
  addOrRefreshStatusEffect,
} from "../core/statusEffects";
import { getInitialState } from "../state/initialState";

export class GameEngine {
  private state: GameState;
  private listeners: Set<(state: GameState) => void> = new Set();

  constructor(initialState: GameState) {
    this.state = initialState;
  }

  // Subscribe to state changes
  subscribe(listener: (state: GameState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Get current state (immutable)
  getState(): Readonly<GameState> {
    return this.state;
  }

  // Update state and notify listeners
  private setState(newState: GameState): void {
    this.state = newState;
    this.listeners.forEach(listener => listener(this.state));
  }

  // Calculate player stats from current game state
  calculatePlayerStats(): PlayerStats {
    const stats: PlayerStats = {
      [StatValue.STR]: 1,
      [StatValue.DEX]: 1,
      [StatValue.AGI]: 1,
      [StatValue.TGH]: 1,
      [StatValue.CON]: 1,
      [StatValue.INT]: 1,
      [StatValue.FRT]: 1,
      [StatValue.CONC]: 1,
      [StatValue.RES]: 1,
      [StatValue.CRIT_C]: 0, // Base 0 crit chance
      [StatValue.CRIT_D]: 150, // Base 150% crit damage (1.5x damage on crits)
    };

    Object.entries(this.state.jobs).forEach(([jobId, job]) => {
      const { level } = calculateLevelFromExp(job.exp);
      const jobData = JOB_DATA[jobId];
      if (jobData && level > 0) {
        jobData.statBonuses.forEach((bonus) => {
          stats[bonus.stat] += bonus.value * level;
        });
      }
    });

    return stats;
  }

  // Game tick - grant EXP to active jobs, skills, and abilities, and process battle
  tick(deltaTime: number): void {
    // Process battle ticks first if in battle
    if (this.state.battleState && this.state.battleState.isActive) {
      this.processBattleTick(deltaTime);
      return; // Don't process normal progression during battle
    }
    
    const EXP_PER_SECOND = 10; // Increased for faster progression
    const SKILL_EXP_PER_SECOND = 25; // 5x faster for skills and abilities
    
    // Get ascension upgrade multipliers
    const jobExpLevel = this.state.permanentUpgrades.jobExp || 0;
    const skillExpLevel = this.state.permanentUpgrades.skillExp || 0;
    const abilityExpLevel = this.state.permanentUpgrades.maxAbilities || 0;
    
    const jobExpMultiplier = 1 + (jobExpLevel * 5);
    const skillExpMultiplier = 1 + (skillExpLevel * 5);
    const abilityExpMultiplier = 1 + (abilityExpLevel * 5);
    
    let hasChanges = false;
    const newState = { ...this.state, lastTickTime: Date.now() };

    // Calculate skill bonuses - ALL skills apply regardless of training status
    const skillBonuses: Record<string, number> = {}; // trait -> bonus multiplier
    let globalSkillExpBonus = 0; // Global skill EXP bonus
    let globalAbilityExpBonus = 0; // Global ability EXP bonus
    Object.entries(this.state.skills).forEach(([skillId, skill]) => {
      const skillDef = SKILL_DATA[skillId];
      const { level } = calculateLevelFromExp(skill.exp);
      
      if (skillDef && level > 0) {
        skillDef.effects.forEach(effect => {
          if (effect.type === "traitJobExp") {
            const currentBonus = skillBonuses[effect.trait] || 0;
            skillBonuses[effect.trait] = currentBonus + (effect.value * level);
          } else if (effect.type === "skillExp") {
            globalSkillExpBonus += effect.value * level;
          } else if (effect.type === "abilityExp") {
            globalAbilityExpBonus += effect.value * level;
          }
        });
      }
    });

    // Grant EXP to active jobs (with trait bonuses)
    const updatedJobs = { ...newState.jobs };
    Object.keys(updatedJobs).forEach((jobId) => {
      const job = updatedJobs[jobId];
      if (job.isActive) {
        let expMultiplier = 1.0;
        
        // Apply trait-based bonuses
        const jobDef = JOB_DATA[jobId];
        if (jobDef && jobDef.traits) {
          jobDef.traits.forEach(trait => {
            if (skillBonuses[trait]) {
              expMultiplier += skillBonuses[trait];
            }
          });
        }
        
        const expGain = EXP_PER_SECOND * deltaTime * expMultiplier * jobExpMultiplier;
        updatedJobs[jobId] = { ...job, exp: job.exp + expGain };
        hasChanges = true;
      }
    });

    // Grant EXP to active skills (with global skill EXP bonus and ascension multiplier)
    const updatedSkills = { ...newState.skills };
    Object.keys(updatedSkills).forEach((skillId) => {
      const skill = updatedSkills[skillId];
      if (skill.isActive) {
        const expMultiplier = 1.0 + globalSkillExpBonus;
        const expGain = SKILL_EXP_PER_SECOND * deltaTime * expMultiplier * skillExpMultiplier;
        updatedSkills[skillId] = { ...skill, exp: skill.exp + expGain };
        hasChanges = true;
      }
    });

    // Grant EXP to training abilities (with skill bonus and ascension multiplier)
    const updatedAbilities = { ...newState.abilities };
    Object.keys(updatedAbilities).forEach((abilityId) => {
      const ability = updatedAbilities[abilityId];
      if (ability.isTraining && ability.unlocked) {
        const expMultiplier = 1.0 + globalAbilityExpBonus;
        const expGain = SKILL_EXP_PER_SECOND * deltaTime * expMultiplier * abilityExpMultiplier;
        updatedAbilities[abilityId] = { ...ability, exp: ability.exp + expGain };
        hasChanges = true;
      }
    });

    if (hasChanges) {
      this.setState({
        ...newState,
        jobs: updatedJobs,
        skills: updatedSkills,
        abilities: updatedAbilities,
      });
    }
  }

  // Check for and unlock new jobs
  checkJobUnlocks(): string[] {
    const playerStats = this.calculatePlayerStats();
    const newlyUnlockedJobs: string[] = [];
    let newJobs: Record<string, JobState> | null = null;

    Object.entries(JOB_DATA).forEach(([jobId, jobDef]) => {
      // Skip if job is already available
      if (isJobAvailable(jobId, this.state)) return;

      // Check if job requirements are met
      if (isJobUnlocked(jobDef, this.state, playerStats)) {
        if (!newJobs) {
          newJobs = { ...this.state.jobs };
        }
        // Add the newly unlocked job
        newJobs[jobId] = {
          id: jobId,
          exp: 0,
          isActive: false,
          lastActiveTime: Date.now(),
        };
        newlyUnlockedJobs.push(jobId);
      }
    });

    // Update state if we unlocked any new jobs
    if (newJobs) {
      this.setState({
        ...this.state,
        jobs: newJobs,
      });
    }

    return newlyUnlockedJobs;
  }

  // Check for and unlock new skills
  checkSkillUnlocks(): string[] {
    const playerStats = this.calculatePlayerStats();
    const newlyUnlockedSkills: string[] = [];
    let newSkills: Record<string, SkillState> | null = null;

    Object.entries(SKILL_DATA).forEach(([skillId, skillDef]) => {
      // Skip if skill is already available
      if (isSkillAvailable(skillId, this.state)) return;

      // Check if skill requirements are met
      if (isSkillUnlocked(skillDef, this.state, playerStats)) {
        if (!newSkills) {
          newSkills = { ...this.state.skills };
        }
        // Add the newly unlocked skill
        newSkills[skillId] = {
          id: skillId,
          exp: 0,
          isActive: false,
          lastActiveTime: 0,
        };
        newlyUnlockedSkills.push(skillId);
      }
    });

    // Update state if we unlocked any new skills
    if (newSkills) {
      this.setState({
        ...this.state,
        skills: newSkills,
      });
    }

    return newlyUnlockedSkills;
  }

  // Toggle job active status
  toggleJobActive(jobId: string, maxActiveJobs: number): boolean {
    const job = this.state.jobs[jobId];
    if (!job) return false;

    const updatedJobs = { ...this.state.jobs };

    // If deactivating, just do it
    if (job.isActive) {
      updatedJobs[jobId] = {
        ...job,
        isActive: false,
        lastActiveTime: Date.now(),
      };
      
      this.setState({
        ...this.state,
        jobs: updatedJobs,
      });
      
      return true;
    }

    // If activating, check if we're at the limit
    const activeJobs = Object.entries(this.state.jobs).filter(([_, j]) => j.isActive);
    
    if (activeJobs.length >= maxActiveJobs) {
      // Find the oldest active job (earliest lastActiveTime)
      const oldestJob = activeJobs.reduce((oldest, [currentId, currentJob]) => {
        if (!oldest || currentJob.lastActiveTime < oldest.job.lastActiveTime) {
          return { id: currentId, job: currentJob };
        }
        return oldest;
      }, null as { id: string; job: typeof job } | null);

      // Deactivate the oldest job
      if (oldestJob) {
        updatedJobs[oldestJob.id] = {
          ...oldestJob.job,
          isActive: false,
          lastActiveTime: Date.now(),
        };
      }
    }

    // Activate the new job
    updatedJobs[jobId] = {
      ...job,
      isActive: true,
      lastActiveTime: Date.now(),
    };

    this.setState({
      ...this.state,
      jobs: updatedJobs,
    });

    return true;
  }

  // Toggle skill active status
  toggleSkillActive(skillId: string, maxActiveSkills: number): boolean {
    const skill = this.state.skills[skillId];
    if (!skill) return false;

    const now = Date.now();
    const activeSkills = Object.values(this.state.skills).filter(s => s.isActive);
    const activeSkillCount = activeSkills.length;

    let updatedSkills = { ...this.state.skills };

    // If activating and at max limit, replace the oldest active skill
    if (!skill.isActive && activeSkillCount >= maxActiveSkills) {
      // Find the oldest active skill
      const oldestActiveSkill = activeSkills.reduce((oldest, current) => 
        current.lastActiveTime < oldest.lastActiveTime ? current : oldest
      );
      
      // Deactivate the oldest skill
      updatedSkills[oldestActiveSkill.id] = {
        ...oldestActiveSkill,
        isActive: false,
      };
    }

    // Toggle the requested skill and update its timestamp if activating
    updatedSkills[skillId] = {
      ...skill,
      isActive: !skill.isActive,
      lastActiveTime: !skill.isActive ? now : skill.lastActiveTime,
    };

    this.setState({
      ...this.state,
      skills: updatedSkills,
    });

    return true;
  }

  // Toggle ability training status
  toggleAbilityTraining(abilityId: string, maxTrainingAbilities: number): boolean {
    const ability = this.state.abilities[abilityId];
    if (!ability || !ability.unlocked) return false;

    const updatedAbilities = { ...this.state.abilities };

    // If deactivating, just do it
    if (ability.isTraining) {
      updatedAbilities[abilityId] = {
        ...ability,
        isTraining: false,
      };
      
      this.setState({
        ...this.state,
        abilities: updatedAbilities,
      });
      
      return true;
    }

    // If activating, check if we're at the limit
    const trainingAbilities = Object.entries(this.state.abilities).filter(([_, a]) => a.isTraining);
    
    if (trainingAbilities.length >= maxTrainingAbilities) {
      // Deactivate all currently training abilities (auto-swap behavior)
      trainingAbilities.forEach(([id, a]) => {
        updatedAbilities[id] = {
          ...a,
          isTraining: false,
        };
      });
    }

    // Activate the new ability
    updatedAbilities[abilityId] = {
      ...ability,
      isTraining: true,
    };

    this.setState({
      ...this.state,
      abilities: updatedAbilities,
    });

    return true;
  }

  // Toggle ability battle active status
  toggleAbilityBattle(abilityId: string, maxBattleAbilities: number): boolean {
    const ability = this.state.abilities[abilityId];
    if (!ability || !ability.unlocked) return false;

    const battleAbilityCount = Object.values(this.state.abilities).filter(a => a.isActiveBattle).length;

    // If activating and at max limit
    if (!ability.isActiveBattle && battleAbilityCount >= maxBattleAbilities) {
      return false;
    }

    const updatedAbilities = {
      ...this.state.abilities,
      [abilityId]: {
        ...ability,
        isActiveBattle: !ability.isActiveBattle,
      },
    };

    this.setState({
      ...this.state,
      abilities: updatedAbilities,
    });

    return true;
  }

  // Buy ascension upgrade
  buyAscensionUpgrade(upgradeId: AscensionUpgradeId, cost: number): boolean {
    if (this.state.ascensionPoints < cost) return false;

    const currentLevel = this.state.permanentUpgrades[upgradeId] || 0;

    this.setState({
      ...this.state,
      ascensionPoints: this.state.ascensionPoints - cost,
      permanentUpgrades: {
        ...this.state.permanentUpgrades,
        [upgradeId]: currentLevel + 1,
      },
    });

    return true;
  }

  // Ascend (reset with ascension points)
  ascend(): void {
    // Convert potential points to actual points
    const newAscensionPoints = this.state.ascensionPoints + this.state.potentialAscensionPoints;
    
    // Keep permanent upgrades, actual AP, ascension unlock status, and boss progress
    const initialState = getInitialState();
    
    this.setState({
      ...initialState,
      ascensionPoints: newAscensionPoints,
      potentialAscensionPoints: 0,
      permanentUpgrades: { ...this.state.permanentUpgrades },
      ascensionUnlocked: this.state.ascensionUnlocked, // Keep unlocked through resets
      bossProgress: { ...this.state.bossProgress }, // Keep boss defeat counts for unlocks
    });
  }

  // Start boss battle - initializes real-time battle
  startBossBattle(): boolean {
    const currentBoss = BOSS_DATA[this.state.currentBossId];
    if (!currentBoss) {
      console.error("No boss found for current boss ID");
      return false;
    }

    // Get player stats
    const playerStats = this.calculatePlayerStats();
    const playerMaxHp = calculateMaxHP(playerStats[StatValue.CON]);
    
    // Get battle-active abilities
    const playerAbilities = Object.entries(this.state.abilities)
      .filter(([_, ability]) => ability.isActiveBattle && ability.unlocked)
      .map(([abilityId, ability]) => {
        const abilityData = ABILITY_DATA[abilityId];
        const level = calculateLevelFromExp(ability.exp).level;
        const effectiveCooldown = getEffectiveCooldown(abilityData, level);
        
        return {
          abilityId,
          name: abilityData.name,
          level,
          cooldown: effectiveCooldown, // Start on cooldown
          maxCooldown: effectiveCooldown,
          baseDamage: abilityData.effects[0].baseDamage,
          damageType: abilityData.effects[0].damageType,
        };
      });
    
    // Check if player has any abilities selected
    if (playerAbilities.length === 0) {
      console.warn("Cannot start battle: No abilities selected");
      return false;
    }
    
    // Get boss abilities
    const bossMaxHp = calculateMaxHP(currentBoss.stats[StatValue.CON]);
    const bossAbilities = [{
      abilityId: currentBoss.bossAbility.id || "boss_ability",
      name: currentBoss.bossAbility.name,
      level: 1,
      cooldown: currentBoss.bossAbility.cooldown, // Start on cooldown
      maxCooldown: currentBoss.bossAbility.cooldown,
      baseDamage: currentBoss.bossAbility.effects[0].baseDamage,
      damageType: currentBoss.bossAbility.effects[0].damageType,
    }];
    
    // Initialize battle state
    const battleState: BattleState = {
      isActive: true,
      battleTime: 0,
      
      playerHp: playerMaxHp,
      playerMaxHp,
      playerStats,
      playerAbilities,
      playerStatusEffects: [],
      playerShieldAmount: 0,
      
      bossId: currentBoss.id,
      bossName: currentBoss.name,
      bossHp: bossMaxHp,
      bossMaxHp,
      bossStats: currentBoss.stats,
      bossAbilities,
      bossStatusEffects: [],
      bossShieldAmount: 0,
      
      log: [{
        time: 0,
        message: `Battle Start! Player HP: ${playerMaxHp} | ${currentBoss.name} HP: ${bossMaxHp}`,
        type: "result",
      }],
    };
    
    this.setState({
      ...this.state,
      battleState,
    });
    
    return true;
  }
  
  // Process one tick of battle
  processBattleTick(deltaTime: number): void {
    const { battleState } = this.state;
    if (!battleState || !battleState.isActive) return;
    
    // Update battle time
    battleState.battleTime += deltaTime;
    
    // === 1. UPDATE STATUS EFFECTS ===
    // Update player status effects
    const playerStatusUpdate = updateStatusEffects(battleState.playerStatusEffects, deltaTime);
    battleState.playerStatusEffects = playerStatusUpdate.updatedEffects;
    
    // Log expired player effects
    for (const expired of playerStatusUpdate.expiredEffects) {
      battleState.log.push({
        time: battleState.battleTime,
        message: `Player's ${expired.type} effect expired`,
        type: "result",
      });
    }
    
    // Update boss status effects
    const bossStatusUpdate = updateStatusEffects(battleState.bossStatusEffects, deltaTime);
    battleState.bossStatusEffects = bossStatusUpdate.updatedEffects;
    
    // Log expired boss effects
    for (const expired of bossStatusUpdate.expiredEffects) {
      battleState.log.push({
        time: battleState.battleTime,
        message: `${battleState.bossName}'s ${expired.type} effect expired`,
        type: "result",
      });
    }
    
    // === 2. PROCESS POISON DAMAGE ===
    // Apply poison to boss
    const bossPoison = processPoisonDamage(
      battleState.bossStatusEffects,
      deltaTime,
      battleState.battleTime
    );
    battleState.bossStatusEffects = bossPoison.updatedEffects;
    if (bossPoison.damage > 0) {
      battleState.bossHp = Math.max(0, battleState.bossHp - bossPoison.damage);
      battleState.log.push({
        time: battleState.battleTime,
        message: `${battleState.bossName} takes ${Math.round(bossPoison.damage)} poison damage`,
        type: "player",
      });
      
      if (battleState.bossHp <= 0) {
        this.endBattle(true);
        return;
      }
    }
    
    // Apply poison to player
    const playerPoison = processPoisonDamage(
      battleState.playerStatusEffects,
      deltaTime,
      battleState.battleTime
    );
    battleState.playerStatusEffects = playerPoison.updatedEffects;
    if (playerPoison.damage > 0) {
      // Poison bypasses shield (true damage)
      battleState.playerHp = Math.max(0, battleState.playerHp - playerPoison.damage);
      battleState.log.push({
        time: battleState.battleTime,
        message: `Player takes ${Math.round(playerPoison.damage)} poison damage`,
        type: "boss",
      });
      
      if (battleState.playerHp <= 0) {
        this.endBattle(false);
        return;
      }
    }
    
    // === 3. PROCESS PLAYER ABILITIES ===
    const playerStunned = areCooldownsFrozen(battleState.playerStatusEffects);
    
    for (const ability of battleState.playerAbilities) {
      // Update cooldown only if not stunned
      if (!playerStunned) {
        ability.cooldown -= deltaTime;
      }
      
      if (ability.cooldown <= 0 && battleState.bossHp > 0) {
        // Check if ability is disabled
        const isPhysical = ability.damageType === DamageValue.Physical;
        const isMagical = ability.damageType === DamageValue.Magic;
        
        const disabled = (isPhysical && isPhysicalDisabled(battleState.playerStatusEffects)) ||
                        (isMagical && isMagicalDisabled(battleState.playerStatusEffects));
        
        if (disabled) {
          // Reset cooldown but don't fire
          ability.cooldown = ability.maxCooldown;
          const disabledType = isPhysical ? "Disarmed" : "Silenced";
          battleState.log.push({
            time: battleState.battleTime,
            message: `Player's ${ability.name} blocked (${disabledType})`,
            type: "result",
          });
          continue;
        }
        
        // Get ability definition for damage calculation
        const abilityData = ABILITY_DATA[ability.abilityId];
        const effectiveBaseDamage = getEffectiveBaseDamage(abilityData, ability.level);
        
        // Calculate base damage
        let damage = this.calculateBattleDamage(
          battleState.playerStats,
          battleState.bossStats,
          effectiveBaseDamage,
          ability.damageType
        );
        
        // Apply Weak/Strong modifiers
        const damageModifier = getDamageModifier(battleState.playerStatusEffects);
        damage *= damageModifier;
        
        // Apply damage (shield absorbs first for boss)
        const finalDamage = Math.round(damage);
        if (battleState.bossShieldAmount > 0) {
          const shieldDamage = Math.min(battleState.bossShieldAmount, finalDamage);
          const hpDamage = finalDamage - shieldDamage;
          battleState.bossShieldAmount -= shieldDamage;
          battleState.bossHp = Math.max(0, battleState.bossHp - hpDamage);
          
          battleState.log.push({
            time: battleState.battleTime,
            message: `Player uses ${ability.name}: ${shieldDamage} shield + ${hpDamage} damage`,
            type: "player",
          });
        } else {
          battleState.bossHp = Math.max(0, battleState.bossHp - finalDamage);
          battleState.log.push({
            time: battleState.battleTime,
            message: `Player uses ${ability.name}: ${finalDamage} damage`,
            type: "player",
          });
        }
        
        // Apply status effects from ability
        if (abilityData.effects[0].statusEffectConfig) {
          const statusEffect = createActiveStatusEffect(
            abilityData.effects[0].statusEffectConfig,
            ability.level,
            "player",
            battleState.battleTime
          );
          
          // Shield applies to self (player)
          if (statusEffect.type === StatusEffectValue.Shield) {
            battleState.playerStatusEffects = addOrRefreshStatusEffect(
              battleState.playerStatusEffects,
              statusEffect
            );
            battleState.playerShieldAmount += statusEffect.value;
            battleState.log.push({
              time: battleState.battleTime,
              message: `Player gains ${Math.round(statusEffect.value)} shield for ${statusEffect.duration.toFixed(1)}s`,
              type: "player",
            });
          }
          // Strong applies to self (player)
          else if (statusEffect.type === StatusEffectValue.Strong) {
            battleState.playerStatusEffects = addOrRefreshStatusEffect(
              battleState.playerStatusEffects,
              statusEffect
            );
            battleState.log.push({
              time: battleState.battleTime,
              message: `Player gains ${statusEffect.value.toFixed(0)}% damage boost for ${statusEffect.duration.toFixed(1)}s`,
              type: "player",
            });
          }
          // All other effects apply to boss
          else {
            battleState.bossStatusEffects = addOrRefreshStatusEffect(
              battleState.bossStatusEffects,
              statusEffect
            );
            
            let effectMsg = "";
            switch (statusEffect.type) {
              case StatusEffectValue.Stun:
                effectMsg = `Stunned for ${statusEffect.duration.toFixed(1)}s`;
                break;
              case StatusEffectValue.Poison:
                effectMsg = `Poisoned (${Math.round(statusEffect.value)} dmg/s) for ${statusEffect.duration.toFixed(1)}s`;
                break;
              case StatusEffectValue.Disarm:
                effectMsg = `Disarmed for ${statusEffect.duration.toFixed(1)}s`;
                break;
              case StatusEffectValue.Silence:
                effectMsg = `Silenced for ${statusEffect.duration.toFixed(1)}s`;
                break;
              case StatusEffectValue.Weak:
                effectMsg = `Weakened (${statusEffect.value.toFixed(0)}% less damage) for ${statusEffect.duration.toFixed(1)}s`;
                break;
            }
            
            battleState.log.push({
              time: battleState.battleTime,
              message: `${battleState.bossName} ${effectMsg}`,
              type: "player",
            });
          }
        }
        
        // Reset cooldown
        ability.cooldown = ability.maxCooldown;
        
        // Check if boss defeated
        if (battleState.bossHp <= 0) {
          this.endBattle(true);
          return;
        }
      }
    }
    
    // === 4. PROCESS BOSS ABILITIES ===
    const bossStunned = areCooldownsFrozen(battleState.bossStatusEffects);
    
    for (const ability of battleState.bossAbilities) {
      // Update cooldown only if not stunned
      if (!bossStunned) {
        ability.cooldown -= deltaTime;
      }
      
      if (ability.cooldown <= 0 && battleState.playerHp > 0) {
        // Check if ability is disabled
        const isPhysical = ability.damageType === DamageValue.Physical;
        const isMagical = ability.damageType === DamageValue.Magic;
        
        const disabled = (isPhysical && isPhysicalDisabled(battleState.bossStatusEffects)) ||
                        (isMagical && isMagicalDisabled(battleState.bossStatusEffects));
        
        if (disabled) {
          // Reset cooldown but don't fire
          ability.cooldown = ability.maxCooldown;
          const disabledType = isPhysical ? "Disarmed" : "Silenced";
          battleState.log.push({
            time: battleState.battleTime,
            message: `${battleState.bossName}'s ${ability.name} blocked (${disabledType})`,
            type: "result",
          });
          continue;
        }
        
        // Get ability definition for damage calculation
        const bossData = BOSS_DATA[battleState.bossId];
        const effectiveBaseDamage = getEffectiveBaseDamage(bossData.bossAbility, ability.level);
        
        // Calculate base damage
        let damage = this.calculateBattleDamage(
          battleState.bossStats,
          battleState.playerStats,
          effectiveBaseDamage,
          ability.damageType
        );
        
        // Apply Weak/Strong modifiers
        const damageModifier = getDamageModifier(battleState.bossStatusEffects);
        damage *= damageModifier;
        
        // Apply damage (shield absorbs first for player)
        const finalDamage = Math.round(damage);
        if (battleState.playerShieldAmount > 0) {
          const shieldDamage = Math.min(battleState.playerShieldAmount, finalDamage);
          const hpDamage = finalDamage - shieldDamage;
          battleState.playerShieldAmount -= shieldDamage;
          battleState.playerHp = Math.max(0, battleState.playerHp - hpDamage);
          
          battleState.log.push({
            time: battleState.battleTime,
            message: `${battleState.bossName} uses ${ability.name}: ${shieldDamage} shield + ${hpDamage} damage`,
            type: "boss",
          });
        } else {
          battleState.playerHp = Math.max(0, battleState.playerHp - finalDamage);
          battleState.log.push({
            time: battleState.battleTime,
            message: `${battleState.bossName} uses ${ability.name}: ${finalDamage} damage`,
            type: "boss",
          });
        }
        
        // Apply status effects from boss ability (bossData already declared above)
        if (bossData.bossAbility.effects[0].statusEffectConfig) {
          const statusEffect = createActiveStatusEffect(
            bossData.bossAbility.effects[0].statusEffectConfig,
            ability.level,
            "boss",
            battleState.battleTime
          );
          
          // Shield applies to self (boss)
          if (statusEffect.type === StatusEffectValue.Shield) {
            battleState.bossStatusEffects = addOrRefreshStatusEffect(
              battleState.bossStatusEffects,
              statusEffect
            );
            battleState.bossShieldAmount += statusEffect.value;
            battleState.log.push({
              time: battleState.battleTime,
              message: `${battleState.bossName} gains ${Math.round(statusEffect.value)} shield for ${statusEffect.duration.toFixed(1)}s`,
              type: "boss",
            });
          }
          // Strong applies to self (boss)
          else if (statusEffect.type === StatusEffectValue.Strong) {
            battleState.bossStatusEffects = addOrRefreshStatusEffect(
              battleState.bossStatusEffects,
              statusEffect
            );
            battleState.log.push({
              time: battleState.battleTime,
              message: `${battleState.bossName} gains ${statusEffect.value.toFixed(0)}% damage boost for ${statusEffect.duration.toFixed(1)}s`,
              type: "boss",
            });
          }
          // All other effects apply to player
          else {
            battleState.playerStatusEffects = addOrRefreshStatusEffect(
              battleState.playerStatusEffects,
              statusEffect
            );
            
            let effectMsg = "";
            switch (statusEffect.type) {
              case StatusEffectValue.Stun:
                effectMsg = `Stunned for ${statusEffect.duration.toFixed(1)}s`;
                break;
              case StatusEffectValue.Poison:
                effectMsg = `Poisoned (${Math.round(statusEffect.value)} dmg/s) for ${statusEffect.duration.toFixed(1)}s`;
                break;
              case StatusEffectValue.Disarm:
                effectMsg = `Disarmed for ${statusEffect.duration.toFixed(1)}s`;
                break;
              case StatusEffectValue.Silence:
                effectMsg = `Silenced for ${statusEffect.duration.toFixed(1)}s`;
                break;
              case StatusEffectValue.Weak:
                effectMsg = `Weakened (${statusEffect.value.toFixed(0)}% less damage) for ${statusEffect.duration.toFixed(1)}s`;
                break;
            }
            
            battleState.log.push({
              time: battleState.battleTime,
              message: `Player ${effectMsg}`,
              type: "boss",
            });
          }
        }
        
        // Reset cooldown
        ability.cooldown = ability.maxCooldown;
        
        // Check if player defeated
        if (battleState.playerHp <= 0) {
          this.endBattle(false);
          return;
        }
      }
    }
    
    // Update state
    this.setState({
      ...this.state,
      battleState: { ...battleState },
    });
  }
  
  // Calculate damage for battle (simplified from combat system)
  private calculateBattleDamage(
    attackerStats: PlayerStats,
    defenderStats: PlayerStats,
    baseDamage: number,
    damageType: DamageType
  ): number {
    // Get relevant stat
    const attackStat = damageType === DamageValue.Physical
      ? attackerStats[StatValue.STR]
      : damageType === DamageValue.Magic
      ? attackerStats[StatValue.INT]
      : 0;
    
    let damage = baseDamage + attackStat;
    
    // Apply crit
    const critChance = calculateCritChance(attackerStats[StatValue.CRIT_C], defenderStats);
    if (Math.random() < critChance) {
      // CRIT_D stored as percentage (e.g., 150 = 150% damage)
      damage *= (attackerStats[StatValue.CRIT_D] / 100);
    }
    
    // Apply damage reduction
    if (damageType !== DamageValue.True) {
      const reduction = calculateDamageReduction(damageType, defenderStats);
      damage *= reduction;
    }
    
    return Math.ceil(damage);
  }
  
  // End battle and award rewards
  private endBattle(won: boolean): void {
    const { battleState } = this.state;
    if (!battleState) return;
    
    const currentBoss = BOSS_DATA[this.state.currentBossId];
    
    // Add result to log
    battleState.log.push({
      time: battleState.battleTime,
      message: won ? "Victory!" : "Defeat!",
      type: "result",
      value: won ? "Win" : "Loss",
    });
    
    // Set result
    let nextBossUnlocked = false;
    let nextBossName: string | undefined;
    
    // Check if next boss was previously defeated (for "newly unlocked" message)
    if (won && currentBoss.nextBoss) {
      const nextBossProgress = this.state.bossProgress[currentBoss.nextBoss];
      nextBossUnlocked = !nextBossProgress || nextBossProgress.defeated === 0; // First time unlocking this boss
      if (nextBossUnlocked) {
        nextBossName = BOSS_DATA[currentBoss.nextBoss]?.name;
      }
    }
    
    battleState.result = {
      won,
      ascensionPoints: won ? currentBoss.ascensionPoints : 0,
      nextBossUnlocked,
      nextBossName,
    };
    battleState.isActive = false;
    
    // Update boss progress
    const newBossProgress = { ...this.state.bossProgress };
    if (!newBossProgress[this.state.currentBossId]) {
      newBossProgress[this.state.currentBossId] = {
        defeated: 0,
        lastBattleLog: [],
      };
    }
    
    newBossProgress[this.state.currentBossId] = {
      defeated: won
        ? newBossProgress[this.state.currentBossId].defeated + 1
        : newBossProgress[this.state.currentBossId].defeated,
      lastBattleLog: battleState.log,
    };
    
    // Award rewards and potentially unlock next boss
    let newState: GameState = {
      ...this.state,
      battleState: { ...battleState },
      bossProgress: newBossProgress,
    };
    
    if (won) {
      newState.potentialAscensionPoints += currentBoss.ascensionPoints;
      
      // Unlock ascension system on first boss defeat ever
      if (!newState.ascensionUnlocked) {
        newState.ascensionUnlocked = true;
      }
      
      // Always advance to next boss on victory (if there is one)
      if (currentBoss.nextBoss) {
        newState.currentBossId = currentBoss.nextBoss;
        
        // Initialize next boss progress if it doesn't exist
        if (!newState.bossProgress[currentBoss.nextBoss]) {
          newState.bossProgress = {
            ...newState.bossProgress,
            [currentBoss.nextBoss]: { defeated: 0, lastBattleLog: [] },
          };
        }
      }
    }
    
    this.setState(newState);
  }
  
  // Close battle (user acknowledges result)
  closeBattle(): void {
    this.setState({
      ...this.state,
      battleState: null,
    });
  }

  // Set active tab (this might move to UI layer)
  setActiveTab(tab: GameState["activeTab"]): void {
    this.setState({
      ...this.state,
      activeTab: tab,
    });
  }

  // Reset game - returns new initial state
  reset(initialState: GameState): void {
    this.state = initialState;
    this.listeners.forEach(listener => listener(this.state));
  }
}

