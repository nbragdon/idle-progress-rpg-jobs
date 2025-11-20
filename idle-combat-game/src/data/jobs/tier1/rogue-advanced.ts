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
    { stat: StatValue.AGI, value: 4.0 },
    { stat: StatValue.DEX, value: 3.5 },
    { stat: StatValue.CRIT_C, value: 4.5 },
    { stat: StatValue.CONC, value: 1.5 },
    { stat: StatValue.CON, value: 1.0 },
    { stat: StatValue.FRT, value: 0.5 },
    { stat: StatValue.CRIT_D, value: 0.5 },
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
    { stat: StatValue.DEX, value: 4.5 },
    { stat: StatValue.CRIT_C, value: 3.5 },
    { stat: StatValue.CRIT_D, value: 3.0 },
    { stat: StatValue.AGI, value: 2.0 },
    { stat: StatValue.CONC, value: 1.5 },
    { stat: StatValue.CON, value: 1.5 },
    { stat: StatValue.STR, value: 0.5 },
  ],
  unlockConditions: [
    { type: "stat", stat: StatValue.DEX, value: 120 },
    { type: "stat", stat: StatValue.AGI, value: 60 },
  ],
};

export const Skirmisher: JobDefinition = {
  id: "Skirmisher",
  name: "Skirmisher",
  description: "Mobile combatant focused on hit-and-run tactics. Combines speed with tactical awareness.",
  icon: GiNinjaHeroicStance,
  traits: [TraitValue.Skirmish, TraitValue.Swift],
  statBonuses: [
    { stat: StatValue.AGI, value: 4.0 },
    { stat: StatValue.DEX, value: 3.0 },
    { stat: StatValue.CON, value: 3.0 },
    { stat: StatValue.CONC, value: 2.0 },
    { stat: StatValue.FRT, value: 1.5 },
    { stat: StatValue.STR, value: 1.0 },
    { stat: StatValue.TGH, value: 0.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Rogue", level: 12 },
    { type: "stat", stat: StatValue.AGI, value: 90 }, // Requires slightly more AGI than Rogue 12 provides
  ],
};


