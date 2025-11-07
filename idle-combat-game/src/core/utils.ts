// src/core/utils.ts

import { EXP_BASE, EXP_GROWTH_RATE } from "./constants";

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
