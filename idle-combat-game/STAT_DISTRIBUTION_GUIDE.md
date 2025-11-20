# Stat Distribution Design Guide

This document outlines the design principles for stat distribution across all jobs in the game. These principles ensure balanced gameplay where all stats remain competitive and viable throughout progression.

## Core Philosophy

**Stats compete against each other in combat calculations.** If one stat is significantly more prevalent than another, builds focusing on the rare stat will always be at a disadvantage. Therefore, all stats must maintain a minimum threshold of availability to ensure viability.

## Stat Distribution Targets

### Current Totals Across All Jobs (21 jobs):

| Tier | Stats | Total Range | Purpose |
|------|-------|-------------|---------|
| **Tier 1** | DEX, CON, CONC | 85-95 | Most Common - Core universal stats |
| **Tier 2** | STR, AGI, INT | 70-80 | Common - Primary archetype stats |
| **Tier 3** | FRT, TGH, RES, CRIT_C | 65-75 | Moderate - Specialized stats |
| **Tier 4** | CRIT_D | ~35 | Present - Damage multiplier (inherently powerful) |

### Minimum Threshold

**All stats must have at least 65 total points** across all jobs. This ensures that:
- Every stat remains competitive in comparative calculations
- Players can effectively build around any stat
- No stat becomes a "trap" choice
- All archetypes remain viable

## Stat Role Definitions

### Universal Stats (Appear in ALL archetypes)

**DEX (Dexterity)** - Target: 85-95 total
- **Why Universal**: Required for abilities to hit opponents
- **Distribution**: 
  - Swift jobs: Primary focus (highest values)
  - Physical jobs: Common (medium values)
  - Magical jobs: Regular (low-medium values)
- **Design Goal**: Players shouldn't need to specialize heavily to land hits

**CON (Constitution)** - Target: 85-95 total
- **Why Universal**: Determines HP pool with no alternative
- **Distribution**:
  - Physical jobs: Primary focus (highest values)
  - Swift jobs: Common (medium values)
  - Magical jobs: Limited but present (low values)
- **Design Goal**: All paths should have access to survivability

**CONC (Concentration)** - Target: 85-95 total
- **Why Universal**: Required for status effects to apply successfully
- **Distribution**:
  - Magical jobs: Primary focus (highest values)
  - Swift jobs: Common (medium values)
  - Physical jobs: Limited but present (low values)
- **Design Goal**: Status effects shouldn't require extreme specialization

### Archetype Primary Stats

**Physical Jobs (Warrior path)**:
- **STR (Strength)**: Primary damage stat - Target: 70-80 total
- **TGH (Toughness)**: Primary defense stat - Target: 65-75 total
- **Distribution**: High in Physical, low-medium in Swift, minimal in Magical

**Swift Jobs (Rogue path)**:
- **DEX (Dexterity)**: Primary accuracy/damage stat - Target: 85-95 total
- **AGI (Agility)**: Primary evasion stat - Target: 70-80 total
- **CRIT_C (Crit Chance)**: Primary burst stat - Target: 65-75 total
- **Distribution**: High in Swift, medium in Physical/Magical

**Magical Jobs (Mage path)**:
- **INT (Intelligence)**: Primary magic damage stat - Target: 70-80 total
- **FRT (Fortitude)**: Primary magic defense stat - Target: 65-75 total
- **RES (Resistance)**: Secondary magic defense stat - Target: 65-75 total
- **Distribution**: High in Magical, low-medium in Swift, minimal in Physical

### Special Stats

**CRIT_D (Critical Damage)** - Target: ~35 total
- **Why Lower**: It's a damage multiplier, making it inherently more powerful
- **Distribution**: Primarily in DPS-focused jobs across all archetypes
- **Design Goal**: Powerful but not dominant

## Job Archetype Guidelines

### Basic Jobs (Tier 0)
- **Total Stats Per Level**: 7-9 points
- **Focus**: Introduce archetype identity
- **Universal Stats**: Each should provide at least 0.5-1.0 in DEX, CON, or CONC

### Tier 1 Advanced Jobs
- **Total Stats Per Level**: 13-16 points
- **Focus**: Strengthen archetype identity while maintaining flexibility
- **Universal Stats**: Should include at least 1.0-2.0 in two universal stats

### Tier 2 Elite Jobs
- **Total Stats Per Level**: 27-34 points
- **Focus**: Specialized roles with diverse stat coverage
- **Universal Stats**: Should include all three universal stats to some degree

### Specialist Jobs
- **Total Stats Per Level**: 35-43 points
- **Focus**: Ultimate mastery with broad stat coverage
- **Universal Stats**: Should have significant values in all universal stats

## Stat Distribution by Archetype

### Physical Jobs
**Required Stats** (in order of importance):
1. STR or CON (primary)
2. DEX (always include)
3. TGH (tanks) or CRIT stats (DPS)
4. CONC (at least 0.5-1.0)

