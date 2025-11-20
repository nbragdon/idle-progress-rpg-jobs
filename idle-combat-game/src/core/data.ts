// src/core/data.ts

import {
  type StatDefinition,
  type JobDefinition,
  type SkillDefinition,
  type AbilityDefinition,
  type AscensionUpgradeDefinition,
  type BossDefinition,
  type StatusEffectId,
  DamageValue,
} from "../types/data";

// Import the necessary types and the new enum from game.ts
import type { StatId } from "../types/game";
import { StatValue } from "../types/game";

// Replacing lucide-react with react-icons (using Font Awesome and Game-icons for similarity)
import {
  FaHeart,
  FaBookOpen,
  FaSyncAlt,
  FaAnchor,
  FaFeatherAlt,
  FaBolt,
  FaDiceD6,
} from "react-icons/fa";

import {
  GiCrossedSwords,
  GiTargetDummy,
  GiShieldImpact,
  GiLightningSpanner,
  GiStarFormation,
} from "react-icons/gi";
import { FaBurst } from "react-icons/fa6";
import type { IconBaseProps } from "react-icons";


// --- STATS ---
export const STAT_MAP: Record<StatId, StatDefinition> = {
  // Primary Combat Stats (Scaled by Jobs)
  [StatValue.STR]: {
    id: StatValue.STR,
    name: "Strength",
    desc: "Increases Physical ability damage. Added directly to physical attack damage.",
    icon: GiCrossedSwords, // Swords -> GiCrossedSwords
  },
  [StatValue.DEX]: {
    id: StatValue.DEX,
    name: "Dexterity",
    desc: "Increases hit chance. Higher DEX makes it easier to land attacks against the opponent's AGI.",
    icon: GiTargetDummy, // Target -> GiTargetDummy
  },
  [StatValue.AGI]: {
    id: StatValue.AGI,
    name: "Agility",
    desc: "Increases evasion. Higher AGI makes it harder for opponents to hit you with their attacks.",
    icon: FaFeatherAlt, // Feather -> FaFeatherAlt
  },
  [StatValue.TGH]: {
    id: StatValue.TGH,
    name: "Toughness",
    desc: "Reduces Physical damage taken. Also reduces opponent's critical hit chance.",
    icon: GiShieldImpact, // Shield -> GiShieldImpact
  },
  [StatValue.CON]: {
    id: StatValue.CON,
    name: "Constitution",
    desc: "Increases maximum HP. Each point grants 10 additional HP.",
    icon: FaHeart, // Heart -> FaHeart
  },
  [StatValue.INT]: {
    id: StatValue.INT,
    name: "Intelligence",
    desc: "Increases Magic ability damage. Added directly to magic attack damage.",
    icon: FaBookOpen, // BookOpen -> FaBookOpen
  },

  // Secondary Combat & Utility Stats
  [StatValue.FRT]: {
    id: StatValue.FRT,
    name: "Fortitude",
    desc: "Reduces Magic damage taken. Also reduces opponent's critical hit chance.",
    icon: FaAnchor, // Anchor -> FaAnchor
  },
  [StatValue.CONC]: {
    id: StatValue.CONC,
    name: "Concentration",
    desc: "Increases status effect application chance. Higher CONC makes it easier to apply status effects against opponent's RES.",
    icon: FaBolt, // Bolt -> FaBolt
  },
  [StatValue.RES]: {
    id: StatValue.RES,
    name: "Resistance",
    desc: "Increases status effect resistance. Higher RES makes it harder for opponents to apply status effects.",
    icon: FaSyncAlt, // RefreshCw -> FaSyncAlt
  },
  [StatValue.CRIT_C]: {
    id: StatValue.CRIT_C,
    name: "Crit Chance",
    desc: "Determines critical hit chance relative to opponent's defenses. When 10x opponent's average TGH and FRT, grants 100% crit.",
    icon: FaDiceD6, // Dices -> FaDiceD6
  },
  [StatValue.CRIT_D]: {
    id: StatValue.CRIT_D,
    name: "Crit Damage",
    desc: "Damage multiplier on critical hits. Stored as percentage (e.g., 150 = 150% damage on crits).",
    icon: FaBurst,
  },
};

// --- JOBS ---
// Import all jobs from the organized job data structure
import { ALL_JOBS } from "../data/jobs";

export const JOB_DATA: Record<string, JobDefinition> = ALL_JOBS;

// --- SKILLS ---
// Import all skills from the organized skills data structure
import { ALL_SKILLS } from "../data/skills";

export const SKILL_DATA: Record<string, SkillDefinition> = ALL_SKILLS;

// --- ABILITIES ---
// Import all abilities from the organized abilities data structure
import { ALL_ABILITIES } from "../data/abilities";

export const ABILITY_DATA: Record<string, AbilityDefinition> = ALL_ABILITIES;

// --- PATHS ---
// Import all paths from the organized paths data structure
import { PATH_DATA } from "../data/paths";

export { PATH_DATA };

// --- BOSSES ---
// Import all bosses from the organized bosses data structure
import { ALL_BOSSES } from "../data/bosses";

export const BOSS_DATA = ALL_BOSSES;

