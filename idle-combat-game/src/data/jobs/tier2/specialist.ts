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
    { stat: StatValue.STR, value: 5.0 },
    { stat: StatValue.TGH, value: 4.0 },
    { stat: StatValue.CON, value: 4.0 },
    { stat: StatValue.DEX, value: 3.5 },
    { stat: StatValue.AGI, value: 3.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Guardian", level: 20 },
    { type: "jobLevel", jobId: "Barbarian", level: 20 },
    { type: "jobLevel", jobId: "Commander", level: 20 },
    { type: "totalJobLevels", value: 150 },
    { type: "anyStat", value: 100 },
  ],
};

export const Sage: JobDefinition = {
  id: "Sage",
  name: "Sage",
  description: "Enlightened scholar who transcends normal magical limits. Wisdom beyond measure.",
  icon: GiOpenBook,
  traits: [TraitValue.Magical, TraitValue.Tactical, TraitValue.Support],
  statBonuses: [
    { stat: StatValue.INT, value: 7.0 },
    { stat: StatValue.CONC, value: 5.0 },
    { stat: StatValue.RES, value: 4.0 },
    { stat: StatValue.FRT, value: 3.0 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Wizard", level: 20 },
    { type: "jobLevel", jobId: "Sorcerer", level: 20 },
    { type: "jobLevel", jobId: "Warlock", level: 20 },
    { type: "skillLevel", skillId: "ArcaneStudies", level: 20 },
    { type: "skillLevel", skillId: "PhysicalTraining", level: 20 },
    { type: "skillLevel", skillId: "SwiftLearning", level: 20 },
    { type: "stat", stat: StatValue.INT, value: 100 },
  ],
};

export const ApexPredator: JobDefinition = {
  id: "ApexPredator",
  name: "Apex Predator",
  description: "Ultimate hunter who combines speed, power, and cunning. Top of the food chain.",
  icon: GiWolfHowl,
  traits: [TraitValue.Swift, TraitValue.Stealth, TraitValue.DPS, TraitValue.Aggressive],
  statBonuses: [
    { stat: StatValue.AGI, value: 6.0 },
    { stat: StatValue.DEX, value: 6.0 },
    { stat: StatValue.CRIT_C, value: 10.0 },
    { stat: StatValue.CRIT_D, value: 3.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Shadow", level: 20 },
    { type: "jobLevel", jobId: "Thief", level: 20 },
    { type: "jobLevel", jobId: "Skirmisher", level: 20 },
    { type: "bossDefeats", bossId: "GoblinKing", count: 1 },
    { type: "stat", stat: StatValue.AGI, value: 80 },
    { type: "stat", stat: StatValue.DEX, value: 80 },
    { type: "stat", stat: StatValue.CRIT_C, value: 400 },
  ],
};