**Avoid**: INT, FRT, RES should be minimal (0-1.0)

### Swift Jobs
**Required Stats** (in order of importance):
1. DEX or AGI (primary)
2. CON (medium values)
3. CONC (common)
4. CRIT_C and/or CRIT_D (DPS focus)

**Balanced**: Should have small amounts of most stats for versatility

### Magical Jobs
**Required Stats** (in order of importance):
1. INT (primary)
2. CONC (high values)
3. DEX (always include for hit chance)
4. FRT and/or RES (defense)

**Avoid**: STR, TGH should be minimal (0-1.0)

### Hybrid Jobs
**Required Stats**:
- Must include primary stats from both parent archetypes
- Must maintain all universal stats (DEX, CON, CONC)
- Should have broader stat distribution than pure archetypes

### Tank Jobs
**Required Stats**:
- CON (highest priority)
- TGH (physical) and/or FRT/RES (magical)
- DEX (moderate - still need to hit)
- CONC (at least 1.0-2.0)

### DPS Jobs
**Required Stats**:
- Primary damage stat (STR/INT/DEX)
- CRIT stats (at least one)
- DEX (if not primary)
- CON (at least 1.5-3.0 for survivability)

### Support Jobs
**Required Stats**:
- CONC (high - for status effects)
- FRT (common)
- DEX (moderate)
- Mix of defensive stats (CON, TGH, RES)

## Ratio Guidelines for Future Jobs

When adding new jobs, maintain these approximate ratios:

### For Every 10 Jobs Added:
- **DEX**: Total should increase by 35-45 points
- **CON**: Total should increase by 35-45 points  
- **CONC**: Total should increase by 35-45 points
- **STR, AGI, INT**: Total should increase by 30-40 points each
- **TGH, FRT, RES, CRIT_C**: Total should increase by 25-35 points each
- **CRIT_D**: Total should increase by 15-18 points

### Minimum Per Job:
- Every job should provide at least 1 universal stat (DEX, CON, or CONC)
- Tank jobs should provide 2+ universal stats
- Hybrid jobs should provide all 3 universal stats

## Balance Testing

When rebalancing or adding jobs, verify:

1. **Minimum Threshold**: All stats have ≥65 total (except CRIT_D at ~35)
2. **Ratio Consistency**: Tier 1 (DEX/CON/CONC) remains 20-30% higher than Tier 2
3. **Archetype Identity**: Physical jobs provide most STR/TGH, Swift provide most DEX/AGI, Magical provide most INT/FRT
4. **Universal Coverage**: DEX appears in 90%+ of jobs, CON in 85%+, CONC in 80%+
5. **CRIT_D Special Case**: Remains around 1/2 of other stats due to multiplicative power

## Examples

### Good Physical Job (Barbarian):
```typescript
statBonuses: [
  { stat: STR, value: 5.0 },      // Primary damage
  { stat: CON, value: 3.0 },      // Universal HP
  { stat: CRIT_C, value: 3.0 },   // DPS identity
  { stat: CRIT_D, value: 2.5 },   // DPS burst
  { stat: TGH, value: 2.0 },      // Defense
  { stat: DEX, value: 1.0 },      // Universal hit chance
  { stat: AGI, value: 0.5 },      // Minor mobility
]
```

### Good Magical Job (Wizard):
```typescript
statBonuses: [
  { stat: INT, value: 4.0 },      // Primary damage
  { stat: CONC, value: 4.0 },     // Universal status effects
  { stat: RES, value: 2.5 },      // Magical defense
  { stat: DEX, value: 1.5 },      // Universal hit chance
  { stat: FRT, value: 1.5 },      // Magic defense
  { stat: CON, value: 1.0 },      // Universal HP
  { stat: AGI, value: 0.5 },      // Minor evasion
]
```

### Good Swift Job (Assassin):
```typescript
statBonuses: [
  { stat: DEX, value: 8.0 },      // Primary accuracy/damage
  { stat: CRIT_C, value: 7.0 },   // Swift identity - burst
  { stat: AGI, value: 6.0 },      // Evasion
  { stat: CRIT_D, value: 4.5 },   // Burst multiplier
  { stat: CONC, value: 2.5 },     // Universal status effects
  { stat: CON, value: 2.0 },      // Universal HP
  { stat: FRT, value: 1.0 },      // Minor defense
  { stat: STR, value: 1.0 },      // Minor strength
  { stat: INT, value: 0.5 },      // Minimal magic
]
```

## Summary

The key to balanced stat distribution is ensuring that every stat remains competitive across all jobs. By maintaining minimum thresholds and following archetype guidelines, we ensure that all build paths remain viable and fun to play. The universal stats (DEX, CON, CONC) form the foundation that prevents any single archetype from dominating, while archetype-specific stats provide meaningful differentiation and identity.

