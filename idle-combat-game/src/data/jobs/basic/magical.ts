// Basic Magical Jobs

import { GiSpellBook } from "react-icons/gi";
import type { JobDefinition } from "../../../types/data";
import { TraitValue } from "../../../types/data";
import { StatValue } from "../../../types/game";

export const Mage: JobDefinition = {
  id: "Mage",
  name: "Mage",
  description: "Harnesses arcane magic and mental prowess.",
  icon: GiSpellBook,
  traits: [TraitValue.Magical],
  statBonuses: [
    { stat: StatValue.INT, value: 2.5 },
    { stat: StatValue.CONC, value: 2.0 },
    { stat: StatValue.DEX, value: 1.0 },
    { stat: StatValue.FRT, value: 1.0 },
    { stat: StatValue.RES, value: 1.0 },
    { stat: StatValue.CON, value: 0.5 },
  ],
};