// --- ASCENSION UPGRADES ---
export const ASCENSION_UPGRADES: AscensionUpgradeDefinition[] = [
  {
    id: "jobExp",
    name: "All Job EXP",
    description: "Multiplies all Job EXP gain by 5x per level.",
    maxLevel: 10,
    cost: (lvl) => Math.pow(10, lvl), // 1, 10, 100, 1000, etc.
    effect: (lvl) => lvl * 5, // 5x per level
  },
  {
    id: "skillExp",
    name: "All Skill EXP",
    description: "Multiplies all Skill EXP gain by 5x per level.",
    maxLevel: 10,
    cost: (lvl) => Math.pow(10, lvl), // 1, 10, 100, 1000, etc.
    effect: (lvl) => lvl * 5, // 5x per level
  },
  {
    id: "maxAbilities",
    name: "All Ability EXP",
    description: "Multiplies all Ability EXP gain by 5x per level.",
    maxLevel: 10,
    cost: (lvl) => Math.pow(10, lvl), // 1, 10, 100, 1000, etc.
    effect: (lvl) => lvl * 5, // 5x per level
  },
  {
    id: "maxBattleAbilities",
    name: "Battle Ability Slots",
    description: "Increases the number of abilities you can use in battle by 1 per level.",
    maxLevel: 3,
    cost: (lvl) => [3, 50, 300][lvl] || 300, // Level 1: 3 AP, Level 2: 50 AP, Level 3: 300 AP
    effect: (lvl) => lvl, // +1 slot per level
    unlockConditions: [{ type: "bossDefeats", bossId: "TrainingDummy", count: 3 }],
  },
  {
    id: "maxActiveJobs",
    name: "Dual Job Training",
    description: "Train 2 jobs simultaneously. Essential early-game upgrade before unlocking Omnipresent Training.",
    maxLevel: 1,
    cost: (lvl) => 5, // 5 AP
    effect: (lvl) => lvl, // +1 slot
    unlockConditions: [{ type: "bossDefeats", bossId: "TrainingDummy", count: 3 }],
  },
  {
    id: "maxActiveSkills",
    name: "Dual Skill Training",
    description: "Train 2 skills simultaneously. Essential early-game upgrade before unlocking Universal Mastery.",
    maxLevel: 1,
    cost: (lvl) => 5, // 5 AP
    effect: (lvl) => lvl, // +1 slot
    unlockConditions: [{ type: "bossDefeats", bossId: "TrainingDummy", count: 3 }],
  },
  {
    id: "maxActiveAbilities",
    name: "Dual Ability Training",
    description: "Train 2 abilities simultaneously. Essential early-game upgrade before unlocking Perfect Practice.",
    maxLevel: 1,
    cost: (lvl) => 5, // 5 AP
    effect: (lvl) => lvl, // +1 slot
    unlockConditions: [{ type: "bossDefeats", bossId: "TrainingDummy", count: 3 }],
  },
  {
    id: "physicalTraitBonus",
    name: "Physical Mastery",
    description: "Increases stats from Physical jobs by 50% per level.",
    maxLevel: 5,
    cost: (lvl) => [15, 20, 25, 30, 35][lvl] || 35, // 15, 20, 25, 30, 35 AP
    effect: (lvl) => lvl * 50, // 50% per level
    unlockConditions: [{ type: "ascensions", count: 15 }],
  },
  {
    id: "magicalTraitBonus",
    name: "Magical Mastery",
    description: "Increases stats from Magical jobs by 50% per level.",
    maxLevel: 5,
    cost: (lvl) => [15, 20, 25, 30, 35][lvl] || 35, // 15, 20, 25, 30, 35 AP
    effect: (lvl) => lvl * 50, // 50% per level
    unlockConditions: [{ type: "ascensions", count: 15 }],
  },
  {
    id: "swiftTraitBonus",
    name: "Swift Mastery",
    description: "Increases stats from Swift jobs by 50% per level.",
    maxLevel: 5,
    cost: (lvl) => [15, 20, 25, 30, 35][lvl] || 35, // 15, 20, 25, 30, 35 AP
    effect: (lvl) => lvl * 50, // 50% per level
    unlockConditions: [{ type: "ascensions", count: 15 }],
  },
  {
    id: "autoTrainAllJobs",
    name: "Omnipresent Training",
    description: "Automatically trains ALL unlocked jobs simultaneously. No need to select which jobs to train.",
    maxLevel: 1,
    cost: (lvl) => 50, // 50 AP
    effect: (lvl) => lvl, // Just indicates purchased
    unlockConditions: [{ type: "bossDefeats", bossId: "AncientDragon", count: 1 }],
  },
  {
    id: "autoTrainAllSkills",
    name: "Universal Mastery",
    description: "Automatically trains ALL unlocked skills simultaneously. No need to select which skills to train.",
    maxLevel: 1,
    cost: (lvl) => 50, // 50 AP
    effect: (lvl) => lvl, // Just indicates purchased
    unlockConditions: [{ type: "bossDefeats", bossId: "AncientDragon", count: 1 }],
  },
  {
    id: "autoTrainAllAbilities",
    name: "Perfect Practice",
    description: "Automatically trains ALL unlocked abilities simultaneously. No need to select which abilities to train.",
    maxLevel: 1,
    cost: (lvl) => 50, // 50 AP
    effect: (lvl) => lvl, // Just indicates purchased
    unlockConditions: [{ type: "bossDefeats", bossId: "AncientDragon", count: 1 }],
  },
];
