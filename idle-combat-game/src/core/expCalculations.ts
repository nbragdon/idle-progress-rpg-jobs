// src/core/expCalculations.ts
// Helper functions to calculate exp per second for display

import type { GameState } from "../types/game";
import { JOB_DATA, SKILL_DATA } from "./data";
import { calculateLevelFromExp } from "./utils";

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

  const expMultiplier = 1.0 + globalSkillExpBonus;
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

  return SKILL_EXP_PER_SECOND * abilityExpMultiplier;
}

