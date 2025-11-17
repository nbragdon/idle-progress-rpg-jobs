// Tier 1 - Warrior Advanced Classes
// These are advanced warrior specializations

import { GiCastle, GiBattleAxe, GiPoliceOfficerHead } from "react-icons/gi";
import type { JobDefinition } from "../../../types/data";
import { TraitValue } from "../../../types/data";
import { StatValue } from "../../../types/game";

export const Guardian: JobDefinition = {
  id: "Guardian",
  name: "Guardian",
  description: "Master of defense and protection. Shields allies with unwavering resolve.",
  icon: GiCastle,
  traits: [TraitValue.Tank, TraitValue.Physical],
  statBonuses: [
    { stat: StatValue.TGH, value: 4.0 },
    { stat: StatValue.CON, value: 3.5 },
    { stat: StatValue.FRT, value: 2.0 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Warrior", level: 10 },
  ],
};

export const Barbarian: JobDefinition = {
  id: "Barbarian",
  name: "Barbarian",
  description: "Unleashes raw power and fury. Overwhelming strength at any cost.",
  icon: GiBattleAxe,
  traits: [TraitValue.Aggressive, TraitValue.Physical],
  statBonuses: [
    { stat: StatValue.STR, value: 4.5 },
    { stat: StatValue.CRIT_D, value: 2.0 }, // +2% crit damage per level
    { stat: StatValue.CRIT_C, value: 3.5 }, // Moderate crit chance scaling
    { stat: StatValue.CON, value: 1.5 },
  ],
  unlockConditions: [
    { type: "stat", stat: StatValue.STR, value: 40 },
    { type: "stat", stat: StatValue.CON, value: 25 },
  ],
};

export const Commander: JobDefinition = {
  id: "Commander",
  name: "Commander",
  description: "Tactical genius with strategic prowess. Combines martial skill with keen intellect.",
  icon: GiPoliceOfficerHead,
  traits: [TraitValue.Tactical, TraitValue.Physical],
  statBonuses: [
    { stat: StatValue.INT, value: 3.5 },
    { stat: StatValue.STR, value: 2.5 },
    { stat: StatValue.FRT, value: 2.5 },
    { stat: StatValue.CONC, value: 2.0 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Warrior", level: 12 },
    { type: "stat", stat: StatValue.INT, value: 30 }, // Warrior gives 0 INT - meaningful requirement
  ],
};


