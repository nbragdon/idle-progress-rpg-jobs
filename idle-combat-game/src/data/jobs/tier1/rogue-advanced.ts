// Tier 1 - Rogue Advanced Classes
// These are advanced rogue specializations

import { GiNinjaHeroicStance, GiMoneyStack, GiDualityMask } from "react-icons/gi";
import type { JobDefinition } from "../../../types/data";
import { TraitValue } from "../../../types/data";
import { StatValue } from "../../../types/game";

export const Shadow: JobDefinition = {
  id: "Shadow",
  name: "Shadow",
  description: "Master of stealth and evasion. Strikes from the shadows with deadly precision.",
  icon: GiDualityMask,
  traits: [TraitValue.Stealth, TraitValue.Swift],
  statBonuses: [
    { stat: StatValue.AGI, value: 3.0 },
    { stat: StatValue.DEX, value: 2.0 },
    { stat: StatValue.CRIT_C, value: 5.0 }, // High crit chance scaling
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Rogue", level: 10 },
  ],
};

export const Thief: JobDefinition = {
  id: "Thief",
  name: "Thief",
  description: "Swift and opportunistic. Excels at exploiting weaknesses for maximum gain.",
  icon: GiMoneyStack,
  traits: [TraitValue.Opportunist, TraitValue.Swift],
  statBonuses: [
    { stat: StatValue.DEX, value: 3.5 },
    { stat: StatValue.CRIT_D, value: 2.0 }, // +2% crit damage per level
    { stat: StatValue.CRIT_C, value: 3.0 }, // Moderate crit chance scaling
  ],
  unlockConditions: [
    { type: "stat", stat: StatValue.DEX, value: 40 },
    { type: "stat", stat: StatValue.AGI, value: 25 },
  ],
};

export const Skirmisher: JobDefinition = {
  id: "Skirmisher",
  name: "Skirmisher",
  description: "Mobile combatant focused on hit-and-run tactics. Combines speed with tactical awareness.",
  icon: GiNinjaHeroicStance,
  traits: [TraitValue.Skirmish, TraitValue.Swift],
  statBonuses: [
    { stat: StatValue.AGI, value: 2.5 },
    { stat: StatValue.DEX, value: 2.0 },
    { stat: StatValue.CON, value: 2.0 },
    { stat: StatValue.FRT, value: 1.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Rogue", level: 12 },
    { type: "stat", stat: StatValue.AGI, value: 30 },
    { type: "stat", stat: StatValue.DEX, value: 25 },
  ],
};


