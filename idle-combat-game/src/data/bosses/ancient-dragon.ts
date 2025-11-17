// Ancient Dragon - Tier 3 Boss
// Massive endgame boss with magical attacks

import type { BossDefinition } from "../../types/data";
import { DamageValue } from "../../types/data";
import { StatValue } from "../../types/game";
import type { IconBaseProps } from "react-icons";

export const AncientDragon: BossDefinition = {
  id: "AncientDragon",
  name: "Ancient Dragon",
  baseHp: 0, // HP now calculated from CON: 10 + (CON × 10)
  baseDamage: 2500,
  stats: {
    [StatValue.STR]: 5000,
    [StatValue.DEX]: 4500,
    [StatValue.AGI]: 4500,
    [StatValue.TGH]: 6000,
    [StatValue.CON]: 8000, // 10 + (8000 × 10) = 80,010 HP (~10x Goblin King)
    [StatValue.INT]: 4500,
    [StatValue.FRT]: 6000,
    [StatValue.CONC]: 5000,
    [StatValue.RES]: 5000,
    [StatValue.CRIT_C]: 30000, // ~10x Goblin King
    [StatValue.CRIT_D]: 225, // 225% crit damage
  },
  ascensionPoints: 50,
  bossAbility: {
    name: "Inferno Breath",
    cooldown: 2.5,
    effects: [{ baseDamage: 2500, damageType: DamageValue.Magic }],
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

