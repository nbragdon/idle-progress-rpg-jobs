// Basic Physical Jobs

import { GiCrossedSwords } from "react-icons/gi";
import { FaFeatherAlt } from "react-icons/fa";
import type { JobDefinition } from "../../../types/data";
import { TraitValue } from "../../../types/data";
import { StatValue } from "../../../types/game";

export const Warrior: JobDefinition = {
  id: "Warrior",
  name: "Warrior",
  description: "Focuses on brute strength and physical endurance.",
  icon: GiCrossedSwords,
  traits: [TraitValue.Physical],
  statBonuses: [
    { stat: StatValue.STR, value: 2.5 },
    { stat: StatValue.CON, value: 2.0 },
    { stat: StatValue.TGH, value: 1.5 },
    { stat: StatValue.DEX, value: 1.0 },
    { stat: StatValue.CONC, value: 0.5 },
  ],
};

export const Rogue: JobDefinition = {
  id: "Rogue",
  name: "Rogue",
  description: "Favors agility and dexterity for swift strikes.",
  icon: FaFeatherAlt,
  traits: [TraitValue.Swift],
  statBonuses: [
    { stat: StatValue.DEX, value: 2.5 },
    { stat: StatValue.AGI, value: 2.0 },
    { stat: StatValue.CRIT_C, value: 2.0 },
    { stat: StatValue.CON, value: 1.0 },
    { stat: StatValue.CONC, value: 1.0 },
    { stat: StatValue.CRIT_D, value: 1.0 },
  ],
};


