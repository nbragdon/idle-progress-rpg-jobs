// Tier 2 - Warrior Advanced Classes
// These are elite warrior specializations requiring significant progression

import { GiMountainCave, GiCrownedSkull, GiRagingFire } from "react-icons/gi";
import type { JobDefinition } from "../../../types/data";
import { TraitValue } from "../../../types/data";
import { StatValue } from "../../../types/game";

export const Juggernaut: JobDefinition = {
  id: "Juggernaut",
  name: "Juggernaut",
  description: "Unstoppable force combining raw power with unbreakable defense. Nothing can halt your advance.",
  icon: GiMountainCave,
  traits: [TraitValue.Tank, TraitValue.Aggressive, TraitValue.Physical],
  statBonuses: [
    { stat: StatValue.STR, value: 5.0 },
    { stat: StatValue.TGH, value: 4.0 },
    { stat: StatValue.CON, value: 3.5 },
    { stat: StatValue.CRIT_D, value: 2.0 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Guardian", level: 15 },
    { type: "jobLevel", jobId: "Barbarian", level: 15 },
    { type: "stat", stat: StatValue.CON, value: 60 },
    { type: "stat", stat: StatValue.TGH, value: 60 },
  ],
};

export const Warlord: JobDefinition = {
  id: "Warlord",
  name: "Warlord",
  description: "Master tactician who leads through might and strategy. Commands respect through power and wisdom.",
  icon: GiCrownedSkull,
  traits: [TraitValue.Tactical, TraitValue.Physical, TraitValue.Support],
  statBonuses: [
    { stat: StatValue.INT, value: 4.5 },
    { stat: StatValue.STR, value: 4.0 },
    { stat: StatValue.FRT, value: 3.0 },
    { stat: StatValue.CONC, value: 2.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Commander", level: 20 },
    { type: "totalJobLevels", value: 100 },
    { type: "stat", stat: StatValue.INT, value: 50 },
    { type: "stat", stat: StatValue.STR, value: 50 },
  ],
};

export const Berserker: JobDefinition = {
  id: "Berserker",
  name: "Berserker",
  description: "Raging warrior who sacrifices defense for overwhelming offense. Fury incarnate.",
  icon: GiRagingFire,
  traits: [TraitValue.Aggressive, TraitValue.Physical, TraitValue.DPS],
  statBonuses: [
    { stat: StatValue.STR, value: 6.0 },
    { stat: StatValue.CRIT_D, value: 3.0 },
    { stat: StatValue.CRIT_C, value: 4.0 },
    { stat: StatValue.TGH, value: 0.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Barbarian", level: 20 },
    { type: "bossDefeats", bossId: "TrainingDummy", count: 10 },
    { type: "stat", stat: StatValue.STR, value: 80 },
    { type: "stat", stat: StatValue.CRIT_D, value: 100 },
  ],
};

