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
    { stat: StatValue.CON, value: 8.0 },
    { stat: StatValue.STR, value: 7.0 },
    { stat: StatValue.TGH, value: 6.0 },
    { stat: StatValue.CRIT_D, value: 2.5 },
    { stat: StatValue.DEX, value: 2.0 },
    { stat: StatValue.CONC, value: 1.5 },
    { stat: StatValue.FRT, value: 1.0 },
    { stat: StatValue.AGI, value: 0.5 },
    { stat: StatValue.RES, value: 0.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Guardian", level: 18 },
    { type: "jobLevel", jobId: "Barbarian", level: 18 },
    // Removed TGH 72 - Guardian 18 gives 72, but Barbarian needs Warrior 14 (28 TGH), total = 100 TGH (redundant)
  ],
};

export const Warlord: JobDefinition = {
  id: "Warlord",
  name: "Warlord",
  description: "Master tactician who leads through might and strategy. Commands respect through power and wisdom.",
  icon: GiCrownedSkull,
  traits: [TraitValue.Tactical, TraitValue.Physical, TraitValue.Support],
  statBonuses: [
    { stat: StatValue.STR, value: 6.0 },
    { stat: StatValue.INT, value: 5.0 },
    { stat: StatValue.CON, value: 4.5 },
    { stat: StatValue.CONC, value: 4.0 },
    { stat: StatValue.DEX, value: 2.5 },
    { stat: StatValue.FRT, value: 2.5 },
    { stat: StatValue.TGH, value: 2.0 },
    { stat: StatValue.AGI, value: 1.0 },
    { stat: StatValue.RES, value: 0.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Commander", level: 24 },
    { type: "totalJobLevels", value: 120 },
    // Removed STR 60 - Commander needs Warrior 12 (36 STR) + Commander 24 (60 STR) = 96 STR total (redundant)
  ],
};

export const Berserker: JobDefinition = {
  id: "Berserker",
  name: "Berserker",
  description: "Raging warrior who sacrifices defense for overwhelming offense. Fury incarnate.",
  icon: GiFlame,
  traits: [TraitValue.Aggressive, TraitValue.Physical, TraitValue.DPS],
  statBonuses: [
    { stat: StatValue.STR, value: 8.5 },
    { stat: StatValue.CRIT_C, value: 5.0 },
    { stat: StatValue.CRIT_D, value: 4.5 },
    { stat: StatValue.CON, value: 2.5 },
    { stat: StatValue.TGH, value: 2.0 },
    { stat: StatValue.DEX, value: 2.0 },
    { stat: StatValue.AGI, value: 1.5 },
    { stat: StatValue.CONC, value: 1.0 },
    { stat: StatValue.FRT, value: 0.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Barbarian", level: 24 },
    { type: "bossDefeats", bossId: "TrainingDummy", count: 12 },
    { type: "stat", stat: StatValue.CRIT_D, value: 180 }, // Barbarian 24 gives 60 CRIT_D - meaningful crit damage requirement
  ],
};

