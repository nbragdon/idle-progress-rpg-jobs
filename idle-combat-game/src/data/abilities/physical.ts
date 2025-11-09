// Physical Abilities - STR/DEX/AGI based attacks

import { GiCrossedSwords, GiShieldImpact, GiPunch } from "react-icons/gi";
import { DamageValue, type AbilityDefinition, type StatusEffectId } from "../../types/data";
import { StatValue } from "../../types/game";

export const Smash: AbilityDefinition = {
  id: "Smash",
  name: "Smash",
  description: "A powerful physical attack that deals damage based on your Strength. Damage increases by 5% per level. Cooldown reduces by 0.1s every 10 levels.",
  icon: GiPunch,
  cooldown: 2.0,
  unlockCondition: { stat: StatValue.STR, required: 0 }, // Available from start
  effects: [{ baseDamage: 10, damageType: DamageValue.Physical }],
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

export const QuickStrike: AbilityDefinition = {
  id: "QuickStrike",
  name: "Quick Strike",
  description: "A swift physical attack with extra power.",
  icon: GiCrossedSwords,
  cooldown: 5.0,
  unlockCondition: { stat: StatValue.STR, required: 10 },
  effects: [{ baseDamage: 25, damageType: DamageValue.Physical }],
  damageMultiplier: 0,
  statusEffect: undefined,
};

export const ShieldBash: AbilityDefinition = {
  id: "ShieldBash",
  name: "Shield Bash",
  description: "Physical bash that can Stun the target.",
  icon: GiShieldImpact,
  cooldown: 12.0,
  unlockCondition: { stat: StatValue.TGH, required: 20 },
  effects: [
    {
      baseDamage: 15,
      damageType: DamageValue.Physical,
      statusEffect: {
        id: "Stun" as StatusEffectId,
        duration: 2.0,
        concentration: 20,
      },
    },
  ],
  damageMultiplier: 0,
  statusEffect: undefined,
};


