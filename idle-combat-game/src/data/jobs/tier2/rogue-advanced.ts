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
    { stat: StatValue.CRIT_C, value: 10.5 },
    { stat: StatValue.DEX, value: 7.5 },
    { stat: StatValue.CRIT_D, value: 4.0 },
    { stat: StatValue.AGI, value: 5.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Shadow", level: 24 },
    { type: "abilityLevel", abilityId: "Smash", level: 36 },
    { type: "stat", stat: StatValue.DEX, value: 84 },
    { type: "stat", stat: StatValue.CRIT_C, value: 240 },
    // DEX kept: Shadow needs Rogue 10 (20 DEX) + Shadow 24 (60 DEX) = 80 DEX total, need 84 (meaningful)
    // CRIT_C kept: Rogue 10 (10 CRIT_C) + Shadow 24 (156 CRIT_C) = 166 CRIT_C total, need 240 (meaningful)
  ],
};

export const Trickster: JobDefinition = {
  id: "Trickster",
  name: "Trickster",
  description: "Master of deception who exploits every advantage. Rules are made to be broken.",
  icon: GiJesterHat,
  traits: [TraitValue.Opportunist, TraitValue.Swift, TraitValue.Tactical],
  statBonuses: [
    { stat: StatValue.DEX, value: 8.5 },
    { stat: StatValue.AGI, value: 7.0 },
    { stat: StatValue.CRIT_C, value: 6.0 },
    { stat: StatValue.INT, value: 4.5 },
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
    { stat: StatValue.AGI, value: 7.5 },
    { stat: StatValue.DEX, value: 6.0 },
    { stat: StatValue.FRT, value: 5.5 },
    { stat: StatValue.CON, value: 4.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Skirmisher", level: 24 },
    { type: "stat", stat: StatValue.FRT, value: 60 },
    // AGI removed: Rogue 15 (30 AGI) + Skirmisher 24 (84 AGI) = 114 AGI (redundant)
    // DEX removed: Rogue 15 (30 DEX) + Skirmisher 24 (60 DEX) = 90 DEX (redundant)
    // FRT kept: Skirmisher 24 only gives 48 FRT, need 60 (meaningful - requires cross-training)
  ],
};

