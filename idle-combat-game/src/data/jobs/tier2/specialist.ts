// Tier 2 - Specialist Classes
// These are ultimate mastery classes with extreme unlock requirements

import { GiSamuraiHelmet, GiOpenBook, GiWolfHowl } from "react-icons/gi";
import type { JobDefinition } from "../../../types/data";
import { TraitValue } from "../../../types/data";
import { StatValue } from "../../../types/game";

export const GrandMaster: JobDefinition = {
  id: "GrandMaster",
  name: "Grand Master",
  description: "Legendary warrior who has mastered all combat styles. Perfection through dedication.",
  icon: GiSamuraiHelmet,
  traits: [TraitValue.Physical, TraitValue.Tactical, TraitValue.Tank],
  statBonuses: [
    { stat: StatValue.STR, value: 7.5 },
    { stat: StatValue.TGH, value: 6.0 },
    { stat: StatValue.CON, value: 6.0 },
    { stat: StatValue.DEX, value: 5.5 },
    { stat: StatValue.AGI, value: 5.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Guardian", level: 24 },
    { type: "jobLevel", jobId: "Barbarian", level: 24 },
    { type: "jobLevel", jobId: "Commander", level: 24 },
    { type: "totalJobLevels", value: 180 },
    { type: "anyStat", value: 120 },
  ],
};

export const Sage: JobDefinition = {
  id: "Sage",
  name: "Sage",
  description: "Enlightened scholar who transcends normal magical limits. Wisdom beyond measure.",
  icon: GiOpenBook,
  traits: [TraitValue.Magical, TraitValue.Tactical, TraitValue.Support],
  statBonuses: [
    { stat: StatValue.INT, value: 10.5 },
    { stat: StatValue.CONC, value: 7.5 },
    { stat: StatValue.RES, value: 6.0 },
    { stat: StatValue.FRT, value: 4.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Wizard", level: 24 },
    { type: "jobLevel", jobId: "Sorcerer", level: 24 },
    { type: "jobLevel", jobId: "Warlock", level: 24 },
    { type: "skillLevel", skillId: "ArcaneStudies", level: 24 },
    { type: "skillLevel", skillId: "PhysicalTraining", level: 24 },
    { type: "skillLevel", skillId: "SwiftLearning", level: 24 },
    // INT removed: Just Wizard 24 alone (Mage 10 + Wizard 24 = 126 INT), plus Sorcerer and Warlock - massively redundant
  ],
};

export const ApexPredator: JobDefinition = {
  id: "ApexPredator",
  name: "Apex Predator",
  description: "Ultimate hunter who combines speed, power, and cunning. Top of the food chain.",
  icon: GiWolfHowl,
  traits: [TraitValue.Swift, TraitValue.Stealth, TraitValue.DPS, TraitValue.Aggressive],
  statBonuses: [
    { stat: StatValue.AGI, value: 9.0 },
    { stat: StatValue.DEX, value: 9.0 },
    { stat: StatValue.CRIT_C, value: 15.0 },
    { stat: StatValue.CRIT_D, value: 5.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Shadow", level: 24 },
    { type: "jobLevel", jobId: "Thief", level: 24 },
    { type: "jobLevel", jobId: "Skirmisher", level: 24 },
    { type: "bossDefeats", bossId: "GoblinKing", count: 1 },
    { type: "stat", stat: StatValue.CRIT_C, value: 480 },
    // AGI removed: Rogue 20 + Shadow 24 + Thief 24 + Skirmisher 24 = 220 AGI total (redundant)
    // DEX removed: Rogue 20 + Shadow 24 + Thief 24 + Skirmisher 24 = 268 DEX total (redundant)
    // CRIT_C kept: Total from all = 272 CRIT_C, need 480 (meaningful - requires extra focus)
  ],
};

