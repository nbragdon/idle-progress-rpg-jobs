// Tier 2 - Hybrid Classes
// These are cross-discipline specializations combining multiple paths

import { GiSwordArray, GiShield, GiClaw } from "react-icons/gi";
import type { JobDefinition } from "../../../types/data";
import { TraitValue } from "../../../types/data";
import { StatValue } from "../../../types/game";

export const Spellblade: JobDefinition = {
  id: "Spellblade",
  name: "Spellblade",
  description: "Warrior-mage who weaves magic and steel as one. The blade sings with arcane power.",
  icon: GiSwordArray,
  traits: [TraitValue.Physical, TraitValue.Magical, TraitValue.DPS],
  statBonuses: [
    { stat: StatValue.STR, value: 6.5 },
    { stat: StatValue.INT, value: 6.5 },
    { stat: StatValue.DEX, value: 4.0 },
    { stat: StatValue.CONC, value: 4.0 },
    { stat: StatValue.CON, value: 3.0 },
    { stat: StatValue.CRIT_C, value: 2.5 },
    { stat: StatValue.CRIT_D, value: 2.5 },
    { stat: StatValue.FRT, value: 1.5 },
    { stat: StatValue.AGI, value: 1.0 },
    { stat: StatValue.TGH, value: 0.5 },
  ],
  unlockConditions: [
    { type: "anyJobFromList", jobIds: ["Guardian", "Barbarian", "Commander"], level: 18 },
    { type: "anyJobFromList", jobIds: ["Wizard", "Sorcerer", "Warlock"], level: 18 },
    { type: "stat", stat: StatValue.STR, value: 90 },
    // STR kept: Requires meaningful physical training beyond base path
  ],
};

export const BattlePriest: JobDefinition = {
  id: "BattlePriest",
  name: "Battle Priest",
  description: "Holy warrior who protects allies through divine power. Faith is the strongest armor.",
  icon: GiShield,
  traits: [TraitValue.Tank, TraitValue.Magical, TraitValue.Support],
  statBonuses: [
    { stat: StatValue.FRT, value: 7.0 },
    { stat: StatValue.CON, value: 6.5 },
    { stat: StatValue.CONC, value: 5.5 },
    { stat: StatValue.INT, value: 5.0 },
    { stat: StatValue.RES, value: 3.0 },
    { stat: StatValue.DEX, value: 2.0 },
    { stat: StatValue.TGH, value: 2.0 },
    { stat: StatValue.CRIT_D, value: 0.5 },
    { stat: StatValue.AGI, value: 0.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Guardian", level: 24 },
    { type: "jobLevel", jobId: "Wizard", level: 18 },
    { type: "totalSkillLevels", value: 90 },
    { type: "stat", stat: StatValue.FRT, value: 126 },
  ],
};

export const ShadowDancer: JobDefinition = {
  id: "ShadowDancer",
  name: "Shadow Dancer",
  description: "Mystic rogue who bends reality with arcane agility. Grace and magic intertwined.",
  icon: GiClaw,
  traits: [TraitValue.Swift, TraitValue.Magical, TraitValue.Stealth],
  statBonuses: [
    { stat: StatValue.AGI, value: 7.5 },
    { stat: StatValue.DEX, value: 5.5 },
    { stat: StatValue.INT, value: 5.5 },
    { stat: StatValue.CONC, value: 5.0 },
    { stat: StatValue.CRIT_C, value: 3.5 },
    { stat: StatValue.FRT, value: 2.5 },
    { stat: StatValue.CON, value: 2.0 },
    { stat: StatValue.CRIT_D, value: 1.5 },
    { stat: StatValue.RES, value: 1.0 },
    { stat: StatValue.STR, value: 0.5 },
  ],
  unlockConditions: [
    { type: "anyJobFromList", jobIds: ["Shadow", "Thief", "Skirmisher"], level: 24 },
    { type: "anyJobFromList", jobIds: ["Wizard", "Sorcerer", "Warlock"], level: 18 },
    // AGI removed: Min rogue path Shadow 24 (Rogue 10 + Shadow 24 = 116 AGI) - redundant
    // INT removed: Min mage path Wizard 18 (Mage 10 + Wizard 18 = 102 INT) - redundant
  ],
};

