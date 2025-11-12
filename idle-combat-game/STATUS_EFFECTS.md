# Status Effect System Documentation

## Overview

The status effect system provides a comprehensive framework for applying temporary effects to combatants during battle. All status effects scale with ability level and have configurable min/max values.

## Status Effect Types

### 🛡️ **Defensive Effects**

#### **Shield**
- **Target:** Self
- **Effect:** Absorbs damage before HP is affected
- **Parameters:**
  - `baseValue`: Starting shield amount at level 1
  - `maxValue`: Maximum shield amount at max level
  - `baseDuration`: How long shield lasts at level 1
  - `maxDuration`: Maximum duration at max level
- **Notes:** 
  - Shield stacks when reapplied
  - Poison damage bypasses shield (true damage)
  - Shield amount tracked separately from status effect

#### **Strong**
- **Target:** Self
- **Effect:** Increases all damage dealt by a percentage
- **Parameters:**
  - `baseValue`: Starting damage boost % at level 1 (e.g., 10 = 10%)
  - `maxValue`: Maximum damage boost % at max level (e.g., 30 = 30%)
  - `baseDuration`: Duration at level 1
  - `maxDuration`: Maximum duration at max level
- **Notes:** Multiplies final damage output

### ⚔️ **Offensive Effects**

#### **Weak**
- **Target:** Enemy
- **Effect:** Reduces all damage dealt by a percentage
- **Parameters:**
  - `baseValue`: Starting damage reduction % at level 1 (e.g., 10 = 10%)
  - `maxValue`: Maximum damage reduction % at max level (e.g., 40 = 40%)
  - `baseDuration`: Duration at level 1
  - `maxDuration`: Maximum duration at max level
- **Notes:** Reduces enemy's damage output

#### **Poison**
- **Target:** Enemy
- **Effect:** Deals true damage over time (bypasses all defenses including shield)
- **Parameters:**
  - `baseValue`: Damage per tick at level 1
  - `maxValue`: Damage per tick at max level
  - `baseDuration`: Total duration at level 1
  - `maxDuration`: Maximum total duration at max level
  - `tickRate`: How often damage is applied (e.g., 1.0 = every second)
- **Notes:** 
  - True damage ignores TGH/FRT
  - Bypasses shields
  - Damage shown in combat log each tick

### 🔒 **Control Effects**

