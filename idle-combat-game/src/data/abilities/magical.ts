// Magical Abilities - INT based attacks

import { GiLightningTrio, GiPoisonCloud } from "react-icons/gi";
import { DamageValue, StatusEffectValue, type AbilityDefinition } from "../../types/data";
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

export const CurseOfAgony: AbilityDefinition = {
  id: "CurseOfAgony",
  name: "Curse of Agony",
  description: "Channels forbidden dark magic that inflicts a lingering curse. Deals immediate damage and poisons the enemy, dealing true damage over time. Poison damage and duration increase with level. Requires Warlock Level 20.",
  icon: GiPoisonCloud,
  cooldown: 4.5,
  unlockCondition: { 
    stat: StatValue.INT, 
    required: 0,  // Legacy - actual requirement in unlockConditions
  },
  unlockConditions: [
    { type: "jobLevel", jobId: "Warlock", level: 20 },
  ],
  effects: [
    {
      baseDamage: 40,
      damageType: DamageValue.Magic,
      statusEffectConfig: {
        type: StatusEffectValue.Poison,
        baseDuration: 6.0,      // 6 seconds at level 1
        maxDuration: 18.0,      // 18 seconds at level 100
        baseValue: 8,           // 8 damage per second at level 1
        maxValue: 60,           // 60 damage per second at level 100
        tickRate: 1.0,          // Damage applied every 1 second
      },
    },
  ],
  damageMultiplier: 0,
  statusEffect: undefined,
};


