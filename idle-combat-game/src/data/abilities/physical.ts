// Physical Abilities - STR/DEX/AGI based attacks

import { GiPunch, GiShieldReflect, GiNinjaStar } from "react-icons/gi";
import { DamageValue, StatusEffectValue, type AbilityDefinition, type StatusEffectId } from "../../types/data";
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

export const BastionShield: AbilityDefinition = {
  id: "BastionShield",
  name: "Bastion Shield",
  description: "The Guardian's ultimate defensive ability. Conjures a magical shield that absorbs damage. Damage, shield strength, and duration all increase with level. Requires Guardian Level 20.",
  icon: GiShieldReflect,
  cooldown: 5.0,
  unlockCondition: { 
    stat: StatValue.TGH, 
    required: 0,  // Legacy - actual requirement in unlockConditions
  },
  unlockConditions: [
    { type: "jobLevel", jobId: "Guardian", level: 20 },
  ],
  effects: [
    {
      baseDamage: 30,
      damageType: DamageValue.Physical,
      statusEffectConfig: {
        type: StatusEffectValue.Shield,
        baseDuration: 4.0,    // 4 seconds at level 1
        maxDuration: 14.0,    // 14 seconds at level 100
        baseValue: 100,       // 100 shield at level 1
        maxValue: 1000,       // 1000 shield at level 100
      },
    },
  ],
  damageMultiplier: 0,
  statusEffect: undefined,
  // Advanced ability scaling (unlocked at job level 20)
  damageScaling: {
    type: "percentage",
    value: 0.08, // 8% per level - better than starters
  },
  cooldownScaling: {
    type: "flat",
    reductionPerLevels: 0.15,
    levelsPerReduction: 10,
    minCooldown: 2.0,
  },
};

export const Shadowstrike: AbilityDefinition = {
  id: "Shadowstrike",
  name: "Shadowstrike",
  description: "A lightning-fast strike from the shadows that leaves enemies stunned. Damage and stun duration increase with level. Requires Shadow Level 20.",
  icon: GiNinjaStar,
  cooldown: 4.0,
  unlockCondition: { 
    stat: StatValue.AGI, 
    required: 0,  // Legacy - actual requirement in unlockConditions
  },
  unlockConditions: [
    { type: "jobLevel", jobId: "Shadow", level: 20 },
  ],
  effects: [
    {
      baseDamage: 60,
      damageType: DamageValue.Physical,
      statusEffectConfig: {
        type: StatusEffectValue.Stun,
        baseDuration: 1.0,    // 1.0 second stun at level 1
        maxDuration: 4.5,     // 4.5 second stun at level 100
      },
    },
  ],
  damageMultiplier: 0,
  statusEffect: undefined,
  // Advanced ability scaling (unlocked at job level 20)
  damageScaling: {
    type: "percentage",
    value: 0.07, // 7% per level - high base damage + CC
  },
  cooldownScaling: {
    type: "flat",
    reductionPerLevels: 0.12,
    levelsPerReduction: 10,
    minCooldown: 1.5,
  },
};


