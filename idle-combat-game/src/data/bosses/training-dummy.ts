// Training Dummy - Tutorial Boss
// First boss encounter for teaching mechanics

import type { BossDefinition } from "../../types/data";
import { DamageValue } from "../../types/data";
import { StatValue } from "../../types/game";
import type { IconBaseProps } from "react-icons";

export const TrainingDummy: BossDefinition = {
  id: "TrainingDummy",
  name: "Training Dummy",
  baseHp: 0, // HP now calculated from CON: 10 + (CON × 10)
  baseDamage: 30,
  stats: {
    [StatValue.STR]: 75,
    [StatValue.DEX]: 68,
    [StatValue.AGI]: 68,
    [StatValue.TGH]: 90,
    [StatValue.CON]: 120, // 10 + (120 × 10) = 1210 HP
    [StatValue.INT]: 68,
    [StatValue.FRT]: 90,
    [StatValue.CONC]: 75,
    [StatValue.RES]: 75,
    [StatValue.CRIT_C]: 60, // Low crit chance for tutorial boss
    [StatValue.CRIT_D]: 220, // 220% crit damage (+25% from 175)
  },
  ascensionPoints: 1,
  nextBoss: "GoblinKing",
  bossAbility: {
    name: "Wobble",
    cooldown: 3.5,
    effects: [{ baseDamage: 30, damageType: DamageValue.Physical }],
    id: "",
    description: "",
    icon: function (_props: IconBaseProps): React.ReactNode {
      throw new Error("Function not implemented.");
    },
    unlockCondition: {
      stat: StatValue.INT,
      required: 0
    },
    damageMultiplier: 0,
    statusEffect: undefined
  },
};

