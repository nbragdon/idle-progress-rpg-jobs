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

/**
 * Defines the available job traits in the game.
 * Traits are characteristics that define a job's playstyle or specialty.
 */
export const TraitValue = {
  // Combat Styles
  Physical: "Physical",       // Focuses on physical combat
  Magical: "Magical",         // Focuses on magical combat
  Ranged: "Ranged",          // Focuses on ranged attacks
  Melee: "Melee",            // Focuses on melee combat
  
  // Specializations
  Tank: "Tank",              // Defensive specialist
  DPS: "DPS",                // Damage dealer
  Support: "Support",        // Support/utility role
  
  // Playstyles
  Aggressive: "Aggressive",  // High risk, high reward
  Defensive: "Defensive",    // Low risk, defensive playstyle
  Balanced: "Balanced",      // Balanced approach
  Swift: "Swift",            // Speed-focused
  
  // Advanced Traits
  Stealth: "Stealth",        // Stealth and evasion focused
  Tactical: "Tactical",      // Strategic and intelligent
  Berserker: "Berserker",    // Raw power and fury
  Guardian: "Guardian",      // Protection and defense
  Critical: "Critical",      // Critical strike focused
  Opportunist: "Opportunist", // Exploits weaknesses
  Skirmish: "Skirmish",      // Mobile hit-and-run
} as const;

export type TraitType = typeof TraitValue[keyof typeof TraitValue];

// --- Damage and Status Effect Types (NEW) ---
export type StatusEffectId = "Poison" | "Stun" | "Weakness";

export interface StatusEffectData {
  id: StatusEffectId;
  duration: number; // in seconds
  concentration: number; // Base concentration value for the effect
}

export interface AbilityEffect {
  baseDamage: number; // Flat damage amount for the ability
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
  traits: TraitType[]; // One or more traits defining the job's characteristics
  statBonuses: { stat: StatId; value: number }[];
  unlockConditions?: Array<
    | { type: "jobLevel"; jobId: string; level: number }
    | { type: "stat"; stat: StatId; value: number }
  >;
}

export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  icon: IconType;
  effects: Array<
    | { type: "jobExp"; value: number } // Global job EXP bonus
    | { type: "skillExp"; value: number } // Global skill EXP bonus
    | { type: "traitJobExp"; trait: TraitType; value: number } // Trait-specific job EXP bonus
  >;
  unlockConditions?: Array<
    | { type: "stat"; stat: StatId; value: number }
    | { type: "skillTotalLevels"; value: number }
  >;
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
  // Optional: Custom scaling for starter abilities
  damageScaling?: {
    type: "percentage"; // Percentage increase per level
    value: number; // e.g., 0.05 for 5% per level
  };
  cooldownScaling?: {
    type: "flat"; // Flat reduction per X levels
    reductionPerLevels: number; // e.g., 0.1 reduction per 10 levels
    levelsPerReduction: number; // e.g., 10 levels
    minCooldown: number; // Minimum cooldown in seconds
  };
}

export interface BossDefinition {
  id: string;
  name: string;
  baseHp: number;
  baseDamage: number;
  stats: { [key in StatId]: number }; // Boss has full stats like player
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
