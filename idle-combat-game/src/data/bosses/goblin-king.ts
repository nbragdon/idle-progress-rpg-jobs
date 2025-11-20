// Goblin King - Tier 2 Boss
// Fast, dodgy boss with high crit damage

import type { BossDefinition } from "../../types/data";
import { DamageValue } from "../../types/data";
import { StatValue, type StatusEffectId } from "../../types/game";
import type { IconBaseProps } from "react-icons";

export const GoblinKing: BossDefinition = {
  id: "GoblinKing",
  name: "Goblin King",
  baseHp: 0, // HP now calculated from CON: 10 + (CON × 10)
  baseDamage: 125,
  stats: {
    [StatValue.STR]: 600, // Average strength
    [StatValue.DEX]: 675,
    [StatValue.AGI]: 900, // High dodge capability
    [StatValue.TGH]: 900, // Strong against physical
    [StatValue.CON]: 600, // 10 + (600 × 10) = 6010 HP (lower health)
    [StatValue.INT]: 675,
    [StatValue.FRT]: 900,
    [StatValue.CONC]: 750,
    [StatValue.RES]: 450, // Weak to magic damage
    [StatValue.CRIT_C]: 600, // Reduced crit chance for better balance
    [StatValue.CRIT_D]: 250, // 250% crit damage (+25% from 200)
  },
  ascensionPoints: 5,
  nextBoss: "AncientDragon",
  bossAbility: {
    name: "Vicious Strike",
    cooldown: 3.0,
    effects: [{
      baseDamage: 125,
      damageType: DamageValue.Physical,
      statusEffect: {
        id: "Weakness" as StatusEffectId,
        duration: 5.0,
        concentration: 0
      },
    }],
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

