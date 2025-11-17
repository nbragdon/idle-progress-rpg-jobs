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
  baseDamage: 25,
  stats: {
    [StatValue.STR]: 50,
    [StatValue.DEX]: 45,
    [StatValue.AGI]: 45,
    [StatValue.TGH]: 60,
    [StatValue.CON]: 80, // 10 + (80 × 10) = 810 HP
    [StatValue.INT]: 45,
    [StatValue.FRT]: 60,
    [StatValue.CONC]: 50,
    [StatValue.RES]: 50,
    [StatValue.CRIT_C]: 300, // Moderate crit chance vs player defenses
    [StatValue.CRIT_D]: 175, // 175% crit damage
  },
  ascensionPoints: 1,
  nextBoss: "GoblinKing",
  bossAbility: {
    name: "Wobble",
    cooldown: 3.5,
    effects: [{ baseDamage: 25, damageType: DamageValue.Physical }],
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

