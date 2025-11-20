// src/core/utils.ts

import { EXP_BASE, EXP_GROWTH_RATE } from "./constants";
import type { JobDefinition, SkillDefinition, AbilityDefinition } from "../types/data";
import type { GameState, PlayerStats } from "../types/game";

/** Calculates required experience for the next level. */
export const calculateExpNeeded = (level: number): number => {
  if (level === 0) return EXP_BASE;
  return Math.floor(EXP_BASE * Math.pow(EXP_GROWTH_RATE, level - 1));
};

/** 
 * Calculates the current level based on total EXP.
 * Returns the level and remaining EXP towards the next level.
 */
export const calculateLevelFromExp = (totalExp: number): { level: number; currentLevelExp: number; expNeeded: number } => {
  if (totalExp === 0) {
    return { level: 0, currentLevelExp: 0, expNeeded: EXP_BASE };
  }

  let level = 0;
  let expConsumed = 0; // Total EXP consumed by all previous levels

  // Keep leveling up until we don't have enough EXP for the next level
  while (true) {
    const expNeededForNextLevel = calculateExpNeeded(level);
    
    // Check if we have enough EXP to reach the next level
    if (expConsumed + expNeededForNextLevel > totalExp) {
      // Not enough EXP for next level, stay at current level
  const currentLevelExp = totalExp - expConsumed;
  return { level, currentLevelExp, expNeeded: expNeededForNextLevel };
    }
    
    // We have enough EXP, level up!
    expConsumed += expNeededForNextLevel;
    level++;
  }
};

/**
 * Calculates the total levels across all jobs
 */
export const calculateTotalLevels = (gameState: GameState): number => {
  return Object.values(gameState.jobs).reduce((sum, job) => {
    const { level } = calculateLevelFromExp(job.exp);
    return sum + level;
  }, 0);
};

/**
 * Checks if a job's unlock conditions are met
 */
export const isJobUnlocked = (
  jobDef: JobDefinition,
  gameState: GameState,
  playerStats: PlayerStats
): boolean => {
  // Jobs without unlock conditions are always unlocked
  if (!jobDef.unlockConditions || jobDef.unlockConditions.length === 0) {
    return true;
  }

  // All conditions must be met
  return jobDef.unlockConditions.every((condition) => {
    switch (condition.type) {
      case "jobLevel": {
        const job = gameState.jobs[condition.jobId];
        if (!job) return false;
        const { level } = calculateLevelFromExp(job.exp);
        return level >= condition.level;
      }
      
      case "stat": {
        return playerStats[condition.stat] >= condition.value;
      }
      
      case "totalJobLevels": {
        const totalLevels = calculateTotalLevels(gameState);
        return totalLevels >= condition.value;
      }
      
      case "totalSkillLevels": {
        const totalSkillLevels = calculateTotalSkillLevels(gameState);
        return totalSkillLevels >= condition.value;
      }
      
      case "abilityLevel": {
        const ability = gameState.abilities[condition.abilityId];
        if (!ability || !ability.unlocked) return false;
        const { level } = calculateLevelFromExp(ability.exp);
        return level >= condition.level;
      }
      
      case "skillLevel": {
        const skill = gameState.skills[condition.skillId];
        if (!skill) return false;
        const { level } = calculateLevelFromExp(skill.exp);
        return level >= condition.level;
      }
      
      case "bossDefeats": {
        const bossProgress = gameState.bossProgress[condition.bossId];
        if (!bossProgress) return false;
        return bossProgress.defeated >= condition.count;
      }
      
      case "anyJobFromList": {
        return condition.jobIds.some(jobId => {
          const job = gameState.jobs[jobId];
          if (!job) return false;
          const { level } = calculateLevelFromExp(job.exp);
          return level >= condition.level;
        });
      }
      
      case "anyStat": {
        return Object.values(playerStats).some(statValue => statValue >= condition.value);
      }
      
      default:
        return false;
    }
  });
};

/**
 * Checks if a job is available (exists in the game state)
 */
export const isJobAvailable = (jobId: string, gameState: GameState): boolean => {
  return jobId in gameState.jobs;
};

/**
 * Calculates the total levels across all skills
 */
export const calculateTotalSkillLevels = (gameState: GameState): number => {
  return Object.values(gameState.skills).reduce((sum, skill) => {
    const { level } = calculateLevelFromExp(skill.exp);
    return sum + level;
  }, 0);
};

/**
 * Checks if a skill's unlock conditions are met
 */
