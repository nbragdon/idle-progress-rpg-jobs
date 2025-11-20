// src/game/GameEngine.ts
// Pure game logic - no React dependencies

import type { GameState, PlayerStats, JobState, SkillState, BattleState } from "../types/game";
import { JOB_DATA, SKILL_DATA, ABILITY_DATA, BOSS_DATA, PATH_DATA } from "../core/data";
import { HORDE_UPGRADES, calculateUpgradeCost } from "../data/horde";
import { 
  calculateLevelFromExp, 
  calculateTotalLevels,
  isJobUnlocked, 
  isJobAvailable,
  isSkillUnlocked,
  isSkillAvailable,
  isAbilityUnlocked,
  isAbilityAvailable
} from "../core/utils";
import { StatValue } from "../types/game";
import type { DamageType, AscensionUpgradeId, PathEffect } from "../types/data";
import { DamageValue, StatusEffectValue } from "../types/data";
import { 
  calculateMaxHP,
  calculateDamageReduction,
  calculateCritChance,
  calculateHitChance,
  getEffectiveCooldown,
  getEffectiveBaseDamage,
  calculateStatusEffectChance
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

// --- Path Helper Functions ---

const PATH_GROWTH_TIME_MS = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Calculate the current multiplier for a path effect based on time elapsed
 * Linear growth from baseValue to maxValue over 1 hour
 */
function calculatePathMultiplier(effect: PathEffect, selectionTime: number, currentTime: number): number {
  const elapsedTime = currentTime - selectionTime;
  const growthProgress = Math.min(1, elapsedTime / PATH_GROWTH_TIME_MS);
  
  // Linear interpolation between base and max
  return effect.baseValue + (effect.maxValue - effect.baseValue) * growthProgress;
}

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
        // Calculate total multiplier for this job
        let totalMultiplier = 1.0;
        
        // Apply Horde multipliers
        if (this.state.hordeState.unlocked) {
          Object.values(HORDE_UPGRADES).forEach(upgrade => {
            const upgradeState = this.state.hordeState.upgrades[upgrade.id];
            if (upgradeState && upgradeState.level > 0) {
              // Check if job has any of the upgrade's traits
              const hasMatchingTrait = jobData.traits?.some(trait => upgrade.traits.includes(trait));
              if (hasMatchingTrait) {
                // Apply multiplier: 1 + (level * multiplierPerLevel)
                // e.g., level 1 with 0.25 = 1.25x, level 2 = 1.5x
                totalMultiplier *= (1 + (upgradeState.level * upgrade.statMultiplierPerLevel));
              }
            }
          });
        }
        
        // Apply Trait Mastery upgrades (Physical, Magical, Swift)
        const traits = jobData.traits || [];
        if (traits.includes("Physical")) {
          const physicalLevel = this.state.permanentUpgrades.physicalTraitBonus || 0;
          if (physicalLevel > 0) {
            totalMultiplier *= (1 + (physicalLevel * 0.5)); // 50% per level
          }
        }
        if (traits.includes("Magical")) {
          const magicalLevel = this.state.permanentUpgrades.magicalTraitBonus || 0;
          if (magicalLevel > 0) {
            totalMultiplier *= (1 + (magicalLevel * 0.5)); // 50% per level
          }
        }
        if (traits.includes("Swift")) {
          const swiftLevel = this.state.permanentUpgrades.swiftTraitBonus || 0;
          if (swiftLevel > 0) {
            totalMultiplier *= (1 + (swiftLevel * 0.5)); // 50% per level
          }
        }
        
        jobData.statBonuses.forEach((bonus) => {
          // Round to 1 decimal place
          const statGain = Math.round(bonus.value * level * totalMultiplier * 10) / 10;
          stats[bonus.stat] += statGain;
        });
      }
    });

    // Round all final accumulated stats to 1 decimal place to prevent floating point errors
    Object.keys(stats).forEach((statKey) => {
      const key = statKey as keyof PlayerStats;
      stats[key] = Math.round(stats[key] * 10) / 10;
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
    const now = Date.now();
    const newState = { ...this.state, lastTickTime: now };

    // Auto-activate all unlocked jobs/skills/abilities if upgrades are purchased AND enabled
    const hasAutoJobs = (this.state.permanentUpgrades.autoTrainAllJobs || 0) > 0 && this.state.settings.autoTrainingEnabled.jobs;
    const hasAutoSkills = (this.state.permanentUpgrades.autoTrainAllSkills || 0) > 0 && this.state.settings.autoTrainingEnabled.skills;
    const hasAutoAbilities = (this.state.permanentUpgrades.autoTrainAllAbilities || 0) > 0 && this.state.settings.autoTrainingEnabled.abilities;
    
    if (hasAutoJobs) {
      // Auto-activate all unlocked jobs
      Object.keys(newState.jobs).forEach(jobId => {
        const jobDef = JOB_DATA[jobId];
        const job = newState.jobs[jobId];
        if (jobDef && !job.isActive) {
          const playerStats = this.calculatePlayerStats();
          if (isJobUnlocked(jobDef, newState, playerStats) && isJobAvailable(jobDef, newState)) {
            newState.jobs[jobId] = { ...job, isActive: true };
            hasChanges = true;
          }
        }
      });
    }
    
    if (hasAutoSkills) {
      // Auto-activate all unlocked skills
      Object.keys(newState.skills).forEach(skillId => {
        const skillDef = SKILL_DATA[skillId];
        const skill = newState.skills[skillId];
        if (skillDef && !skill.isActive) {
          if (isSkillUnlocked(skillDef, newState) && isSkillAvailable(skillDef, newState)) {
            newState.skills[skillId] = { ...skill, isActive: true };
            hasChanges = true;
          }
        }
      });
    }
    
    if (hasAutoAbilities) {
      // Auto-activate all unlocked abilities for training
      Object.keys(newState.abilities).forEach(abilityId => {
        const abilityDef = ABILITY_DATA[abilityId];
        const ability = newState.abilities[abilityId];
        if (abilityDef && ability.unlocked && !ability.isTraining) {
          if (isAbilityUnlocked(abilityDef, newState) && isAbilityAvailable(abilityDef, newState)) {
            newState.abilities[abilityId] = { ...ability, isTraining: true };
            hasChanges = true;
          }
        }
      });
    }

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
    
    // Calculate path bonuses
    const pathBonuses: {
      traitJobExp: Record<string, number>;
      jobExp: number;
      skillExp: number;
      abilityExp: number;
    } = {
      traitJobExp: {},
      jobExp: 0,
      skillExp: 0,
      abilityExp: 0,
    };
    
    if (this.state.pathState.selectedPathId) {
      const pathDef = PATH_DATA[this.state.pathState.selectedPathId];
      if (pathDef) {
        pathDef.effects.forEach(effect => {
          const multiplier = calculatePathMultiplier(effect, this.state.pathState.selectionTime, now);
          
          if (effect.type === "traitJobExp" && effect.trait) {
            pathBonuses.traitJobExp[effect.trait] = multiplier;
          } else if (effect.type === "jobExp") {
            pathBonuses.jobExp = multiplier;
          } else if (effect.type === "skillExp") {
            pathBonuses.skillExp = multiplier;
          } else if (effect.type === "abilityExp") {
            pathBonuses.abilityExp = multiplier;
          }
        });
      }
    }

    // Grant EXP to active jobs (with trait bonuses and path bonuses)
    const updatedJobs = { ...newState.jobs };
    Object.keys(updatedJobs).forEach((jobId) => {
      const job = updatedJobs[jobId];
      if (job.isActive) {
        let expMultiplier = 1.0;
        
        // Apply trait-based bonuses from skills
        const jobDef = JOB_DATA[jobId];
        if (jobDef && jobDef.traits) {
          jobDef.traits.forEach(trait => {
            if (skillBonuses[trait]) {
              expMultiplier += skillBonuses[trait];
            }
            // Apply path trait bonuses (multiplicative)
            if (pathBonuses.traitJobExp[trait]) {
              expMultiplier *= pathBonuses.traitJobExp[trait];
            }
          });
        }
        
        // Apply global job exp path bonus (multiplicative)
        if (pathBonuses.jobExp > 0) {
          expMultiplier *= pathBonuses.jobExp;
        }
        
        const expGain = EXP_PER_SECOND * deltaTime * expMultiplier * jobExpMultiplier;
        updatedJobs[jobId] = { ...job, exp: job.exp + expGain };
        hasChanges = true;
      }
    });

    // Grant EXP to active skills (with global skill EXP bonus, path bonus, and ascension multiplier)
    const updatedSkills = { ...newState.skills };
    Object.keys(updatedSkills).forEach((skillId) => {
      const skill = updatedSkills[skillId];
      if (skill.isActive) {
        let expMultiplier = 1.0 + globalSkillExpBonus;
        
        // Apply path skill exp bonus (multiplicative)
        if (pathBonuses.skillExp > 0) {
          expMultiplier *= pathBonuses.skillExp;
        }
        
        const expGain = SKILL_EXP_PER_SECOND * deltaTime * expMultiplier * skillExpMultiplier;
        updatedSkills[skillId] = { ...skill, exp: skill.exp + expGain };
        hasChanges = true;
      }
    });

    // Grant EXP to training abilities (with skill bonus, path bonus, and ascension multiplier)
    const updatedAbilities = { ...newState.abilities };
    Object.keys(updatedAbilities).forEach((abilityId) => {
      const ability = updatedAbilities[abilityId];
      if (ability.isTraining && ability.unlocked) {
        let expMultiplier = 1.0 + globalAbilityExpBonus;
        
        // Apply path ability exp bonus (multiplicative)
        if (pathBonuses.abilityExp > 0) {
          expMultiplier *= pathBonuses.abilityExp;
        }
        
        const expGain = SKILL_EXP_PER_SECOND * deltaTime * expMultiplier * abilityExpMultiplier;
        updatedAbilities[abilityId] = { ...ability, exp: ability.exp + expGain };
        hasChanges = true;
      }
    });

    // Generate goblins if Horde is unlocked
    if (newState.hordeState.unlocked) {
      // Calculate goblin generation rate: 1 base + 1 per 100 total job levels
      const totalLevels = calculateTotalLevels(newState);
      const goblinGeneration = Math.max(1, 1 + (totalLevels / 100));
      
      const goblinGain = goblinGeneration * deltaTime;
      newState.hordeState = {
        ...newState.hordeState,
        goblins: newState.hordeState.goblins + goblinGain,
        goblinGeneration: goblinGeneration, // Update the rate for display
      };
      hasChanges = true;
    }

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

  // Check for and unlock new abilities
  checkAbilityUnlocks(): string[] {
    const playerStats = this.calculatePlayerStats();
    const newlyUnlockedAbilities: string[] = [];
    let newAbilities: Record<string, typeof this.state.abilities[string]> | null = null;

    Object.entries(ABILITY_DATA).forEach(([abilityId, abilityDef]) => {
      // Skip if ability is already unlocked
      if (isAbilityAvailable(abilityId, this.state)) return;

      // Check if ability requirements are met
      if (isAbilityUnlocked(abilityDef, this.state, playerStats)) {
        if (!newAbilities) {
          newAbilities = { ...this.state.abilities };
        }
        // Unlock the ability
        newAbilities[abilityId] = {
          ...this.state.abilities[abilityId],
          unlocked: true,
        };
        newlyUnlockedAbilities.push(abilityId);
      }
    });

    // Update state if we unlocked any new abilities
    if (newAbilities) {
      this.setState({
        ...this.state,
        abilities: newAbilities,
      });
    }

    return newlyUnlockedAbilities;
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

  // Toggle auto-training settings
  toggleAutoTrainingJobs(): void {
    this.setState({
      ...this.state,
      settings: {
        ...this.state.settings,
        autoTrainingEnabled: {
          ...this.state.settings.autoTrainingEnabled,
          jobs: !this.state.settings.autoTrainingEnabled.jobs,
        },
      },
    });
  }

  toggleAutoTrainingSkills(): void {
    this.setState({
      ...this.state,
      settings: {
        ...this.state.settings,
        autoTrainingEnabled: {
          ...this.state.settings.autoTrainingEnabled,
          skills: !this.state.settings.autoTrainingEnabled.skills,
        },
      },
    });
  }

  toggleAutoTrainingAbilities(): void {
    this.setState({
      ...this.state,
      settings: {
        ...this.state.settings,
        autoTrainingEnabled: {
          ...this.state.settings.autoTrainingEnabled,
          abilities: !this.state.settings.autoTrainingEnabled.abilities,
        },
      },
    });
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

  // Select a path
  selectPath(pathId: string): boolean {
    // Check if path exists
    if (!PATH_DATA[pathId]) {
      return false;
    }
    
    // Check if a path is already selected
    if (this.state.pathState.selectedPathId !== null) {
      return false;
    }
    
    // Select the path
    this.setState({
      ...this.state,
      pathState: {
        ...this.state.pathState,
        selectedPathId: pathId,
        selectionTime: Date.now(),
      },
    });
    
    return true;
  }

  // --- Horde System Methods ---

  /**
   * Purchase a Horde upgrade with goblins
   * Cost increases exponentially based on total levels purchased
   */
  purchaseHordeUpgrade(upgradeId: string): boolean {
    const upgradeDef = HORDE_UPGRADES[upgradeId];
    if (!upgradeDef) {
      return false;
    }

    // Check if Horde is unlocked
    if (!this.state.hordeState.unlocked) {
      return false;
    }

    // Calculate cost based on total levels
    const cost = calculateUpgradeCost(upgradeDef.baseCost, this.state.hordeState.totalLevels);

    // Check if player has enough goblins
    if (this.state.hordeState.goblins < cost) {
      return false;
    }

    // Purchase the upgrade
    const currentUpgrade = this.state.hordeState.upgrades[upgradeId];
    this.setState({
      ...this.state,
      hordeState: {
        ...this.state.hordeState,
        goblins: this.state.hordeState.goblins - cost,
        upgrades: {
          ...this.state.hordeState.upgrades,
          [upgradeId]: {
            ...currentUpgrade,
            level: currentUpgrade.level + 1,
          },
        },
        totalLevels: this.state.hordeState.totalLevels + 1,
      },
    });

    return true;
  }

  // Ascend (reset with ascension points)
  ascend(): void {
    // Convert potential points to actual points
    const newAscensionPoints = this.state.ascensionPoints + this.state.potentialAscensionPoints;
    
    // Increment total ascensions
    const newTotalAscensions = this.state.pathState.totalAscensions + 1;
    
    // Keep permanent upgrades, actual AP, ascension unlock status, boss progress, and total ascensions
    const initialState = getInitialState();
    
    this.setState({
      ...initialState,
      ascensionPoints: newAscensionPoints,
      potentialAscensionPoints: 0,
      permanentUpgrades: { ...this.state.permanentUpgrades },
      ascensionUnlocked: this.state.ascensionUnlocked, // Keep unlocked through resets
      bossProgress: { ...this.state.bossProgress }, // Keep boss defeat counts for unlocks
      pathState: {
        selectedPathId: null, // Reset path selection
        selectionTime: 0,
        totalAscensions: newTotalAscensions, // Keep and increment total ascensions
      },
      hordeState: {
        goblins: 0, // Reset goblins
        goblinGeneration: 1,
        upgrades: {
          Physical: { id: "Physical", level: 0 },
          Magical: { id: "Magical", level: 0 },
          Swift: { id: "Swift", level: 0 },
        },
        totalLevels: 0, // Reset levels
        unlocked: this.state.hordeState.unlocked, // Keep unlocked status
      },
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
        const { damage, isCrit, didHit } = this.calculateBattleDamage(
          battleState.playerStats,
          battleState.bossStats,
          effectiveBaseDamage,
          ability.damageType
        );
        
        if (!didHit) {
          // Attack missed
          battleState.log.push({
            time: battleState.battleTime,
            message: `Player's ${ability.name} missed!`,
            type: "player",
          });
        } else {
          // Apply Weak/Strong modifiers
          const damageModifier = getDamageModifier(battleState.playerStatusEffects);
          let finalDamage = Math.round(damage * damageModifier);
          
          // Apply damage (shield absorbs first for boss)
          const critText = isCrit ? " CRITICAL!" : "";
          if (battleState.bossShieldAmount > 0) {
            const shieldDamage = Math.min(battleState.bossShieldAmount, finalDamage);
            const hpDamage = finalDamage - shieldDamage;
            battleState.bossShieldAmount -= shieldDamage;
            battleState.bossHp = Math.max(0, battleState.bossHp - hpDamage);
            
            battleState.log.push({
              time: battleState.battleTime,
              message: `Player uses ${ability.name}: ${shieldDamage} shield + ${hpDamage} damage${critText}`,
              type: "player",
            });
          } else {
            battleState.bossHp = Math.max(0, battleState.bossHp - finalDamage);
            battleState.log.push({
              time: battleState.battleTime,
              message: `Player uses ${ability.name}: ${finalDamage} damage${critText}`,
              type: "player",
            });
          }
          
          // Apply status effects from ability (only on hit)
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
            // All other effects apply to boss (with resistance check)
            else {
              // Check if status effect is resisted
              const applicationChance = calculateStatusEffectChance(
                battleState.playerStats[StatValue.CONC],
                battleState.bossStats[StatValue.RES]
              );
              const applied = Math.random() < applicationChance;
              
              if (applied) {
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
              } else {
                // Status effect resisted
                let effectName = "";
                switch (statusEffect.type) {
                  case StatusEffectValue.Stun:
                    effectName = "Stun";
                    break;
                  case StatusEffectValue.Poison:
                    effectName = "Poison";
                    break;
                  case StatusEffectValue.Disarm:
                    effectName = "Disarm";
                    break;
                  case StatusEffectValue.Silence:
                    effectName = "Silence";
                    break;
                  case StatusEffectValue.Weak:
                    effectName = "Weakness";
                    break;
                }
                
                battleState.log.push({
                  time: battleState.battleTime,
                  message: `${battleState.bossName} resisted ${effectName}!`,
                  type: "result",
                });
              }
            }
          }
          
          // Check if boss defeated
          if (battleState.bossHp <= 0) {
            this.endBattle(true);
            return;
          }
        }
        
        // Reset cooldown
        ability.cooldown = ability.maxCooldown;
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
        const { damage, isCrit, didHit } = this.calculateBattleDamage(
          battleState.bossStats,
          battleState.playerStats,
          effectiveBaseDamage,
          ability.damageType
        );
        
        if (!didHit) {
          // Attack missed
          battleState.log.push({
            time: battleState.battleTime,
            message: `${battleState.bossName}'s ${ability.name} missed!`,
            type: "boss",
          });
        } else {
          // Apply Weak/Strong modifiers
          const damageModifier = getDamageModifier(battleState.bossStatusEffects);
          let finalDamage = Math.round(damage * damageModifier);
          
          // Apply damage (shield absorbs first for player)
          const critText = isCrit ? " CRITICAL!" : "";
          if (battleState.playerShieldAmount > 0) {
            const shieldDamage = Math.min(battleState.playerShieldAmount, finalDamage);
            const hpDamage = finalDamage - shieldDamage;
            battleState.playerShieldAmount -= shieldDamage;
            battleState.playerHp = Math.max(0, battleState.playerHp - hpDamage);
            
            battleState.log.push({
              time: battleState.battleTime,
              message: `${battleState.bossName} uses ${ability.name}: ${shieldDamage} shield + ${hpDamage} damage${critText}`,
              type: "boss",
            });
          } else {
            battleState.playerHp = Math.max(0, battleState.playerHp - finalDamage);
            battleState.log.push({
              time: battleState.battleTime,
              message: `${battleState.bossName} uses ${ability.name}: ${finalDamage} damage${critText}`,
              type: "boss",
            });
          }
          
          // Apply status effects from boss ability (only on hit)
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
            // All other effects apply to player (with resistance check)
            else {
              // Check if status effect is resisted
              const applicationChance = calculateStatusEffectChance(
                battleState.bossStats[StatValue.CONC],
                battleState.playerStats[StatValue.RES]
              );
              const applied = Math.random() < applicationChance;
              
              if (applied) {
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
              } else {
                // Status effect resisted
                let effectName = "";
                switch (statusEffect.type) {
                  case StatusEffectValue.Stun:
                    effectName = "Stun";
                    break;
                  case StatusEffectValue.Poison:
                    effectName = "Poison";
                    break;
                  case StatusEffectValue.Disarm:
                    effectName = "Disarm";
                    break;
                  case StatusEffectValue.Silence:
                    effectName = "Silence";
                    break;
                  case StatusEffectValue.Weak:
                    effectName = "Weakness";
                    break;
                }
                
                battleState.log.push({
                  time: battleState.battleTime,
                  message: `Player resisted ${effectName}!`,
                  type: "result",
                });
              }
            }
          }
          
          // Check if player defeated
          if (battleState.playerHp <= 0) {
            this.endBattle(false);
            return;
          }
        }
        
        // Reset cooldown
        ability.cooldown = ability.maxCooldown;
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
  ): { damage: number; isCrit: boolean; didHit: boolean } {
    // Check if attack hits
    const hitChance = calculateHitChance(
      attackerStats[StatValue.DEX],
      defenderStats[StatValue.AGI]
    );
    const didHit = Math.random() < hitChance;
    
    if (!didHit) {
      return { damage: 0, isCrit: false, didHit: false };
    }
    
    // Get relevant stat
    const attackStat = damageType === DamageValue.Physical
      ? attackerStats[StatValue.STR]
      : damageType === DamageValue.Magic
      ? attackerStats[StatValue.INT]
      : 0;
    
    let damage = baseDamage + attackStat;
    
    // Apply crit
    const critChance = calculateCritChance(attackerStats[StatValue.CRIT_C], defenderStats);
    const isCrit = Math.random() < critChance;
    
    if (isCrit) {
      // CRIT_D stored as percentage (e.g., 150 = 150% damage)
      damage *= (attackerStats[StatValue.CRIT_D] / 100);
    }
    
    // Apply damage reduction
    if (damageType !== DamageValue.True) {
      const reduction = calculateDamageReduction(damageType, defenderStats);
      damage *= reduction;
    }
    
    return { damage: Math.ceil(damage), isCrit, didHit: true };
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
      
      // Unlock Horde system after defeating Goblin King 5+ times
      if (!newState.hordeState.unlocked && this.state.currentBossId === "GoblinKing") {
        const goblinKingDefeats = newBossProgress["GoblinKing"].defeated;
        if (goblinKingDefeats >= 5) {
          newState.hordeState = {
            ...newState.hordeState,
            unlocked: true,
          };
        }
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

