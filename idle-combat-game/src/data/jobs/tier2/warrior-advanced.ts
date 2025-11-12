// Tier 2 - Warrior Advanced Classes
// These are elite warrior specializations requiring significant progression

import { GiMountains, GiCrownedSkull, GiFlame } from "react-icons/gi";
import type { JobDefinition } from "../../../types/data";
import { TraitValue } from "../../../types/data";
import { StatValue } from "../../../types/game";

export const Juggernaut: JobDefinition = {
  id: "Juggernaut",
  name: "Juggernaut",
  description: "Unstoppable force combining raw power with unbreakable defense. Nothing can halt your advance.",
  icon: GiMountains,
  traits: [TraitValue.Tank, TraitValue.Aggressive, TraitValue.Physical],
  statBonuses: [
    { stat: StatValue.STR, value: 7.5 },
    { stat: StatValue.TGH, value: 6.0 },
    { stat: StatValue.CON, value: 5.5 },
    { stat: StatValue.CRIT_D, value: 3.0 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Guardian", level: 18 },
    { type: "jobLevel", jobId: "Barbarian", level: 18 },
    { type: "stat", stat: StatValue.CON, value: 72 },
    { type: "stat", stat: StatValue.TGH, value: 72 },
  ],
};

export const Warlord: JobDefinition = {
  id: "Warlord",
  name: "Warlord",
  description: "Master tactician who leads through might and strategy. Commands respect through power and wisdom.",
  icon: GiCrownedSkull,
  traits: [TraitValue.Tactical, TraitValue.Physical, TraitValue.Support],
  statBonuses: [
    { stat: StatValue.INT, value: 7.0 },
    { stat: StatValue.STR, value: 6.0 },
    { stat: StatValue.FRT, value: 4.5 },
    { stat: StatValue.CONC, value: 4.0 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Commander", level: 24 },
    { type: "totalJobLevels", value: 120 },
    { type: "stat", stat: StatValue.INT, value: 60 },
    { type: "stat", stat: StatValue.STR, value: 60 },
  ],
};

export const Berserker: JobDefinition = {
  id: "Berserker",
  name: "Berserker",
  description: "Raging warrior who sacrifices defense for overwhelming offense. Fury incarnate.",
  icon: GiFlame,
  traits: [TraitValue.Aggressive, TraitValue.Physical, TraitValue.DPS],
  statBonuses: [
    { stat: StatValue.STR, value: 9.0 },
    { stat: StatValue.CRIT_D, value: 4.5 },
    { stat: StatValue.CRIT_C, value: 6.0 },
    { stat: StatValue.TGH, value: 0.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Barbarian", level: 24 },
    { type: "bossDefeats", bossId: "TrainingDummy", count: 12 },
    { type: "stat", stat: StatValue.STR, value: 96 },
    { type: "stat", stat: StatValue.CRIT_D, value: 120 },
  ],
};

