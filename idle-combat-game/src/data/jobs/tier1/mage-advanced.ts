// Tier 1 - Mage Advanced Classes
// These are advanced mage specializations

import { GiFireSpellCast, GiSpellBook, GiWarlockEye } from "react-icons/gi";
import type { JobDefinition } from "../../../types/data";
import { TraitValue } from "../../../types/data";
import { StatValue } from "../../../types/game";

export const Sorcerer: JobDefinition = {
  id: "Sorcerer",
  name: "Sorcerer",
  description: "Wields raw arcane power with devastating force. Magic flows through their very being.",
  icon: GiFireSpellCast,
  traits: [TraitValue.Magical, TraitValue.DPS],
  statBonuses: [
    { stat: StatValue.INT, value: 4.5 },
    { stat: StatValue.CONC, value: 3.0 },
    { stat: StatValue.CRIT_C, value: 2.5 },
    { stat: StatValue.DEX, value: 2.0 },
    { stat: StatValue.FRT, value: 1.5 },
    { stat: StatValue.CRIT_D, value: 1.5 },
    { stat: StatValue.RES, value: 0.5 },
    { stat: StatValue.CON, value: 0.5 },
  ],
  unlockConditions: [
    { type: "stat", stat: StatValue.INT, value: 80 },
    { type: "stat", stat: StatValue.CONC, value: 50 },
  ],
};

export const Wizard: JobDefinition = {
  id: "Wizard",
  name: "Wizard",
  description: "Master of arcane knowledge and precision. Studies magic with scholarly dedication.",
  icon: GiSpellBook,
  traits: [TraitValue.Magical, TraitValue.Tactical],
  statBonuses: [
    { stat: StatValue.INT, value: 4.0 },
    { stat: StatValue.CONC, value: 4.0 },
    { stat: StatValue.RES, value: 2.5 },
    { stat: StatValue.DEX, value: 1.5 },
    { stat: StatValue.FRT, value: 1.5 },
    { stat: StatValue.CON, value: 1.0 },
    { stat: StatValue.AGI, value: 0.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Mage", level: 10 },
  ],
};

export const Warlock: JobDefinition = {
  id: "Warlock",
  name: "Warlock",
  description: "Channels forbidden magic and dark pacts. Balances power with resilience.",
  icon: GiWarlockEye,
  traits: [TraitValue.Magical, TraitValue.Support],
  statBonuses: [
    { stat: StatValue.INT, value: 3.5 },
    { stat: StatValue.CONC, value: 3.0 },
    { stat: StatValue.FRT, value: 3.0 },
    { stat: StatValue.CON, value: 2.5 },
    { stat: StatValue.DEX, value: 1.5 },
    { stat: StatValue.RES, value: 1.0 },
    { stat: StatValue.TGH, value: 0.5 },
    { stat: StatValue.AGI, value: 0.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Mage", level: 12 },
    { type: "stat", stat: StatValue.FRT, value: 60 }, // Mage gives minimal FRT - meaningful requirement
  ],
};


