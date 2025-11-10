// src/game/GameEngine.ts
// Pure game logic - no React dependencies

import type { GameState, PlayerStats, JobState, SkillState, BattleState } from "../types/game";
import { JOB_DATA, SKILL_DATA, ABILITY_DATA, BOSS_DATA } from "../core/data";
import { 
  calculateLevelFromExp, 
  isJobUnlocked, 
  isJobAvailable,
  isSkillUnlocked,
  isSkillAvailable
} from "../core/utils";
import { StatValue } from "../types/game";
import type { DamageType } from "../types/data";
import { DamageValue } from "../types/data";
import { 
  calculateMaxHP,
  calculateDamageReduction,
  calculateCritChance,
  getEffectiveCooldown,
  getEffectiveBaseDamage
} from "../core/combatSystem";
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

    const activeSkillCount = Object.values(this.state.skills).filter(s => s.isActive).length;

    // If activating and at max limit
    if (!skill.isActive && activeSkillCount >= maxActiveSkills) {
      return false;
    }

    const updatedSkills = {
      ...this.state.skills,
      [skillId]: {
        ...skill,
        isActive: !skill.isActive,
      },
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
  buyAscensionUpgrade(upgradeId: string, cost: number): boolean {
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
    
    // Keep permanent upgrades, actual AP, and ascension unlock status
    const initialState = getInitialState();
    
    this.setState({
      ...initialState,
      ascensionPoints: newAscensionPoints,
      potentialAscensionPoints: 0,
      permanentUpgrades: { ...this.state.permanentUpgrades },
      ascensionUnlocked: this.state.ascensionUnlocked, // Keep unlocked through resets
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
      
      bossId: currentBoss.id,
      bossName: currentBoss.name,
      bossHp: bossMaxHp,
      bossMaxHp,
      bossStats: currentBoss.stats,
      bossAbilities,
      
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
    
    // Process player abilities
    for (const ability of battleState.playerAbilities) {
      ability.cooldown -= deltaTime;
      
      if (ability.cooldown <= 0 && battleState.bossHp > 0) {
        // Get ability definition for damage calculation
        const abilityData = ABILITY_DATA[ability.abilityId];
        const effectiveBaseDamage = getEffectiveBaseDamage(abilityData, ability.level);
        
        // Fire ability
        const damage = this.calculateBattleDamage(
          battleState.playerStats,
          battleState.bossStats,
          effectiveBaseDamage,
          ability.damageType
        );
        
        battleState.bossHp = Math.max(0, battleState.bossHp - damage);
        
        battleState.log.push({
          time: battleState.battleTime,
          message: `Player uses ${ability.name}: ${damage} damage`,
          type: "player",
        });
        
        // Reset cooldown
        ability.cooldown = ability.maxCooldown;
        
        // Check if boss defeated
        if (battleState.bossHp <= 0) {
          this.endBattle(true);
          return;
        }
      }
    }
    
    // Process boss abilities
    for (const ability of battleState.bossAbilities) {
      ability.cooldown -= deltaTime;
      
      if (ability.cooldown <= 0 && battleState.playerHp > 0) {
        // Get ability definition for damage calculation (boss abilities stored in boss data)
        const bossData = BOSS_DATA[battleState.bossId];
        const effectiveBaseDamage = getEffectiveBaseDamage(bossData.bossAbility, ability.level);
        
        // Fire ability
        const damage = this.calculateBattleDamage(
          battleState.bossStats,
          battleState.playerStats,
          effectiveBaseDamage,
          ability.damageType
        );
        
        battleState.playerHp = Math.max(0, battleState.playerHp - damage);
        
        battleState.log.push({
          time: battleState.battleTime,
          message: `${battleState.bossName} uses ${ability.name}: ${damage} damage`,
          type: "boss",
        });
        
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
    
    if (won && currentBoss.nextBoss) {
      const bossProgress = this.state.bossProgress[this.state.currentBossId] || { defeated: 0, lastBattleLog: [] };
      nextBossUnlocked = bossProgress.defeated === 0; // First victory unlocks next boss
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
      
      // Unlock next boss on first victory
      if (nextBossUnlocked && currentBoss.nextBoss) {
        newState.currentBossId = currentBoss.nextBoss;
        
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

