// Magical Abilities - INT based attacks

import { GiLightningSpanner, GiLightningTrio } from "react-icons/gi";
import { DamageValue, type AbilityDefinition } from "../../types/data";
import { StatValue } from "../../types/game";

export const Beam: AbilityDefinition = {
  id: "Beam",
  name: "Beam",
  description: "A focused beam of magical energy that deals damage based on your Intelligence. Damage increases by 5% per level. Cooldown reduces by 0.1s every 10 levels.",
  icon: GiLightningTrio,
  cooldown: 2.0,
  unlockCondition: { stat: StatValue.INT, required: 0 }, // Available from start
  effects: [{ baseDamage: 10, damageType: DamageValue.Magic }],
  damageMultiplier: 0,
  statusEffect: undefined,
  // Starter ability scaling
  damageScaling: {
    type: "percentage",
    value: 0.05, // 5% per level
  },
  cooldownScaling: {
    type: "flat",
    reductionPerLevels: 0.1,
    levelsPerReduction: 10,
    minCooldown: 0.5,
  },
};

export const Fireball: AbilityDefinition = {
  id: "Fireball",
  name: "Fireball",
  description: "Hurls a powerful fiery projectile.",
  icon: GiLightningSpanner,
  cooldown: 8.0,
  unlockCondition: { stat: StatValue.INT, required: 15 },
  effects: [{ baseDamage: 40, damageType: DamageValue.Magic }],
  damageMultiplier: 0,
  statusEffect: undefined,
};


