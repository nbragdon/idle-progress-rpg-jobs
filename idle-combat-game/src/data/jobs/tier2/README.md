# Tier 2 Jobs - Elite Classes

## Overview
Tier 2 jobs are elite specializations that require significant progression and offer substantially higher stat bonuses than tier 1 jobs (roughly 1.5-2x the bonuses).

**Stat Range:** 3.0 - 7.0 per stat (vs Tier 1: 1.5 - 3.5)

## Job Categories

### Warrior Path (warrior-advanced.ts)
- **Juggernaut** - Tank/Aggressive hybrid with extreme survivability
- **Warlord** - Tactical commander combining strength and intelligence
- **Berserker** - Pure DPS glass cannon with massive critical damage

### Rogue Path (rogue-advanced.ts)
- **Assassin** - Critical strike specialist with extreme precision
- **Trickster** - Versatile opportunist with tactical advantages
- **Duelist** - Defensive agility build combining speed and resilience

### Mage Path (mage-advanced.ts)
- **Archmage** - Supreme magical mastery with highest INT scaling
- **Elementalist** - Magical DPS with critical strike focus
- **Necromancer** - Dark magic tank with high survivability

### Hybrid Path (hybrid.ts)
- **Spellblade** - STR/INT hybrid warrior-mage
- **Battle Priest** - Holy tank with magical support capabilities
- **Shadow Dancer** - AGI/INT hybrid mystic rogue

### Specialist Path (specialist.ts)
- **Grand Master** - Requires all Warrior tier 1 jobs mastered
- **Sage** - Requires all Mage tier 1 jobs + all basic skills at level 20
- **Apex Predator** - Requires all Rogue tier 1 jobs + Goblin King defeat

## Unlock Condition Types

### Basic Conditions (Tier 1)
- `jobLevel` - Specific job must reach a level
- `stat` - Specific stat must reach a value

### Advanced Conditions (Tier 2 New)
- `totalJobLevels` - Sum of all job levels
- `totalSkillLevels` - Sum of all skill levels
- `abilityLevel` - Specific ability must reach a level
- `skillLevel` - Specific skill must reach a level
- `bossDefeats` - Must defeat a boss a certain number of times
- `anyJobFromList` - Any job from a list must reach a level
- `anyStat` - ANY stat must reach a value (for Grand Master)

## Design Philosophy

### Unlock Difficulty Tiers

**Easy Tier 2 (Single Path Mastery):**
- Juggernaut, Archmage, Duelist
- Require 2-3 tier 1 jobs from same path
- Target: Achievable after 5-10 hours of focused progression

**Medium Tier 2 (Cross-Training):**
- Trickster, Elementalist, Warlord
- Require mix of job levels, skill levels, or boss defeats
- Target: 10-20 hours with diverse progression

**Hard Tier 2 (Hybrid Mastery):**
- Spellblade, Battle Priest, Shadow Dancer
- Require mastery across multiple job paths
- Target: 15-25 hours with strategic cross-training

**Elite Tier 2 (Specialist Mastery):**
- Grand Master, Sage, Apex Predator
- Require complete mastery of entire job paths
- Target: 30-50+ hours with comprehensive progression

### Stat Scaling Examples

**Balanced Build (Grand Master):**
```
STR: 5.0, TGH: 4.0, CON: 4.0, DEX: 3.5, AGI: 3.5
Total: 24.0 stat points per level
```

**Focused Build (Sage):**
```
INT: 7.0, CONC: 5.0, RES: 4.0, FRT: 3.0
Total: 19.0 stat points per level (but highest single stat)
```

**Glass Cannon (Berserker):**
```
STR: 6.0, CRIT_D: 3.0, CRIT_C: 4.0, TGH: 0.5
Total: 13.5 stat points (extreme offense, minimal defense)
```

## Adding New Tier 2 Jobs

1. Choose appropriate category file or create new one
2. Define job with JobDefinition interface
3. Set stat bonuses 1.5-2x higher than tier 1
4. Create interesting unlock conditions using new types
5. Export in tier2/index.ts
6. Test unlock conditions are achievable

## Progression Milestones

| Hours Played | Expected Progress |
|-------------|-------------------|
| 5-10 | First tier 2 job unlock |
| 10-20 | 2-3 tier 2 jobs accessible |
| 20-30 | Hybrid jobs unlocking |
| 30-50 | Specialist jobs becoming accessible |
| 50+ | Multiple tier 2 jobs at high levels |

