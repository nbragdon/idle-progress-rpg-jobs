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
  baseDamage: 100,
  stats: {
    [StatValue.STR]: 400, // Average strength
    [StatValue.DEX]: 450,
    [StatValue.AGI]: 600, // High dodge capability
    [StatValue.TGH]: 600, // Strong against physical
    [StatValue.CON]: 400, // 10 + (400 × 10) = 4010 HP (lower health)
    [StatValue.INT]: 450,
    [StatValue.FRT]: 600,
    [StatValue.CONC]: 500,
    [StatValue.RES]: 300, // Weak to magic damage
    [StatValue.CRIT_C]: 400, // Reduced crit chance for better balance
    [StatValue.CRIT_D]: 200, // 200% crit damage
  },
  ascensionPoints: 5,
  nextBoss: "AncientDragon",
  bossAbility: {
    name: "Vicious Strike",
    cooldown: 3.0,
    effects: [{
      baseDamage: 100,
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

