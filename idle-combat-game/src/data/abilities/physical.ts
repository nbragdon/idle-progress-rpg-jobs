// Physical Abilities - STR/DEX/AGI based attacks

import { GiCrossedSwords, GiShieldImpact } from "react-icons/gi";
import { DamageValue, type AbilityDefinition, type StatusEffectId } from "../../types/data";
import { StatValue } from "../../types/game";

export const QuickStrike: AbilityDefinition = {
  id: "QuickStrike",
  name: "Quick Strike",
  description: "A swift physical attack (1.5x STR).",
  icon: GiCrossedSwords,
  cooldown: 5.0,
  unlockCondition: { stat: StatValue.STR, required: 10 },
  effects: [{ damageMultiplier: 1.5, damageType: DamageValue.Physical }],
  damageMultiplier: 0,
  statusEffect: undefined,
};

export const ShieldBash: AbilityDefinition = {
  id: "ShieldBash",
  name: "Shield Bash",
  description: "Physical bash (0.8x STR) that can Stun.",
  icon: GiShieldImpact,
  cooldown: 12.0,
  unlockCondition: { stat: StatValue.TGH, required: 20 },
  effects: [
    {
      damageMultiplier: 0.8,
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


