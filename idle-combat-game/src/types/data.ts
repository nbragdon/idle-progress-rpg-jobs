// src/types/data.ts

import type { IconType } from "react-icons";
import type { StatId } from "./game";

/**
 * Defines the available damage classifications in the game.
 */
export const DamageValue = {
  Physical: "Physical", // Physical damage (reduced by Toughness)
  Magic: 'Magic', // Magic damage (reduced by Fortitude),
  True: "True",         // True damage (ignores resistance)
} as const;

export type DamageType = typeof DamageValue[keyof typeof DamageValue];

// --- Damage and Status Effect Types (NEW) ---
export type StatusEffectId = "Poison" | "Stun" | "Weakness";

export interface StatusEffectData {
  id: StatusEffectId;
  duration: number; // in seconds
  concentration: number; // Base concentration value for the effect
}

export interface AbilityEffect {
  damageMultiplier: number; // e.g., 2.0
  damageType: DamageType;
  statusEffect?: StatusEffectData;
}
// ---------------------------------------------

// --- Base Definitions (Updated to use new types) ---

export interface StatDefinition {
  id: StatId;
  name: string;
  desc: string;
  icon: IconType;
}

export interface JobDefinition {
  id: string;
  name: string;
  description: string;
  icon: IconType;
  statBonuses: { stat: StatId; value: number }[];
}

export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  icon: IconType;
  effects: { type: "jobExp" | "skillExp"; value: number }[]; // Global multiplier effect per level
  unlockCondition: { stat: StatId; required: number };
}

export interface AbilityDefinition {
  damageMultiplier: number;
  statusEffect: any;
  id: string;
  name: string;
  description: string;
  icon: IconType;
  cooldown: number; // Base cooldown in seconds
  unlockCondition: { stat: StatId; required: number };
  effects: AbilityEffect[];
}

export interface BossDefinition {
  id: string;
  name: string;
  baseHp: number;
  baseDamage: number;
  ascensionPoints: number;
  nextBoss?: string;
  bossAbility: AbilityDefinition;
}

export const AscensionUpgradeIdValue = {
  jobExp: "jobExp",
  skillExp: "skillExp",
  maxSkills: "maxSkills",
  maxAbilities: "maxAbilities",
  maxActiveJobs: "maxActiveJobs",
} as const;

export type AscensionUpgradeId = typeof AscensionUpgradeIdValue[keyof typeof AscensionUpgradeIdValue];

export interface AscensionUpgradeDefinition {
  id: AscensionUpgradeId;
  name: string;
  description: string;
  maxLevel: number;
  cost: (level: number) => number; // Function to calculate next cost
  effect: (level: number) => number; // Function to calculate next effect (for display)
}
