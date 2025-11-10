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
    desc: "Reserved for future status effect mechanics. Currently not used in combat.",
    icon: FaBolt, // Bolt -> FaBolt
  },
  [StatValue.RES]: {
    id: StatValue.RES,
    name: "Resistance",
    desc: "Reserved for future status effect mechanics. Currently not used in combat.",
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

// --- BOSSES (UPDATED STRUCTURE) ---
export const BOSS_DATA: Record<string, BossDefinition> = {
  TrainingDummy: {
    id: "TrainingDummy",
    name: "Training Dummy",
    baseHp: 0, // HP now calculated from CON: 10 + (CON × 10)
    baseDamage: 25,
    stats: {
      [StatValue.STR]: 50,
      [StatValue.DEX]: 45,
      [StatValue.AGI]: 45,
      [StatValue.TGH]: 60,
      [StatValue.CON]: 80, // 10 + (80 × 10) = 810 HP
      [StatValue.INT]: 45,
      [StatValue.FRT]: 60,
      [StatValue.CONC]: 50,
      [StatValue.RES]: 50,
      [StatValue.CRIT_C]: 300, // Moderate crit chance vs player defenses
      [StatValue.CRIT_D]: 175, // 175% crit damage
    },
    ascensionPoints: 1,
    nextBoss: "GoblinKing",
    bossAbility: {
      name: "Wobble",
      cooldown: 3.5,
      // Added mandatory damageType field for AbilityEffect consistency
      effects: [{ baseDamage: 25, damageType: DamageValue.Physical }],
      id: "",
      description: "",
      icon: function (_props: IconBaseProps): React.ReactNode {
        throw new Error("Function not implemented.");
      },
      unlockCondition: {
        stat: StatValue.INT,
        required: 0
      },
      damageMultiplier: 0,
      statusEffect: undefined
    },
  },
  GoblinKing: {
    id: "GoblinKing",
    name: "Goblin King",
    baseHp: 0, // HP now calculated from CON: 10 + (CON × 10)
    baseDamage: 250,
    stats: {
      [StatValue.STR]: 500,
      [StatValue.DEX]: 450,
      [StatValue.AGI]: 450,
      [StatValue.TGH]: 600,
      [StatValue.CON]: 800, // 10 + (800 × 10) = 8010 HP (~10x Training Dummy)
      [StatValue.INT]: 450,
      [StatValue.FRT]: 600,
      [StatValue.CONC]: 500,
      [StatValue.RES]: 500,
      [StatValue.CRIT_C]: 3000, // ~10x Training Dummy
      [StatValue.CRIT_D]: 200, // 200% crit damage
    },
    ascensionPoints: 5,
    nextBoss: "AncientDragon",
    bossAbility: {
      name: "Vicious Strike",
      cooldown: 3.0,
      // Converted existing boss ability to use the new AbilityEffect interface
      effects: [{
        baseDamage: 250,
        damageType: DamageValue.Physical, // Defaulting to Physical for a strike
        statusEffect: {
          id: "Weakness" as StatusEffectId, duration: 5.0,
          concentration: 0
        },
      }],
      id: "",
      description: "",
      icon: function (_props: IconBaseProps): React.ReactNode {
        throw new Error("Function not implemented.");
      },
      unlockCondition: {
        stat: StatValue.INT,
        required: 0
      },
      damageMultiplier: 0,
      statusEffect: undefined
    },
  },
  AncientDragon: {
    id: "AncientDragon",
    name: "Ancient Dragon",
    baseHp: 0, // HP now calculated from CON: 10 + (CON × 10)
    baseDamage: 2500,
    stats: {
      [StatValue.STR]: 5000,
      [StatValue.DEX]: 4500,
      [StatValue.AGI]: 4500,
      [StatValue.TGH]: 6000,
      [StatValue.CON]: 8000, // 10 + (8000 × 10) = 80,010 HP (~10x Goblin King)
      [StatValue.INT]: 4500,
      [StatValue.FRT]: 6000,
      [StatValue.CONC]: 5000,
      [StatValue.RES]: 5000,
      [StatValue.CRIT_C]: 30000, // ~10x Goblin King
      [StatValue.CRIT_D]: 225, // 225% crit damage
    },
    ascensionPoints: 50,
    bossAbility: {
      name: "Inferno Breath",
      cooldown: 2.5,
      // Converted existing boss ability to use the new AbilityEffect interface
      effects: [{ baseDamage: 2500, damageType: DamageValue.Magic }],
      id: "",
      description: "",
      icon: function (_props: IconBaseProps): React.ReactNode {
        throw new Error("Function not implemented.");
      },
      unlockCondition: {
        stat: StatValue.INT,
        required: 0
      },
      damageMultiplier: 0,
      statusEffect: undefined
    },
  },
};

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
];