export const isSkillUnlocked = (
  skillDef: SkillDefinition,
  gameState: GameState,
  playerStats: PlayerStats
): boolean => {
  // Skills without unlock conditions are always unlocked
  if (!skillDef.unlockConditions || skillDef.unlockConditions.length === 0) {
    return true;
  }

  // All conditions must be met
  return skillDef.unlockConditions.every((condition) => {
    switch (condition.type) {
      case "stat": {
        return playerStats[condition.stat] >= condition.value;
      }
      
      case "skillTotalLevels": {
        const totalSkillLevels = calculateTotalSkillLevels(gameState);
        return totalSkillLevels >= condition.value;
      }
      
      case "totalJobLevels": {
        const totalLevels = calculateTotalLevels(gameState);
        return totalLevels >= condition.value;
      }
      
      case "totalSkillLevels": {
        const totalSkillLevels = calculateTotalSkillLevels(gameState);
        return totalSkillLevels >= condition.value;
      }
      
      case "skillLevel": {
        const skill = gameState.skills[condition.skillId];
        if (!skill) return false;
        const { level } = calculateLevelFromExp(skill.exp);
        return level >= condition.level;
      }
      
      case "bossDefeats": {
        const bossProgress = gameState.bossProgress[condition.bossId];
        if (!bossProgress) return false;
        return bossProgress.defeated >= condition.count;
      }
      
      case "anyJobFromList": {
        return condition.jobIds.some(jobId => {
          const job = gameState.jobs[jobId];
          if (!job) return false;
          const { level } = calculateLevelFromExp(job.exp);
          return level >= condition.level;
        });
      }
      
      case "anyAbilityLevel": {
        return Object.values(gameState.abilities).some(ability => {
          if (!ability.unlocked) return false;
          const { level } = calculateLevelFromExp(ability.exp);
          return level >= condition.level;
        });
      }
      
      default:
        return false;
    }
  });
};

/**
 * Checks if a skill is available (exists in the game state)
 */
export const isSkillAvailable = (skillId: string, gameState: GameState): boolean => {
  return skillId in gameState.skills;
};

/**
 * Checks if an ability's unlock conditions are met
 * Supports both legacy unlockCondition and new unlockConditions
 */
export const isAbilityUnlocked = (
  abilityDef: AbilityDefinition,
  gameState: GameState,
  playerStats: PlayerStats
): boolean => {
  // Check legacy unlock condition (single stat requirement)
  const legacyConditionMet = playerStats[abilityDef.unlockCondition.stat] >= abilityDef.unlockCondition.required;
  
  // If no new unlock conditions, use legacy only
  if (!abilityDef.unlockConditions || abilityDef.unlockConditions.length === 0) {
    return legacyConditionMet;
  }
  
  // If new unlock conditions exist, all must be met (in addition to legacy condition being met OR new conditions being sufficient)
  const newConditionsMet = abilityDef.unlockConditions.every((condition) => {
    switch (condition.type) {
      case "jobLevel": {
        const job = gameState.jobs[condition.jobId];
        if (!job) return false;
        const { level } = calculateLevelFromExp(job.exp);
        return level >= condition.level;
      }
      
      case "stat": {
        return playerStats[condition.stat] >= condition.value;
      }
      
      case "totalJobLevels": {
        const totalLevels = calculateTotalLevels(gameState);
        return totalLevels >= condition.value;
      }
      
      case "abilityLevel": {
        const ability = gameState.abilities[condition.abilityId];
        if (!ability || !ability.unlocked) return false;
        const { level } = calculateLevelFromExp(ability.exp);
        return level >= condition.level;
      }
      
      case "skillLevel": {
        const skill = gameState.skills[condition.skillId];
        if (!skill) return false;
        const { level } = calculateLevelFromExp(skill.exp);
        return level >= condition.level;
      }
      
      case "bossDefeats": {
        const bossProgress = gameState.bossProgress[condition.bossId];
        if (!bossProgress) return false;
        return bossProgress.defeated >= condition.count;
      }
      
      default:
        return false;
    }
  });
  
  return newConditionsMet;
};

/**
 * Checks if an ability is available (unlocked in the game state)
 */
export const isAbilityAvailable = (abilityId: string, gameState: GameState): boolean => {
  const ability = gameState.abilities[abilityId];
  return ability && ability.unlocked;
};

/**
 * Checks if an ascension upgrade is unlocked based on unlock conditions
 */
export const isAscensionUpgradeUnlocked = (
  upgrade: { unlockConditions?: Array<
    | { type: "bossDefeats"; bossId: string; count: number }
    | { type: "ascensions"; count: number }
  > },
  gameState: GameState
): boolean => {
  // If no unlock conditions, it's always unlocked
  if (!upgrade.unlockConditions || upgrade.unlockConditions.length === 0) {
    return true;
  }

  // Check all conditions (AND logic - all must be met)
  return upgrade.unlockConditions.every((condition) => {
    if (condition.type === "bossDefeats") {
      const progress = gameState.bossProgress[condition.bossId];
      return progress && progress.defeated >= condition.count;
    }
    if (condition.type === "ascensions") {
      return gameState.pathState.totalAscensions >= condition.count;
    }
    return false;
  });
};
