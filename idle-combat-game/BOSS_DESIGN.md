# Boss Design Philosophy

## Scaling Overview

### **10x Scaling Rule (Current)**
Each boss is approximately **10x stronger** than the previous boss across all dimensions:

| Boss | HP Multiplier | Stat Multiplier | CRIT_C | Ascension Points |
|------|--------------|-----------------|---------|------------------|
| Training Dummy (Base) | 1x (810) | 1x (50 STR) | 1x (300) | 1 AP |
| Goblin King | 10x (8,010) | 10x (500 STR) | 10x (3,000) | 5 AP |
| Ancient Dragon | 100x (80,010) | 100x (5,000 STR) | 100x (30,000) | 50 AP |

### **Future Scaling (Beyond Ancient Dragon)**
As more bosses are added, the multiplier should increase:
- **Bosses 4-6:** 15x scaling (faster progression needed)
- **Bosses 7-9:** 20x scaling (endgame content)
- **Bosses 10+:** 25-30x scaling (extreme endgame)

This widening gap ensures:
1. Ascension system remains valuable
2. Players must engage with all systems
3. Progression feels meaningful
4. Idle mechanics have time to work

## Boss Template

### Required Components

```typescript
{
  id: string;                    // Unique identifier
  name: string;                  // Display name
  baseHp: 0;                     // Always 0, calculated from CON
  baseDamage: number;            // Used in ability scaling
  stats: {
    STR: number;                 // Offensive stat for Physical
    DEX: number;                 // Hit chance
    AGI: number;                 // Dodge chance
    TGH: number;                 // Physical defense
    CON: number;                 // HP = 10 + (CON × 10)
    INT: number;                 // Offensive stat for Magic
    FRT: number;                 // Magical defense
    CONC: number;                // Future: concentration mechanics
    RES: number;                 // Future: resistance mechanics
    CRIT_C: number;              // Crit chance vs player defenses
    CRIT_D: number;              // Crit damage multiplier (%)
  };
  ascensionPoints: number;       // AP reward on victory
  nextBoss: string | undefined;  // Next boss to unlock
  bossAbility: AbilityDefinition; // Primary attack
}
```

### Stat Distribution Guidelines

**Balanced Boss (Like Training Dummy):**
- Primary offensive stat (STR/INT): 50-65% of level equivalence
- Secondary stats (DEX/AGI/CONC): ~45-55% of primary
- Defense stats (TGH/FRT): ~60-75% of primary (slightly tankier)
- CON: ~80-100% of primary (determines survivability)
- CRIT_C: ~3-5x average of player defenses at target level
- CRIT_D: 150-200% (increases slightly per tier)

**Offensive Boss:**
- Higher STR/INT (~80% of level)
- Lower defenses (~40-50%)
- Faster ability cooldowns

**Defensive Boss:**
- Higher TGH/FRT/CON (~100%+ of level)
- Lower damage output
- Slower ability cooldowns
- Tests player DPS optimization

## Ability Design

### Cooldown Scaling
Abilities should have faster cooldowns as bosses get stronger:
```
Training Dummy: 3.5s
Goblin King: 3.0s
Ancient Dragon: 2.5s
Future bosses: 2.0s → 1.5s → 1.0s minimum
```

### Damage Type Strategy
Vary damage types to encourage diverse builds:
- **Training Dummy:** Physical (teaches defense building)
- **Goblin King:** Physical (reinforces physical defense)
- **Ancient Dragon:** Magical (forces magical defense)
- **Future bosses:** Mix of Physical, Magical, True damage

### Status Effects (Future)
Later bosses should incorporate status effects:
- DoTs (Damage over Time)
- Stat reductions
- Healing absorption
- Multi-hit combos

## Target Clear Times

### First Victory
- **Training Dummy:** 30-45 minutes (strategic play)
- **Goblin King:** 2-4 hours total playtime + 1-2 ascensions
- **Ancient Dragon:** 10-15 hours total + 3-5 ascensions

### Farming (Post-Ascension)
After ascension upgrades, players should be able to farm previous bosses:
- Previous tier: ~5-10 minutes
- Two tiers back: ~1-2 minutes
- Three+ tiers back: <30 seconds

## Design Checklist

When creating a new boss:
- [ ] Stats are 10-30x previous boss (depending on tier)
- [ ] HP calculated correctly from CON
- [ ] CRIT_C scales with defense expectations
- [ ] Ability cooldown is appropriate for tier
- [ ] Damage type creates strategic variety
- [ ] Ascension Points feel rewarding (5x per tier typical)
- [ ] `nextBoss` correctly chains progression
- [ ] Boss documented in BATTLE_SYSTEM.md
- [ ] Clear time estimates provided
- [ ] Build diversity is encouraged (not one-strategy boss)

## Example Calculations

### Training Dummy → Goblin King (10x)
```
Training Dummy:
- CON: 80 → HP: 810
- STR: 50 → Base damage: 25 + 50 = 75
- TGH/FRT: 60 (avg) → Moderate defense
- CRIT_C: 300 → Against ~20 player defense = 15% crit

Goblin King (×10):
- CON: 800 → HP: 8,010
- STR: 500 → Base damage: 250 + 500 = 750
- TGH/FRT: 600 (avg) → Moderate defense
- CRIT_C: 3,000 → Against ~200 player defense = 15% crit (maintained)
```

### Maintaining Relative Difficulty
The 10x multiplier maintains the **relative challenge** because:
1. Player stats also grow (through jobs/ascension)
2. Players unlock better abilities between bosses
3. Ascension Points provide permanent power boosts
4. Skill system multiplies progression

## Future Considerations

### Boss 4: Recommended Stats
- **Multiplier from Ancient Dragon:** 15x
- **HP:** ~1,200,000 (CON: 120,000)
- **Stats:** 75,000-90,000 range
- **CRIT_C:** 450,000
- **Ascension Points:** 250 AP
- **Estimated Clear:** 30-50 hours + 8-10 ascensions

### Boss 5+
Continue increasing multiplier (20x, 25x, 30x) to maintain challenge as:
- Ascension upgrades compound
- More jobs unlock
- Ability levels get very high
- Multiple ascension currencies available (future feature)

