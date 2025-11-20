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
    { stat: StatValue.CON, value: 7.5 },
    { stat: StatValue.STR, value: 7.0 },
    { stat: StatValue.DEX, value: 6.0 },
    { stat: StatValue.TGH, value: 5.5 },
    { stat: StatValue.AGI, value: 5.0 },
    { stat: StatValue.CONC, value: 2.5 },
    { stat: StatValue.FRT, value: 2.0 },
    { stat: StatValue.INT, value: 1.5 },
    { stat: StatValue.RES, value: 1.0 },
    { stat: StatValue.CRIT_C, value: 1.0 },
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
    { stat: StatValue.INT, value: 9.5 },
    { stat: StatValue.CONC, value: 7.5 },
    { stat: StatValue.FRT, value: 5.0 },
    { stat: StatValue.RES, value: 4.5 },
    { stat: StatValue.DEX, value: 3.0 },
    { stat: StatValue.CON, value: 2.5 },
    { stat: StatValue.AGI, value: 1.5 },
    { stat: StatValue.CRIT_C, value: 1.0 },
    { stat: StatValue.TGH, value: 0.5 },
    { stat: StatValue.STR, value: 0.5 },
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
    { stat: StatValue.DEX, value: 9.0 },
    { stat: StatValue.AGI, value: 8.5 },
    { stat: StatValue.CRIT_C, value: 9.0 },
    { stat: StatValue.CRIT_D, value: 5.0 },
    { stat: StatValue.CONC, value: 3.5 },
    { stat: StatValue.CON, value: 3.0 },
    { stat: StatValue.STR, value: 2.0 },
    { stat: StatValue.INT, value: 1.5 },
    { stat: StatValue.FRT, value: 1.0 },
    { stat: StatValue.TGH, value: 0.5 },
    { stat: StatValue.RES, value: 0.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Shadow", level: 24 },
    { type: "jobLevel", jobId: "Thief", level: 24 },
    { type: "jobLevel", jobId: "Skirmisher", level: 24 },
    { type: "bossDefeats", bossId: "GoblinKing", count: 1 },
    { type: "stat", stat: StatValue.CRIT_C, value: 720 },
    // CRIT_C kept: Requires significant crit focus beyond basic path requirements
  ],
};

