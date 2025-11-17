# Boss Data Organization

This directory contains all boss definitions for the game, organized into individual files for better maintainability.

## Structure

```
bosses/
├── index.ts              # Main export - ALL_BOSSES record
├── training-dummy.ts     # Tier 1 - Tutorial boss
├── goblin-king.ts        # Tier 2 - Early game boss
├── ancient-dragon.ts     # Tier 3 - Mid game boss
└── README.md            # This file
```

## Boss Tiers

### Tier 1 - Tutorial Boss
**Training Dummy**
- HP: 810 (CON 80)
- Purpose: Teaching basic combat mechanics
- Ascension Points: 1
- Ability: "Wobble" (3.5s cooldown, Physical damage)

### Tier 2 - Early Game Boss
**Goblin King**
- HP: 4,010 (CON 400)
- Purpose: First real challenge requiring job diversification
- Ascension Points: 5
- Strategy: High dodge (AGI 600), weak to magic (RES 300)
- Ability: "Vicious Strike" (3.0s cooldown, Physical + Weakness debuff)

### Tier 3 - Mid Game Boss
**Ancient Dragon**
- HP: 80,010 (CON 8,000)
- Purpose: Major milestone requiring ascension upgrades
- Ascension Points: 50
- Strategy: Balanced defenses, magical damage dealer
- Ability: "Inferno Breath" (2.5s cooldown, Magic damage)

## Scaling Guidelines

Bosses follow a ~10x scaling pattern between tiers:

| Boss | HP Multiplier | Stat Multiplier | CRIT_C | Ascension Points |
|------|---------------|-----------------|---------|------------------|
| Training Dummy | 1x (810) | 1x (50 STR) | 300 | 1 AP |
| Goblin King | 5x (4,010) | 8x (400 STR) | 400 | 5 AP |
| Ancient Dragon | 100x (80,010) | 100x (5,000 STR) | 30,000 | 50 AP |

## Boss Stat Design Philosophy

### Primary Stats Purpose
- **STR/INT**: Determines base damage output
- **DEX**: Affects hit chance and ability triggering
- **AGI**: Determines dodge capability
- **TGH/FRT**: Physical and magical damage reduction
- **CON**: Determines HP pool (10 + CON × 10)
- **CONC**: Reduces status effect duration
- **RES**: Reduces status effect potency
- **CRIT_C**: Critical hit chance
- **CRIT_D**: Critical damage multiplier

### Design Patterns

1. **Specialized Weaknesses**: Each boss should have at least one weakness
   - Training Dummy: Balanced (tutorial)
   - Goblin King: RES 300 (weak to magic)
   - Ancient Dragon: Balanced high stats

2. **Unique Strategies**: Encourage different approaches
   - Training Dummy: Learn basic mechanics
   - Goblin King: High AGI requires DEX investment or magic damage
   - Ancient Dragon: Requires well-rounded build

3. **Ability Design**:
   - Cooldowns decrease as bosses get harder (3.5s → 3.0s → 2.5s)
   - Later bosses use more complex abilities (status effects, multiple effects)
   - Damage types vary to encourage defensive diversity

## Adding New Bosses

When adding a new boss, follow these steps:

1. **Create New File**: `bosses/[boss-name].ts`
   ```typescript
   import type { BossDefinition } from "../../types/data";
   import { StatValue, DamageValue } from "../../types/game";
   import type { IconBaseProps } from "react-icons";

   export const NewBoss: BossDefinition = {
     id: "NewBoss",
     name: "New Boss",
     // ... boss data
   };
   ```

2. **Update Index**: Add to `bosses/index.ts`
   ```typescript
   import { NewBoss } from "./new-boss";

   export const ALL_BOSSES: Record<string, BossDefinition> = {
     // ... existing bosses
     NewBoss,
   };
   ```

3. **Update Previous Boss**: Set `nextBoss` field on the boss that should unlock this one

4. **Design Checklist**:
   - [ ] HP calculated from CON (10 + CON × 10)
   - [ ] Stats scaled appropriately for tier (~10x from previous tier)
   - [ ] At least one weakness or strategic element
   - [ ] Boss ability with appropriate cooldown
   - [ ] Ascension points awarded (1, 5, 50, etc.)
   - [ ] Unique combat strategy or gimmick

## Boss Ability Structure

Boss abilities use the same structure as player abilities but are defined inline:

```typescript
bossAbility: {
  name: "Ability Name",
  cooldown: 3.0, // Seconds between uses
  effects: [{
    baseDamage: 100,
    damageType: DamageValue.Physical, // or Magic, True
    statusEffect?: { // Optional
      id: "StatusEffectId",
      duration: 5.0,
      concentration: 0
    }
  }],
  // Required placeholder fields (not used by bosses)
  id: "",
  description: "",
  icon: function (_props: IconBaseProps): React.ReactNode {
    throw new Error("Function not implemented.");
  },
  unlockCondition: { stat: StatValue.INT, required: 0 },
  damageMultiplier: 0,
  statusEffect: undefined
}
```

## Future Considerations

### Tier 4+ Bosses
When adding higher tier bosses, consider:
- Faster ability cooldowns (2.0s → 1.5s → 1.0s minimum)
- Multiple ability effects per use
- More complex status effect combinations
- Varied damage types (mix Physical, Magic, True)
- Unique mechanics (shields, phases, enrage timers)

### Boss Variants
Consider adding variants of existing bosses:
- "Enraged [Boss]" - Higher stats, faster cooldowns
- "[Boss] (Hard Mode)" - Different ability patterns
- "Elite [Boss]" - Random stat boosts

### Boss Collections
Group bosses by theme or progression path:
- Tutorial bosses
- Forest bosses
- Dungeon bosses
- Dragon family
- Elemental bosses

