// src/core/constants.ts

export const BASE_JOB_EXP_PER_SEC = 5;
export const BASE_SKILL_EXP_PER_SEC = 0.5;
export const BASE_ABILITY_EXP_PER_SEC = 0.2; // Slower ability progression

export const INITIAL_MAX_ACTIVE_JOBS = 1;
export const INITIAL_MAX_ACTIVE_SKILLS = 1;
export const INITIAL_MAX_ACTIVE_ABILITIES = 1;

export const EXP_BASE = 100;
export const EXP_GROWTH_RATE = 1.35; // 35% growth per level - sharper scaling for upgrades
export const ABILITY_LEVEL_REDUCTION = 0.005;
export const MAX_ABILITY_LEVEL = 100;

// Combat Constants
export const PLAYER_BASE_HP = 10;
export const HP_PER_CONSTITUTION = 10; // Each point of CON adds 10 HP

// Combat Formulas
export const MIN_DAMAGE_PERCENT = 0.10; // Damage can't be reduced below 10%
export const MIN_HIT_CHANCE = 0.05; // Hit chance can't go below 5% (updated from 10%)

// Battle System
export const BATTLE_TICK_RATE = 0.1; // Battle updates every 0.1 seconds
