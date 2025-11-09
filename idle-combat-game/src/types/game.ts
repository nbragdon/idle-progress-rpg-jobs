// src/types/game.ts

// src/types/game.ts
import type {
  AscensionUpgradeDefinition,
  BossDefinition,
  DamageType,
} from "./data";

export type StatusEffectId = "Poison" | "Stun" | "Weakness";

export interface AbilityEffect {
  damageMultiplier: number; // e.g., 2.0
  damageType: DamageType;
  statusEffect?: {
    id: StatusEffectId;
    duration: number; // in seconds
    concentration: number; // Base concentration value for the effect
  };
}

// --- Core Game Data Types ---

export interface JobState {
  id: string;
  exp: number;
  isActive: boolean;
  lastActiveTime: number; // Timestamp for tracking swaps
}

export interface SkillState {
  id: string;
  exp: number;
  isActive: boolean;
}

export interface AbilityState {
  id: string;
  exp: number;
  unlocked: boolean;
  isTraining: boolean;
  isActiveBattle: boolean; // Selected for battle use
}

export const StatValue = {
  STR: "STR",           // Strength
  DEX: "DEX",           // Dexterity
  AGI: "AGI",           // Agility
  TGH: "TGH",           // Toughness
  CON: "CON",           // Constitution
  INT: "INT",           // Intelligence
  FRT: "FRT",           // Fortitude
  CONC: "CONC",         // Concentration
  RES: "RES",           // Resistance
  CRIT_C: "CRIT_C",     // Critical Chance
  CRIT_D: "CRIT_D",     // Critical Damage
} as const;

export type StatId = typeof StatValue[keyof typeof StatValue];
export type PlayerStats = Record<StatId, number>;

// --- Battle Types ---

export type LogEntryType = "player" | "boss" | "ability" | "result";

export interface BattleLogEntry {
  time: number; // Time in seconds when the event occurred
  message: string;
  type: LogEntryType;
  value?: string; // e.g., 'Win', 'Loss', or the ability name
}

export interface BossProgress {
  defeated: number;
  lastBattleLog: BattleLogEntry[];
}

// --- Active Battle State ---

export interface BattleAbilityState {
  abilityId: string;
  name: string;
  level: number;
  cooldown: number; // Current cooldown remaining
  maxCooldown: number; // For calculating progress bar
  baseDamage: number;
  damageType: DamageType;
}

export interface BattleState {
  isActive: boolean;
  battleTime: number;
  
  // Player state
  playerHp: number;
  playerMaxHp: number;
  playerStats: PlayerStats;
  playerAbilities: BattleAbilityState[];
  
  // Boss state
  bossId: string;
  bossName: string;
  bossHp: number;
  bossMaxHp: number;
  bossStats: PlayerStats;
  bossAbilities: BattleAbilityState[];
  
  // Battle log
  log: BattleLogEntry[];
  
  // Battle result (set when battle ends)
  result?: {
    won: boolean;
    ascensionPoints?: number;
    nextBossUnlocked?: boolean;
    nextBossName?: string;
  };
}

// --- Main Game State ---

export interface GameState {
  // Core Progression
  jobs: Record<string, JobState>;
  skills: Record<string, SkillState>;
  abilities: Record<string, AbilityState>;

  // Currencies and Permanent Systems
  gold: number;
  ascensionPoints: number; // Actual AP that can be spent on upgrades
  potentialAscensionPoints: number; // AP earned but not yet claimed through ascension
  permanentUpgrades: Record<AscensionUpgradeDefinition["id"], number>;
  ascensionUnlocked: boolean; // Persists through resets - unlocked after first boss defeat

  // Limits and Time
  currentBossId: BossDefinition["id"];
  bossProgress: Record<BossDefinition["id"], BossProgress>; // Tracks defeats per boss
  lastTickTime: number;
  activeTab: "Jobs" | "Stats" | "Skills" | "Abilities" | "Boss" | "Ascension";
  
  // Active Battle
  battleState: BattleState | null;
}
