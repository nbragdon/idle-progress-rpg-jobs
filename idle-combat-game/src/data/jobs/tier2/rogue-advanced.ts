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
    { stat: StatValue.CRIT_C, value: 7.0 },
    { stat: StatValue.DEX, value: 5.0 },
    { stat: StatValue.CRIT_D, value: 2.5 },
    { stat: StatValue.AGI, value: 3.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Shadow", level: 20 },
    { type: "abilityLevel", abilityId: "Smash", level: 30 },
    { type: "stat", stat: StatValue.DEX, value: 70 },
    { type: "stat", stat: StatValue.CRIT_C, value: 200 },
  ],
};

export const Trickster: JobDefinition = {
  id: "Trickster",
  name: "Trickster",
  description: "Master of deception who exploits every advantage. Rules are made to be broken.",
  icon: GiJesterHat,
  traits: [TraitValue.Opportunist, TraitValue.Swift, TraitValue.Tactical],
  statBonuses: [
    { stat: StatValue.DEX, value: 5.5 },
    { stat: StatValue.AGI, value: 4.5 },
    { stat: StatValue.CRIT_C, value: 4.0 },
    { stat: StatValue.INT, value: 3.0 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Thief", level: 20 },
    { type: "jobLevel", jobId: "Skirmisher", level: 15 },
    { type: "totalSkillLevels", value: 50 },
  ],
};

export const Duelist: JobDefinition = {
  id: "Duelist",
  name: "Duelist",
  description: "Refined combatant who blends speed with defensive prowess. Honor through mastery.",
  icon: GiDuel,
  traits: [TraitValue.Swift, TraitValue.Skirmish, TraitValue.Tank],
  statBonuses: [
    { stat: StatValue.AGI, value: 5.0 },
    { stat: StatValue.DEX, value: 4.0 },
    { stat: StatValue.FRT, value: 3.5 },
    { stat: StatValue.CON, value: 3.0 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Skirmisher", level: 20 },
    { type: "stat", stat: StatValue.AGI, value: 70 },
    { type: "stat", stat: StatValue.DEX, value: 60 },
    { type: "stat", stat: StatValue.FRT, value: 50 },
  ],
};

