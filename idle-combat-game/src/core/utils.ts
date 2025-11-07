// src/core/utils.ts

import { EXP_BASE, EXP_GROWTH_RATE } from "./constants";
import type { JobDefinition, SkillDefinition } from "../types/data";
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
    if (condition.type === "jobLevel") {
      const job = gameState.jobs[condition.jobId];
      if (!job) return false;
      const { level } = calculateLevelFromExp(job.exp);
      return level >= condition.level;
    } else if (condition.type === "stat") {
      return playerStats[condition.stat] >= condition.value;
    }
    return false;
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
    if (condition.type === "stat") {
      return playerStats[condition.stat] >= condition.value;
    } else if (condition.type === "skillTotalLevels") {
      const totalSkillLevels = calculateTotalSkillLevels(gameState);
      return totalSkillLevels >= condition.value;
    }
    return false;
  });
};

/**
 * Checks if a skill is available (exists in the game state)
 */
export const isSkillAvailable = (skillId: string, gameState: GameState): boolean => {
  return skillId in gameState.skills;
};
