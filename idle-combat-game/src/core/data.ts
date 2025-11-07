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
    desc: "Increases Physical Damage.",
    icon: GiCrossedSwords, // Swords -> GiCrossedSwords
  },
  [StatValue.DEX]: {
    id: StatValue.DEX,
    name: "Dexterity",
    desc: "Increases damage and attack speed.",
    icon: GiTargetDummy, // Target -> GiTargetDummy
  },
  [StatValue.AGI]: {
    id: StatValue.AGI,
    name: "Agility",
    desc: "Increases attack speed and evasion.",
    icon: FaFeatherAlt, // Feather -> FaFeatherAlt
  },
  [StatValue.TGH]: {
    id: StatValue.TGH,
    name: "Toughness",
    desc: "Increases Max HP and reduces Physical damage taken.",
    icon: GiShieldImpact, // Shield -> GiShieldImpact
  },
  [StatValue.CON]: {
    id: StatValue.CON,
    name: "Constitution",
    desc: "Increases Max HP and regeneration.",
    icon: FaHeart, // Heart -> FaHeart
  },
  [StatValue.INT]: {
    id: StatValue.INT,
    name: "Intelligence",
    desc: "Increases Magic Damage.",
    icon: FaBookOpen, // BookOpen -> FaBookOpen
  },

  // Secondary Combat & Utility Stats
  [StatValue.FRT]: {
    id: StatValue.FRT,
    name: "Fortitude",
    desc: "Reduces Magic damage taken.",
    icon: FaAnchor, // Anchor -> FaAnchor
  },
  [StatValue.CONC]: {
    id: StatValue.CONC,
    name: "Concentration",
    desc: "Increases chance to apply status effects.",
    icon: FaBolt, // Bolt -> FaBolt
  },
  [StatValue.RES]: {
    id: StatValue.RES,
    name: "Resistance",
    desc: "Decreases chance of opponent applying status effects.",
    icon: FaSyncAlt, // RefreshCw -> FaSyncAlt
  },
  [StatValue.CRIT_C]: {
    id: StatValue.CRIT_C,
    name: "Crit Chance",
    desc: "Chance to deal extra damage (Decimal value).",
    icon: FaDiceD6, // Dices -> FaDiceD6
  },
  [StatValue.CRIT_D]: {
    id: StatValue.CRIT_D,
    name: "Crit Damage",
    desc: "Multiplier for critical hits (Decimal value).",
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
    baseHp: 100,
    baseDamage: 5,
    ascensionPoints: 1,
    nextBoss: "GoblinKing",
    bossAbility: {
      name: "Wobble",
      cooldown: 10.0,
      // Added mandatory damageType field for AbilityEffect consistency
      effects: [{ damageMultiplier: 1.0, damageType: DamageValue.True }],
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
    baseHp: 500,
    baseDamage: 20,
    ascensionPoints: 5,
    nextBoss: "AncientDragon",
    bossAbility: {
      name: "Vicious Strike",
      cooldown: 8.0,
      // Converted existing boss ability to use the new AbilityEffect interface
      effects: [{
        damageMultiplier: 1.5,
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
    baseHp: 5000,
    baseDamage: 100,
    ascensionPoints: 50,
    bossAbility: {
      name: "Inferno Breath",
      cooldown: 15.0,
      // Converted existing boss ability to use the new AbilityEffect interface
      effects: [{ damageMultiplier: 3.0, damageType: DamageValue.Magic }],
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
    name: "Job EXP Multiplier",
    description: "Increases Job EXP gain globally.",
    maxLevel: 10,
    cost: (lvl) => (lvl + 1) * 10,
    effect: (lvl) => lvl * 1,
  },
  {
    id: "maxSkills",
    name: "Max Active Skills",
    description: "Increases the number of skills you can train.",
    maxLevel: 5,
    cost: (lvl) => (lvl + 1) * 50,
    effect: (lvl) => lvl * 1,
  },
  {
    id: "maxAbilities",
    name: "Max Training Abilities",
    description: "Increases the number of abilities you can train.",
    maxLevel: 5,
    cost: (lvl) => (lvl + 1) * 50,
    effect: (lvl) => lvl * 1,
  },
];
