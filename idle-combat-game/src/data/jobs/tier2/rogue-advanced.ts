// Tier 2 - Rogue Advanced Classes
// These are elite rogue specializations requiring significant progression

import { GiNinjaMask, GiJesterHat, GiDuel } from "react-icons/gi";
import type { JobDefinition } from "../../../types/data";
import { TraitValue } from "../../../types/data";
import { StatValue } from "../../../types/game";

export const Assassin: JobDefinition = {
  id: "Assassin",
  name: "Assassin",
  description: "Silent killer with perfect precision and lethal strikes. Death moves in shadow.",
  icon: GiNinjaMask,
  traits: [TraitValue.Stealth, TraitValue.Swift, TraitValue.DPS],
  statBonuses: [
    { stat: StatValue.DEX, value: 8.0 },
    { stat: StatValue.CRIT_C, value: 7.0 },
    { stat: StatValue.AGI, value: 6.0 },
    { stat: StatValue.CRIT_D, value: 4.5 },
    { stat: StatValue.CONC, value: 2.5 },
    { stat: StatValue.CON, value: 2.0 },
    { stat: StatValue.FRT, value: 1.0 },
    { stat: StatValue.STR, value: 1.0 },
    { stat: StatValue.INT, value: 0.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Shadow", level: 24 },
    { type: "abilityLevel", abilityId: "Smash", level: 36 },
    { type: "stat", stat: StatValue.DEX, value: 126 },
    { type: "stat", stat: StatValue.CRIT_C, value: 360 },
    // DEX kept: Shadow needs Rogue 10 + Shadow 24 - requires extra training to reach threshold
    // CRIT_C kept: Meaningful requirement - requires focused crit training
  ],
};

export const Trickster: JobDefinition = {
  id: "Trickster",
  name: "Trickster",
  description: "Master of deception who exploits every advantage. Rules are made to be broken.",
  icon: GiJesterHat,
  traits: [TraitValue.Opportunist, TraitValue.Swift, TraitValue.Tactical],
  statBonuses: [
    { stat: StatValue.DEX, value: 7.5 },
    { stat: StatValue.AGI, value: 6.5 },
    { stat: StatValue.CONC, value: 4.0 },
    { stat: StatValue.INT, value: 3.5 },
    { stat: StatValue.CON, value: 3.0 },
    { stat: StatValue.CRIT_C, value: 3.0 },
    { stat: StatValue.FRT, value: 1.5 },
    { stat: StatValue.CRIT_D, value: 1.5 },
    { stat: StatValue.RES, value: 0.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Thief", level: 24 },
    { type: "jobLevel", jobId: "Skirmisher", level: 18 },
    { type: "totalSkillLevels", value: 60 },
  ],
};

export const Duelist: JobDefinition = {
  id: "Duelist",
  name: "Duelist",
  description: "Refined combatant who blends speed with defensive prowess. Honor through mastery.",
  icon: GiDuel,
  traits: [TraitValue.Swift, TraitValue.Skirmish, TraitValue.Tank],
  statBonuses: [
    { stat: StatValue.AGI, value: 7.0 },
    { stat: StatValue.DEX, value: 6.0 },
    { stat: StatValue.CON, value: 5.5 },
    { stat: StatValue.FRT, value: 4.5 },
    { stat: StatValue.CONC, value: 2.5 },
    { stat: StatValue.TGH, value: 2.5 },
    { stat: StatValue.STR, value: 1.5 },
    { stat: StatValue.RES, value: 1.0 },
    { stat: StatValue.CRIT_C, value: 1.0 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Skirmisher", level: 24 },
    { type: "stat", stat: StatValue.FRT, value: 90 },
    // FRT kept: Requires meaningful cross-training to reach threshold
  ],
};

