// src/game/GameEngine.ts
// Pure game logic - no React dependencies

import type { GameState, PlayerStats, JobState, SkillState } from "../types/game";
import { JOB_DATA, SKILL_DATA, ABILITY_DATA } from "../core/data";
import { 
  calculateLevelFromExp, 
  isJobUnlocked, 
  isJobAvailable,
  isSkillUnlocked,
  isSkillAvailable
} from "../core/utils";
import { StatValue } from "../types/game";

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
      [StatValue.CRIT_C]: 0, // Base 0% crit chance
      [StatValue.CRIT_D]: 0.5, // Base 50% crit damage
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

  // Game tick - grant EXP to active jobs, skills, and abilities
  tick(deltaTime: number): void {
    const EXP_PER_SECOND = 10; // Increased for faster progression
    const SKILL_EXP_PER_SECOND = 5; // Increased proportionally
    
    let hasChanges = false;
    const newState = { ...this.state, lastTickTime: Date.now() };

    // Calculate skill bonuses
    const skillBonuses: Record<string, number> = {}; // trait -> bonus multiplier
    let globalSkillExpBonus = 0; // Global skill EXP bonus
    Object.entries(this.state.skills).forEach(([skillId, skill]) => {
      if (skill.isActive) {
        const skillDef = SKILL_DATA[skillId];
        const { level } = calculateLevelFromExp(skill.exp);
        
        if (skillDef && level > 0) {
          skillDef.effects.forEach(effect => {
            if (effect.type === "traitJobExp") {
              const currentBonus = skillBonuses[effect.trait] || 0;
              skillBonuses[effect.trait] = currentBonus + (effect.value * level);
            } else if (effect.type === "skillExp") {
              globalSkillExpBonus += effect.value * level;
            }
          });
        }
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
        
        const expGain = EXP_PER_SECOND * deltaTime * expMultiplier;
        updatedJobs[jobId] = { ...job, exp: job.exp + expGain };
        hasChanges = true;
      }
    });

    // Grant EXP to active skills (with global skill EXP bonus)
    const updatedSkills = { ...newState.skills };
    Object.keys(updatedSkills).forEach((skillId) => {
      const skill = updatedSkills[skillId];
      if (skill.isActive) {
        const expMultiplier = 1.0 + globalSkillExpBonus;
        const expGain = SKILL_EXP_PER_SECOND * deltaTime * expMultiplier;
        updatedSkills[skillId] = { ...skill, exp: skill.exp + expGain };
        hasChanges = true;
      }
    });

    // Grant EXP to training abilities
    const updatedAbilities = { ...newState.abilities };
    Object.keys(updatedAbilities).forEach((abilityId) => {
      const ability = updatedAbilities[abilityId];
      if (ability.isTraining && ability.unlocked) {
        const expGain = SKILL_EXP_PER_SECOND * deltaTime;
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

    const trainingAbilityCount = Object.values(this.state.abilities).filter(a => a.isTraining).length;

    // If activating and at max limit
    if (!ability.isTraining && trainingAbilityCount >= maxTrainingAbilities) {
      return false;
    }

    const updatedAbilities = {
      ...this.state.abilities,
      [abilityId]: {
        ...ability,
        isTraining: !ability.isTraining,
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
  ascend(pointsToGain: number): void {
    // Implementation would reset jobs/skills but keep permanent upgrades
    // For now, simplified version
    this.setState({
      ...this.state,
      ascensionPoints: this.state.ascensionPoints + pointsToGain,
    });
  }

  // Start boss battle (placeholder)
  startBossBattle(): void {
    // Game logic for boss battles would go here
    console.log("Boss battle started");
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

