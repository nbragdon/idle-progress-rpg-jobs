// src/core/expCalculations.ts
// Helper functions to calculate exp per second for display

import type { GameState } from "../types/game";
import { JOB_DATA, SKILL_DATA, PATH_DATA } from "./data";
import { calculateLevelFromExp } from "./utils";
import type { PathEffect } from "../types/data";

// Path growth calculation helper
const PATH_GROWTH_TIME_MS = 60 * 60 * 1000; // 1 hour in milliseconds

function calculatePathMultiplier(effect: PathEffect, selectionTime: number, currentTime: number): number {
  const elapsedTime = currentTime - selectionTime;
  const growthProgress = Math.min(1, elapsedTime / PATH_GROWTH_TIME_MS);
  return effect.baseValue + (effect.maxValue - effect.baseValue) * growthProgress;
}

// Constants from GameEngine
const EXP_PER_SECOND = 10;
const SKILL_EXP_PER_SECOND = 25; // 5x faster for skills and abilities

/**
 * Calculate exp per second for a specific job
 * Calculates potential exp/s regardless of whether job is active
 */
export function calculateJobExpPerSecond(jobId: string, gameState: GameState): number {
  const job = gameState.jobs[jobId];
  if (!job) return 0;

  // Get ascension upgrade multipliers
  const jobExpLevel = gameState.permanentUpgrades.jobExp || 0;
  const jobExpMultiplier = 1 + (jobExpLevel * 5);

  // Calculate skill bonuses (trait-based) - ALL skills apply regardless of training status
  const skillBonuses: Record<string, number> = {};
  Object.entries(gameState.skills).forEach(([skillId, skill]) => {
    const skillDef = SKILL_DATA[skillId];
    const { level } = calculateLevelFromExp(skill.exp);
    
    if (skillDef && level > 0) {
      skillDef.effects.forEach(effect => {
        if (effect.type === "traitJobExp") {
          const currentBonus = skillBonuses[effect.trait] || 0;
          skillBonuses[effect.trait] = currentBonus + (effect.value * level);
        }
      });
    }
  });

  // Apply trait-based bonuses
  let expMultiplier = 1.0;
  const jobDef = JOB_DATA[jobId];
  if (jobDef && jobDef.traits) {
    jobDef.traits.forEach(trait => {
      if (skillBonuses[trait]) {
        expMultiplier += skillBonuses[trait];
      }
    });
  }
  
  // Apply path bonuses
  if (gameState.pathState.selectedPathId) {
    const pathDef = PATH_DATA[gameState.pathState.selectedPathId];
    if (pathDef) {
      const now = Date.now();
      pathDef.effects.forEach(effect => {
        if (effect.type === "traitJobExp" && effect.trait && jobDef?.traits.includes(effect.trait)) {
          const multiplier = calculatePathMultiplier(effect, gameState.pathState.selectionTime, now);
          expMultiplier *= multiplier;
        } else if (effect.type === "jobExp") {
          const multiplier = calculatePathMultiplier(effect, gameState.pathState.selectionTime, now);
          expMultiplier *= multiplier;
        }
      });
    }
  }

  return EXP_PER_SECOND * expMultiplier * jobExpMultiplier;
}

/**
 * Calculate exp per second for a specific skill
 * Calculates potential exp/s regardless of whether skill is active
 */
export function calculateSkillExpPerSecond(skillId: string, gameState: GameState): number {
  const skill = gameState.skills[skillId];
  if (!skill) return 0;

  // Get ascension upgrade multipliers
  const skillExpLevel = gameState.permanentUpgrades.skillExp || 0;
  const skillExpMultiplier = 1 + (skillExpLevel * 5);

  // Calculate global skill exp bonus - ALL skills apply regardless of training status
  let globalSkillExpBonus = 0;
  Object.entries(gameState.skills).forEach(([id, s]) => {
    const skillDef = SKILL_DATA[id];
    const { level } = calculateLevelFromExp(s.exp);
    
    if (skillDef && level > 0) {
      skillDef.effects.forEach(effect => {
        if (effect.type === "skillExp") {
          globalSkillExpBonus += effect.value * level;
        }
      });
    }
  });

  let expMultiplier = 1.0 + globalSkillExpBonus;
  
  // Apply path bonuses
  if (gameState.pathState.selectedPathId) {
    const pathDef = PATH_DATA[gameState.pathState.selectedPathId];
    if (pathDef) {
      const now = Date.now();
      pathDef.effects.forEach(effect => {
        if (effect.type === "skillExp") {
          const multiplier = calculatePathMultiplier(effect, gameState.pathState.selectionTime, now);
          expMultiplier *= multiplier;
        }
      });
    }
  }
  
  return SKILL_EXP_PER_SECOND * expMultiplier * skillExpMultiplier;
}

/**
 * Calculate exp per second for a specific ability
 * Calculates potential exp/s regardless of whether ability is training
 * Returns 0 if ability is not unlocked
 */
export function calculateAbilityExpPerSecond(abilityId: string, gameState: GameState): number {
  const ability = gameState.abilities[abilityId];
  if (!ability || !ability.unlocked) return 0;

  // Get ascension upgrade multipliers
  const abilityExpLevel = gameState.permanentUpgrades.maxAbilities || 0;
  const abilityExpMultiplier = 1 + (abilityExpLevel * 5);

  // Calculate global ability exp bonus - ALL skills apply regardless of training status
  let globalAbilityExpBonus = 0;
  Object.entries(gameState.skills).forEach(([id, s]) => {
    const skillDef = SKILL_DATA[id];
    const { level } = calculateLevelFromExp(s.exp);
    
    if (skillDef && level > 0) {
      skillDef.effects.forEach(effect => {
        if (effect.type === "abilityExp") {
          globalAbilityExpBonus += effect.value * level;
        }
      });
    }
  });

  let expMultiplier = 1.0 + globalAbilityExpBonus;
  
  // Apply path bonuses
  if (gameState.pathState.selectedPathId) {
    const pathDef = PATH_DATA[gameState.pathState.selectedPathId];
    if (pathDef) {
      const now = Date.now();
      pathDef.effects.forEach(effect => {
        if (effect.type === "abilityExp") {
          const multiplier = calculatePathMultiplier(effect, gameState.pathState.selectionTime, now);
          expMultiplier *= multiplier;
        }
      });
    }
  }

  return SKILL_EXP_PER_SECOND * expMultiplier * abilityExpMultiplier;
}

