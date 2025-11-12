// Tier 2 - Mage Advanced Classes
// These are elite mage specializations requiring significant progression

import { GiWizardStaff, GiFireRing, GiSkullCrossedBones } from "react-icons/gi";
import type { JobDefinition } from "../../../types/data";
import { TraitValue } from "../../../types/data";
import { StatValue } from "../../../types/game";

export const Archmage: JobDefinition = {
  id: "Archmage",
  name: "Archmage",
  description: "Supreme master of all magical disciplines. Knowledge is the ultimate power.",
  icon: GiWizardStaff,
  traits: [TraitValue.Magical, TraitValue.Tactical, TraitValue.Support],
  statBonuses: [
    { stat: StatValue.INT, value: 10.0 },
    { stat: StatValue.CONC, value: 7.0 },
    { stat: StatValue.RES, value: 5.5 },
    { stat: StatValue.FRT, value: 4.0 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Wizard", level: 30 },
    { type: "jobLevel", jobId: "Sorcerer", level: 18 },
    { type: "stat", stat: StatValue.INT, value: 120 },
    { type: "stat", stat: StatValue.CONC, value: 96 },
  ],
};

export const Elementalist: JobDefinition = {
  id: "Elementalist",
  name: "Elementalist",
  description: "Channels raw elemental forces with devastating power. Nature's fury unleashed.",
  icon: GiFireRing,
  traits: [TraitValue.Magical, TraitValue.DPS, TraitValue.Aggressive],
  statBonuses: [
    { stat: StatValue.INT, value: 9.0 },
    { stat: StatValue.CRIT_C, value: 7.0 },
    { stat: StatValue.CRIT_D, value: 4.0 },
    { stat: StatValue.CONC, value: 3.0 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Sorcerer", level: 24 },
    { type: "abilityLevel", abilityId: "Beam", level: 36 },
    { type: "stat", stat: StatValue.INT, value: 96 },
    { type: "bossDefeats", bossId: "TrainingDummy", count: 6 },
  ],
};

export const Necromancer: JobDefinition = {
  id: "Necromancer",
  name: "Necromancer",
  description: "Dark mage who draws power from forbidden sources. Death is just the beginning.",
  icon: GiSkullCrossedBones,
  traits: [TraitValue.Magical, TraitValue.Support, TraitValue.Tank],
  statBonuses: [
    { stat: StatValue.INT, value: 7.5 },
    { stat: StatValue.FRT, value: 7.0 },
    { stat: StatValue.CON, value: 6.0 },
    { stat: StatValue.CONC, value: 4.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Warlock", level: 24 },
    { type: "stat", stat: StatValue.FRT, value: 84 },
    { type: "stat", stat: StatValue.INT, value: 84 },
    { type: "stat", stat: StatValue.CON, value: 72 },
  ],
};

