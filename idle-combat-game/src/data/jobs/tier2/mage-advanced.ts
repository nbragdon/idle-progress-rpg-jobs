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
    { stat: StatValue.INT, value: 6.5 },
    { stat: StatValue.CONC, value: 4.5 },
    { stat: StatValue.RES, value: 3.5 },
    { stat: StatValue.FRT, value: 2.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Wizard", level: 25 },
    { type: "jobLevel", jobId: "Sorcerer", level: 15 },
    { type: "stat", stat: StatValue.INT, value: 100 },
    { type: "stat", stat: StatValue.CONC, value: 80 },
  ],
};

export const Elementalist: JobDefinition = {
  id: "Elementalist",
  name: "Elementalist",
  description: "Channels raw elemental forces with devastating power. Nature's fury unleashed.",
  icon: GiFireRing,
  traits: [TraitValue.Magical, TraitValue.DPS, TraitValue.Aggressive],
  statBonuses: [
    { stat: StatValue.INT, value: 6.0 },
    { stat: StatValue.CRIT_C, value: 4.5 },
    { stat: StatValue.CRIT_D, value: 2.5 },
    { stat: StatValue.CONC, value: 2.0 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Sorcerer", level: 20 },
    { type: "abilityLevel", abilityId: "Beam", level: 30 },
    { type: "stat", stat: StatValue.INT, value: 80 },
    { type: "bossDefeats", bossId: "TrainingDummy", count: 5 },
  ],
};

export const Necromancer: JobDefinition = {
  id: "Necromancer",
  name: "Necromancer",
  description: "Dark mage who draws power from forbidden sources. Death is just the beginning.",
  icon: GiSkullCrossedBones,
  traits: [TraitValue.Magical, TraitValue.Support, TraitValue.Tank],
  statBonuses: [
    { stat: StatValue.INT, value: 5.0 },
    { stat: StatValue.FRT, value: 4.5 },
    { stat: StatValue.CON, value: 4.0 },
    { stat: StatValue.CONC, value: 3.0 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Warlock", level: 20 },
    { type: "stat", stat: StatValue.FRT, value: 70 },
    { type: "stat", stat: StatValue.INT, value: 70 },
    { type: "stat", stat: StatValue.CON, value: 60 },
  ],
};

