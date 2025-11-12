// src/core/statusEffects.ts
// Status Effect System - Processing and calculations

import type { 
  ActiveStatusEffect, 
  StatusEffectConfig, 
  StatusEffectType 
} from "../types/data";
import { StatusEffectValue } from "../types/data";

/**
 * Calculate the effective value for a status effect at a given ability level
 */
export function calculateStatusEffectValue(
  config: StatusEffectConfig,
  abilityLevel: number,
  maxLevel: number = 100
): { duration: number; value: number } {
  // Ensure level is at least 1
  const level = Math.max(1, abilityLevel);
  const progress = Math.min(1, (level - 1) / (maxLevel - 1));
  
  // Interpolate duration
  const duration = config.baseDuration + 
    (config.maxDuration - config.baseDuration) * progress;
  
  // Interpolate value (if applicable)
  let value = 0;
  if (config.baseValue !== undefined && config.maxValue !== undefined) {
    value = Math.ceil(config.baseValue + (config.maxValue - config.baseValue) * progress);
  }
  
  return { duration, value };
}

/**
 * Create an active status effect from a config
 */
export function createActiveStatusEffect(
  config: StatusEffectConfig,
  abilityLevel: number,
  source: "player" | "boss",
  battleTime: number
): ActiveStatusEffect {
  const { duration, value } = calculateStatusEffectValue(config, abilityLevel);
  
  return {
    type: config.type,
    duration,
    value,
    tickRate: config.tickRate,
    lastTick: config.tickRate ? battleTime : undefined,
    source,
  };
}

/**
 * Update status effect durations and remove expired effects
 * Returns array of expired effects for logging
 */
export function updateStatusEffects(
  effects: ActiveStatusEffect[],
  deltaTime: number
): { 
  updatedEffects: ActiveStatusEffect[]; 
  expiredEffects: ActiveStatusEffect[] 
} {
  const expiredEffects: ActiveStatusEffect[] = [];
  
  const updatedEffects = effects
    .map(effect => ({
      ...effect,
      duration: effect.duration - deltaTime,
    }))
    .filter(effect => {
      if (effect.duration <= 0) {
        expiredEffects.push(effect);
        return false;
      }
      return true;
    });
  
  return { updatedEffects, expiredEffects };
}

/**
 * Check if a combatant has a specific status effect
 */
export function hasStatusEffect(
  effects: ActiveStatusEffect[],
  type: StatusEffectType
): boolean {
  return effects.some(effect => effect.type === type);
}

/**
 * Get the total percentage modifier from Weak/Strong effects
 * Returns a multiplier (e.g., 0.8 for 20% reduction, 1.3 for 30% increase)
 */
export function getDamageModifier(effects: ActiveStatusEffect[]): number {
  let modifier = 1.0;
  
  for (const effect of effects) {
    if (effect.type === StatusEffectValue.Weak) {
      // value is stored as a percentage (e.g., 20 for 20%)
      modifier *= (1 - effect.value / 100);
    } else if (effect.type === StatusEffectValue.Strong) {
      modifier *= (1 + effect.value / 100);
    }
  }
  
  return modifier;
}

/**
 * Check if cooldowns should be frozen (Stun effect)
 */
export function areCooldownsFrozen(effects: ActiveStatusEffect[]): boolean {
  return hasStatusEffect(effects, StatusEffectValue.Stun);
}

/**
 * Check if physical abilities are disabled (Disarm effect)
 */
export function isPhysicalDisabled(effects: ActiveStatusEffect[]): boolean {
  return hasStatusEffect(effects, StatusEffectValue.Disarm);
}

/**
 * Check if magical abilities are disabled (Silence effect)
 */
export function isMagicalDisabled(effects: ActiveStatusEffect[]): boolean {
  return hasStatusEffect(effects, StatusEffectValue.Silence);
}

/**
 * Get the current shield amount from active Shield effects
 */
export function getShieldAmount(effects: ActiveStatusEffect[]): number {
  const shieldEffect = effects.find(e => e.type === StatusEffectValue.Shield);
  return shieldEffect?.value ?? 0;
}

/**
 * Update shield effect value (when damage is absorbed)
 */
export function updateShieldEffect(
  effects: ActiveStatusEffect[],
  newShieldValue: number
): ActiveStatusEffect[] {
  return effects.map(effect => {
    if (effect.type === StatusEffectValue.Shield) {
      return { ...effect, value: Math.max(0, newShieldValue) };
    }
    return effect;
  }).filter(effect => {
    // Remove shield effect if value drops to 0
    if (effect.type === StatusEffectValue.Shield && effect.value <= 0) {
      return false;
    }
    return true;
  });
}

/**
 * Process poison damage over time
 * Returns total damage dealt this tick
 */
export function processPoisonDamage(
  effects: ActiveStatusEffect[],
  deltaTime: number,
  battleTime: number
): { damage: number; updatedEffects: ActiveStatusEffect[] } {
  let totalDamage = 0;
  
  const updatedEffects = effects.map(effect => {
    if (effect.type === StatusEffectValue.Poison && effect.tickRate) {
      const timeSinceLastTick = battleTime - (effect.lastTick ?? 0);
      
      // Check if it's time for a damage tick
      if (timeSinceLastTick >= effect.tickRate) {
        totalDamage += Math.ceil(effect.value);
        return { ...effect, lastTick: battleTime };
      }
    }
    return effect;
  });
  
  return { damage: Math.ceil(totalDamage), updatedEffects };
}

/**
 * Add a new status effect or refresh existing one
 * If the same effect type exists, take the stronger one
 */
export function addOrRefreshStatusEffect(
  effects: ActiveStatusEffect[],
  newEffect: ActiveStatusEffect
): ActiveStatusEffect[] {
  const existingIndex = effects.findIndex(e => e.type === newEffect.type);
  
  if (existingIndex >= 0) {
    const existing = effects[existingIndex];
    
    // For Shield, stack the values
    if (newEffect.type === StatusEffectValue.Shield) {
      return effects.map((effect, idx) => 
        idx === existingIndex 
          ? { ...effect, value: effect.value + newEffect.value, duration: Math.max(effect.duration, newEffect.duration) }
          : effect
      );
    }
    
    // For other effects, keep the stronger one (higher value/duration)
    const useNew = newEffect.value > existing.value || 
                   (newEffect.value === existing.value && newEffect.duration > existing.duration);
    
    if (useNew) {
      return effects.map((effect, idx) => idx === existingIndex ? newEffect : effect);
    }
    
    return effects;
  }
  
  // Add new effect
  return [...effects, newEffect];
}

