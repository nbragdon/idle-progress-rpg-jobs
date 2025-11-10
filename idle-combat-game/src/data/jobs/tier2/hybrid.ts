// Tier 2 - Hybrid Classes
// These are cross-discipline specializations combining multiple paths

import { GiSwordAltar, GiTemplarShield, GiMoonClaws } from "react-icons/gi";
import type { JobDefinition } from "../../../types/data";
import { TraitValue } from "../../../types/data";
import { StatValue } from "../../../types/game";

export const Spellblade: JobDefinition = {
  id: "Spellblade",
  name: "Spellblade",
  description: "Warrior-mage who weaves magic and steel as one. The blade sings with arcane power.",
  icon: GiSwordAltar,
  traits: [TraitValue.Physical, TraitValue.Magical, TraitValue.DPS],
  statBonuses: [
    { stat: StatValue.STR, value: 4.5 },
    { stat: StatValue.INT, value: 4.5 },
    { stat: StatValue.DEX, value: 3.0 },
    { stat: StatValue.CONC, value: 3.0 },
  ],
  unlockConditions: [
    { type: "anyJobFromList", jobIds: ["Guardian", "Barbarian", "Commander"], level: 15 },
    { type: "anyJobFromList", jobIds: ["Wizard", "Sorcerer", "Warlock"], level: 15 },
    { type: "stat", stat: StatValue.STR, value: 50 },
    { type: "stat", stat: StatValue.INT, value: 50 },
  ],
};

export const BattlePriest: JobDefinition = {
  id: "BattlePriest",
  name: "Battle Priest",
  description: "Holy warrior who protects allies through divine power. Faith is the strongest armor.",
  icon: GiTemplarShield,
  traits: [TraitValue.Tank, TraitValue.Magical, TraitValue.Support],
  statBonuses: [
    { stat: StatValue.FRT, value: 5.0 },
    { stat: StatValue.CON, value: 4.0 },
    { stat: StatValue.INT, value: 3.5 },
    { stat: StatValue.CONC, value: 3.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Guardian", level: 20 },
    { type: "jobLevel", jobId: "Wizard", level: 15 },
    { type: "totalSkillLevels", value: 75 },
    { type: "stat", stat: StatValue.FRT, value: 70 },
  ],
};

export const ShadowDancer: JobDefinition = {
  id: "ShadowDancer",
  name: "Shadow Dancer",
  description: "Mystic rogue who bends reality with arcane agility. Grace and magic intertwined.",
  icon: GiMoonClaws,
  traits: [TraitValue.Swift, TraitValue.Magical, TraitValue.Stealth],
  statBonuses: [
    { stat: StatValue.AGI, value: 5.5 },
    { stat: StatValue.INT, value: 4.0 },
    { stat: StatValue.CRIT_C, value: 5.0 },
    { stat: StatValue.CONC, value: 2.5 },
  ],
  unlockConditions: [
    { type: "anyJobFromList", jobIds: ["Shadow", "Thief", "Skirmisher"], level: 20 },
    { type: "anyJobFromList", jobIds: ["Wizard", "Sorcerer", "Warlock"], level: 15 },
    { type: "stat", stat: StatValue.AGI, value: 70 },
    { type: "stat", stat: StatValue.INT, value: 60 },
  ],
};

