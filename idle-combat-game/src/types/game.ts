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
}

export type StatId =
  | "STR"
  | "DEX"
  | "AGI"
  | "TGH"
  | "CON"
  | "INT"
  | "FRT"
  | "CONC"
  | "RES"
  | "CRIT_C"
  | "CRIT_D"
  | "TotalLevels";
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

// --- Main Game State ---

export interface GameState {
  // Core Progression
  jobs: Record<string, JobState>;
  skills: Record<string, SkillState>;
  abilities: Record<string, AbilityState>;

  // Currencies and Permanent Systems
  gold: number;
  ascensionPoints: number;
  permanentUpgrades: Record<AscensionUpgradeDefinition["id"], number>;

  // Limits and Time
  currentBossId: BossDefinition["id"];
  bossProgress: Record<BossDefinition["id"], BossProgress>; // Tracks defeats per boss
  lastTickTime: number;
  activeTab: "Jobs" | "Stats" | "Skills" | "Abilities" | "Boss" | "Ascension";
}