#### **Stun**
- **Target:** Enemy
- **Effect:** Freezes ability cooldowns (abilities don't progress)
- **Parameters:**
  - `baseDuration`: Stun duration at level 1
  - `maxDuration`: Maximum stun duration at max level
  - `baseValue/maxValue`: Not used for Stun
- **Notes:** 
  - Cooldowns freeze but don't reset
  - Very powerful - use shorter durations
  - Does not prevent poison damage ticks

#### **Disarm**
- **Target:** Enemy
- **Effect:** Prevents physical abilities from firing
- **Parameters:**
  - `baseDuration`: Disarm duration at level 1
  - `maxDuration`: Maximum duration at max level
  - `baseValue/maxValue`: Not used for Disarm
- **Notes:**
  - Only affects Physical damage type abilities
  - Cooldowns still progress and reset
  - Ability gets blocked at fire time

#### **Silence**
- **Target:** Enemy
- **Effect:** Prevents magical abilities from firing
- **Parameters:**
  - `baseDuration`: Silence duration at level 1
  - `maxDuration`: Maximum duration at max level
  - `baseValue/maxValue`: Not used for Silence
- **Notes:**
  - Only affects Magic damage type abilities
  - Cooldowns still progress and reset
  - Ability gets blocked at fire time

## Implementation Guide

### Creating an Ability with Status Effect

```typescript
import { StatusEffectValue } from "../types/data";

export const StunStrike: AbilityDefinition = {
  id: "StunStrike",
  name: "Stun Strike",
  description: "A powerful strike that stuns the enemy.",
  icon: GiPunchBlast,
  unlockCondition: {
    stat: StatValue.STR,
    required: 50
  },
  effects: [{
    baseDamage: 50,
    damageType: DamageValue.Physical,
    statusEffectConfig: {
      type: StatusEffectValue.Stun,
      baseDuration: 1.0,    // 1 second at level 1
      maxDuration: 4.0,     // 4 seconds at level 100
      // baseValue/maxValue not needed for Stun
    }
  }],
  cooldown: 5.0,
};
```

### Status Effect Configuration Examples

#### Poison DoT
```typescript
statusEffectConfig: {
  type: StatusEffectValue.Poison,
  baseDuration: 5.0,       // 5 seconds at level 1
  maxDuration: 15.0,       // 15 seconds at max level
  baseValue: 10,           // 10 damage per tick at level 1
  maxValue: 100,           // 100 damage per tick at max level
  tickRate: 1.0,           // Damage every 1 second
}
```

#### Shield Buff
```typescript
statusEffectConfig: {
  type: StatusEffectValue.Shield,
  baseDuration: 3.0,       // 3 seconds at level 1
  maxDuration: 10.0,       // 10 seconds at max level
  baseValue: 50,           // 50 shield HP at level 1
  maxValue: 500,           // 500 shield HP at max level
}
```

#### Damage Buff
```typescript
statusEffectConfig: {
  type: StatusEffectValue.Strong,
  baseDuration: 2.0,       // 2 seconds at level 1
  maxDuration: 8.0,        // 8 seconds at max level
  baseValue: 10,           // 10% damage increase at level 1
  maxValue: 30,            // 30% damage increase at max level
}
```

#### Damage Debuff
```typescript
statusEffectConfig: {
  type: StatusEffectValue.Weak,
  baseDuration: 3.0,       // 3 seconds at level 1
  maxDuration: 10.0,       // 10 seconds at max level
  baseValue: 15,           // 15% damage reduction at level 1
  maxValue: 50,            // 50% damage reduction at max level
}
```

#### Disarm
```typescript
statusEffectConfig: {
  type: StatusEffectValue.Disarm,
  baseDuration: 1.5,       // 1.5 seconds at level 1
  maxDuration: 5.0,        // 5 seconds at max level
}
```

#### Silence
```typescript
statusEffectConfig: {
  type: StatusEffectValue.Silence,
  baseDuration: 1.5,       // 1.5 seconds at level 1
  maxDuration: 5.0,        // 5 seconds at max level
}
```

## Battle System Integration

### Processing Order (per tick)
1. **Update Status Effects** - Reduce durations, remove expired
2. **Process Poison** - Apply DoT damage
3. **Process Player Abilities**
   - Check if stunned (cooldowns frozen)
   - Check if disarmed/silenced (abilities blocked)
   - Apply Weak/Strong modifiers to damage
   - Apply shield absorption
   - Apply status effects from ability
4. **Process Boss Abilities** - Same as player
5. **Update State**

### Scaling Formula
```typescript
progress = (level - 1) / (maxLevel - 1)  // 0.0 to 1.0
effectiveValue = baseValue + (maxValue - baseValue) * progress
effectiveDuration = baseDuration + (maxDuration - baseDuration) * progress
```

### Status Effect Stacking Rules
- **Shield:** Values stack, duration takes the maximum
- **Other Effects:** Only the strongest effect of each type applies
  - Stronger = higher value or (if equal value) longer duration
  - New effects replace weaker existing effects
  - Weaker new effects are ignored

## Key Files

- **`src/types/data.ts`** - Type definitions and enums
- **`src/types/game.ts`** - Battle state with status effects
- **`src/core/statusEffects.ts`** - Status effect processing logic
- **`src/game/GameEngine.ts`** - Battle tick integration

## Design Considerations

### Balance Guidelines

1. **Stun** - Most powerful, use sparingly
   - Recommend: 1-4 seconds max
   - Long cooldowns (5-10 seconds)

2. **Disarm/Silence** - Strong but situational
   - Recommend: 1.5-5 seconds
   - Moderate cooldowns (4-7 seconds)

3. **Poison** - Sustained damage
   - Should deal ~30-50% of direct damage over duration
   - Good for long battles

4. **Weak** - Defensive debuff
   - 15-50% reduction reasonable
   - Longer durations okay (5-15 seconds)

5. **Strong** - Offensive buff
   - 10-30% increase balanced
   - Moderate durations (3-10 seconds)

6. **Shield** - Damage prevention
   - Should absorb 1-3 hits
   - Short to moderate durations (3-10 seconds)

### Combo Potential
- Stun → High damage combo
- Weak + Poison → Reduce retaliation while DoT works
- Shield + Strong → Safe aggressive window
- Disarm → Safety against physical bosses
- Silence → Safety against magical bosses

## Future Enhancements
- [ ] Multiple status effects per ability
- [ ] Status effect resistance stats
- [ ] Status effect cleanse abilities
- [ ] Status effect icons in battle UI
- [ ] Status effect duration bars
- [ ] Ability to see active effects on player/boss

