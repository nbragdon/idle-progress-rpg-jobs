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
    desc: "Base chance to deal critical damage. Reduced by opponent's average TGH and FRT.",
    icon: FaDiceD6, // Dices -> FaDiceD6
  },
  [StatValue.CRIT_D]: {
    id: StatValue.CRIT_D,
    name: "Crit Damage",
    desc: "Damage multiplier on critical hits. Value of 1.5 means 150% damage on crits.",
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
    baseDamage: 15,
    stats: {
      [StatValue.STR]: 35,
      [StatValue.DEX]: 30,
      [StatValue.AGI]: 30,
      [StatValue.TGH]: 40,
      [StatValue.CON]: 40, // 10 + (40 × 10) = 410 HP
      [StatValue.INT]: 30,
      [StatValue.FRT]: 40,
      [StatValue.CONC]: 35,
      [StatValue.RES]: 35,
      [StatValue.CRIT_C]: 0.10,
      [StatValue.CRIT_D]: 1.75,
    },
    ascensionPoints: 1,
    nextBoss: "GoblinKing",
    bossAbility: {
      name: "Wobble",
      cooldown: 4.0,
      // Added mandatory damageType field for AbilityEffect consistency
      effects: [{ baseDamage: 15, damageType: DamageValue.True }],
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
    baseDamage: 150,
    stats: {
      [StatValue.STR]: 350,
      [StatValue.DEX]: 300,
      [StatValue.AGI]: 300,
      [StatValue.TGH]: 400,
      [StatValue.CON]: 400, // 10 + (400 × 10) = 4010 HP (~10x Training Dummy's 410)
      [StatValue.INT]: 300,
      [StatValue.FRT]: 400,
      [StatValue.CONC]: 350,
      [StatValue.RES]: 350,
      [StatValue.CRIT_C]: 0.20,
      [StatValue.CRIT_D]: 2.0,
    },
    ascensionPoints: 5,
    nextBoss: "AncientDragon",
    bossAbility: {
      name: "Vicious Strike",
      cooldown: 6.0,
      // Converted existing boss ability to use the new AbilityEffect interface
      effects: [{
        baseDamage: 150,
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
    baseDamage: 1500,
    stats: {
      [StatValue.STR]: 3500,
      [StatValue.DEX]: 3000,
      [StatValue.AGI]: 3000,
      [StatValue.TGH]: 4000,
      [StatValue.CON]: 4000, // 10 + (4000 × 10) = 40,010 HP (~10x Goblin King's 4010)
      [StatValue.INT]: 3000,
      [StatValue.FRT]: 4000,
      [StatValue.CONC]: 3500,
      [StatValue.RES]: 3500,
      [StatValue.CRIT_C]: 0.30,
      [StatValue.CRIT_D]: 2.5,
    },
    ascensionPoints: 50,
    bossAbility: {
      name: "Inferno Breath",
      cooldown: 8.0,
      // Converted existing boss ability to use the new AbilityEffect interface
      effects: [{ baseDamage: 1500, damageType: DamageValue.Magic }],
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
