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
  baseDamage: 3125,
  stats: {
    [StatValue.STR]: 7500,
    [StatValue.DEX]: 6750,
    [StatValue.AGI]: 6750,
    [StatValue.TGH]: 9000,
    [StatValue.CON]: 12000, // 10 + (12000 × 10) = 120,010 HP (~10x Goblin King)
    [StatValue.INT]: 6750,
    [StatValue.FRT]: 9000,
    [StatValue.CONC]: 7500,
    [StatValue.RES]: 7500,
    [StatValue.CRIT_C]: 6000, // Moderate endgame crit chance
    [StatValue.CRIT_D]: 280, // 280% crit damage (+25% from 225)
  },
  ascensionPoints: 50,
  bossAbility: {
    name: "Inferno Breath",
    cooldown: 2.5,
    effects: [{ baseDamage: 3125, damageType: DamageValue.Magic }],
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

