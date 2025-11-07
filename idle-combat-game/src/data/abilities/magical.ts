// Magical Abilities - INT based attacks

import { GiLightningSpanner } from "react-icons/gi";
import { DamageValue, type AbilityDefinition } from "../../types/data";
import { StatValue } from "../../types/game";

export const Fireball: AbilityDefinition = {
  id: "Fireball",
  name: "Fireball",
  description: "Hurls a fiery projectile (2.0x INT).",
  icon: GiLightningSpanner,
  cooldown: 8.0,
  unlockCondition: { stat: StatValue.INT, required: 15 },
  effects: [{ damageMultiplier: 2.0, damageType: DamageValue.Magic }],
  damageMultiplier: 0,
  statusEffect: undefined,
};


