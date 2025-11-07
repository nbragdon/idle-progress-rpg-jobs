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
import { FaBurst, FaGears } from "react-icons/fa6";
import type { IconBaseProps } from "react-icons";


// --- STATS ---
export const STAT_MAP: Record<StatId, StatDefinition> = {
  // Primary Combat Stats (Scaled by Jobs)
  STR: {
    id: "STR",
    name: "Strength",
    desc: "Increases Physical Damage.",
    icon: GiCrossedSwords, // Swords -> GiCrossedSwords
  },
  DEX: {
    id: "DEX",
    name: "Dexterity",
    desc: "Increases damage and attack speed.",
    icon: GiTargetDummy, // Target -> GiTargetDummy
  },
  AGI: {
    id: "AGI",
    name: "Agility",
    desc: "Increases attack speed and evasion.",
    icon: FaFeatherAlt, // Feather -> FaFeatherAlt
  },
  TGH: {
    id: "TGH",
    name: "Toughness",
    desc: "Increases Max HP and reduces Physical damage taken.",
    icon: GiShieldImpact, // Shield -> GiShieldImpact
  },
  CON: {
    id: "CON",
    name: "Constitution",
    desc: "Increases Max HP and regeneration.",
    icon: FaHeart, // Heart -> FaHeart
  },
  INT: {
    id: "INT",
    name: "Intelligence",
    desc: "Increases Magic Damage.",
    icon: FaBookOpen, // BookOpen -> FaBookOpen
  },

  // Secondary Combat & Utility Stats
  FRT: {
    id: "FRT",
    name: "Fortitude",
    desc: "Reduces Magic damage taken.",
    icon: FaAnchor, // Anchor -> FaAnchor
  },
  CONC: {
    id: "CONC",
    name: "Concentration",
    desc: "Increases chance to apply status effects.",
    icon: FaBolt, // Bolt -> FaBolt
  },
  RES: {
    id: "RES",
    name: "Resistance",
    desc: "Decreases chance of opponent applying status effects.",
    icon: FaSyncAlt, // RefreshCw -> FaSyncAlt
  },
  CRIT_C: {
    id: "CRIT_C",
    name: "Crit Chance",
    desc: "Chance to deal extra damage (Decimal value).",
    icon: FaDiceD6, // Dices -> FaDiceD6
  },
  CRIT_D: {
    id: "CRIT_D",
    name: "Crit Damage",
    desc: "Multiplier for critical hits (Decimal value).",
    icon: FaBurst,
  },

  // Meta Stat (for display only, not used in calculations)
  TotalLevels: {
    id: "TotalLevels",
    name: "Total Levels",
    desc: "Sum of all Job levels.",
    icon: GiStarFormation, // Tally5 -> GiStarFormation (as a replacement for a tally mark)
  },
};

// --- JOBS ---
export const JOB_DATA: Record<string, JobDefinition> = {
  Warrior: {
    id: "Warrior",
    name: "Warrior",
    description: "Focuses on brute strength and physical endurance.",
    icon: GiCrossedSwords, // Swords -> GiCrossedSwords
    statBonuses: [
      { stat: "STR", value: 2.0 },
      { stat: "TGH", value: 1.5 },
      { stat: "CON", value: 1.0 },
    ],
  },
  Mage: {
    id: "Mage",
    name: "Mage",
    description: "Harnesses raw intellect for powerful magical output.",
    icon: GiLightningSpanner, // Zap -> GiLightningSpanner
    statBonuses: [
      { stat: "INT", value: 2.0 },
      { stat: "CONC", value: 1.5 },
      { stat: "RES", value: 1.0 },
    ],
  },
  Rogue: {
    id: "Rogue",
    name: "Rogue",
    description: "Favors agility and dexterity for swift strikes.",
    icon: FaFeatherAlt, // Feather -> FaFeatherAlt
    statBonuses: [
      { stat: "DEX", value: 2.0 },
      { stat: "AGI", value: 1.5 },
      { stat: "CRIT_D", value: 0.01 }, // +1% crit damage per level
    ],
  },
};

// --- SKILLS ---
export const SKILL_DATA: Record<string, SkillDefinition> = {
  Focus: {
    id: "Focus",
    name: "Focus",
    description: "Increases Job EXP gain globally.",
    icon: FaBookOpen, // BookOpen -> FaBookOpen
    effects: [{ type: "jobExp", value: 0.005 }], // +0.5% per level
    unlockCondition: { stat: "INT", required: 15 },
  },
  Diligence: {
    id: "Diligence",
    name: "Diligence",
    description: "Increases Skill EXP gain globally.",
    icon: FaGears,
    unlockCondition: { stat: "CON", required: 15 },
    effects: [{ type: "skillExp", value: 0.005 }], // +0.5% per level
  },
};

// --- ABILITIES (UPDATED STRUCTURE) ---
export const ABILITY_DATA: Record<string, AbilityDefinition> = {
  // Physical Attack
  QuickStrike: {
    id: "QuickStrike",
    name: "Quick Strike",
    description: "A swift physical attack (1.5x STR).",
    icon: GiCrossedSwords, // Swords -> GiCrossedSwords
    cooldown: 5.0,
    unlockCondition: { stat: "STR", required: 10 },
    // Type fixed using the new enum
    effects: [{ damageMultiplier: 1.5, damageType: DamageValue.Physical }],
    damageMultiplier: 0,
    statusEffect: undefined
  },
  // Magic Attack
  Fireball: {
    id: "Fireball",
    name: "Fireball",
    description: "Hurls a fiery projectile (2.0x INT).",
    icon: GiLightningSpanner, // Zap -> GiLightningSpanner
    cooldown: 8.0,
    unlockCondition: { stat: "INT", required: 15 },
    // Type fixed using the new enum
    effects: [{ damageMultiplier: 2.0, damageType: DamageValue.Magic }],
    damageMultiplier: 0,
    statusEffect: undefined
  },
  // Physical Attack with Status
  ShieldBash: {
    id: "ShieldBash",
    name: "Shield Bash",
    description: "Physical bash (0.8x STR) that can Stun.",
    icon: GiShieldImpact, // Shield -> GiShieldImpact
    cooldown: 12.0,
    unlockCondition: { stat: "TGH", required: 20 },
    // Type fixed using the new enum
    effects: [{
      damageMultiplier: 0.8,
      damageType: DamageValue.Physical,
      statusEffect: {
        id: "Stun" as StatusEffectId,
        duration: 2.0,
        concentration: 20,
      },
    }],
    damageMultiplier: 0,
    statusEffect: undefined
  },
};

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
        stat: "INT",
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
        stat: "INT",
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
        stat: "INT",
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
