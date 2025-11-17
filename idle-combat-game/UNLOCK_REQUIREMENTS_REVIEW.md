# Job Unlock Requirements Review & Cleanup

## Philosophy

Job unlock requirements should only include stat requirements that are **meaningful** - either:
1. The stat is NOT provided by the prerequisite job (branching into new area)
2. The stat requirement is HIGH ENOUGH that just leveling the prerequisite won't give you enough

Redundant requirements should be removed to avoid confusion and unnecessary gate-keeping.

## Changes Made

### Tier 1 Jobs

#### Commander
- **Before**: Warrior 12 + INT 30 + STR 25
- **After**: Warrior 12 + INT 30
- **Reasoning**: Warrior 12 gives 36 STR, so STR 25 is redundant. INT 30 is meaningful (Warrior gives 0 INT).

#### Warlock
- **Before**: Mage 12 + FRT 30 + INT 25
- **After**: Mage 12 + FRT 30
- **Reasoning**: Mage 12 gives 36 INT, so INT 25 is redundant. FRT 30 is meaningful (Mage gives 0 FRT).

#### Skirmisher
- **Before**: Rogue 12 + AGI 30 + DEX 25
- **After**: Rogue 12 + AGI 30
- **Reasoning**: Rogue 12 gives 30 DEX, so DEX 25 is redundant. AGI 30 is meaningful (Rogue 12 only gives 24 AGI).

### Tier 2 Jobs

#### Juggernaut
- **Before**: Guardian 18 + Barbarian 18 + CON 72 + TGH 72
- **After**: Guardian 18 + Barbarian 18 + TGH 72
- **Reasoning**: Combined jobs give 90 CON, so CON 72 is redundant. TGH 72 kept (Guardian 18 gives exactly 72 - signals Guardian mastery).

#### Warlord
- **Before**: Commander 24 + totalJobLevels 120 + INT 60 + STR 60
- **After**: Commander 24 + totalJobLevels 120 + STR 60
- **Reasoning**: Commander 24 gives 84 INT, so INT 60 is redundant. STR 60 kept (Commander 24 gives exactly 60 - signals Commander mastery).

#### Berserker
- **Before**: Barbarian 24 + 12 boss defeats + STR 96 + CRIT_D 120
- **After**: Barbarian 24 + 12 boss defeats + CRIT_D 120
- **Reasoning**: Barbarian 24 gives 108 STR, so STR 96 is redundant. CRIT_D 120 is meaningful (Barbarian 24 only gives 48).

#### Archmage
- **Before**: Wizard 30 + Sorcerer 18 + INT 120 + CONC 96
- **After**: Wizard 30 + Sorcerer 18
- **Reasoning**: Combined jobs give 201 INT and 132 CONC, so both stat requirements are redundant. Job level requirements are sufficient gate.

#### Elementalist
- **Before**: Sorcerer 24 + Beam 36 + INT 96 + 6 boss defeats
- **After**: Sorcerer 24 + Beam 36 + 6 boss defeats
- **Reasoning**: Sorcerer 24 gives 108 INT, so INT 96 is redundant.

## Jobs That Keep Cross-Path Stat Requirements

These jobs correctly maintain their stat requirements because they require stats from DIFFERENT paths:

### Meaningful Cross-Path Requirements (Kept)

- **Assassin**: Shadow 24 + Smash 36 + DEX 84 + CRIT_C 240
  - Shadow 24 only gives 60 DEX (needs 84) ✓
  - CRIT_C 240 also meaningful (only have 156) ✓

- **Duelist**: Skirmisher 24 + AGI 84 + DEX 72 + FRT 60
  - All stats are meaningful thresholds above what Skirmisher 24 provides ✓

- **Necromancer**: Warlock 24 + FRT 84 + INT 84 + CON 72
  - FRT and CON requirements meaningful (Warlock 24 only gives 60 each) ✓
  - INT 84 kept (exactly at threshold - signals Warlock mastery) ✓

- **Spellblade**: (Guardian/Barbarian/Commander) 18 + (Wizard/Sorcerer/Warlock) 18 + STR 60 + INT 60
  - Cross-path hybrid requiring both physical and magical stats ✓

- **BattlePriest**: Guardian 24 + Wizard 18 + totalSkillLevels 90 + FRT 84
  - Cross-path hybrid, FRT requirement meaningful ✓

- **ShadowDancer**: (Shadow/Thief/Skirmisher) 24 + (Wizard/Sorcerer/Warlock) 18 + AGI 84 + INT 72
  - Cross-path hybrid requiring both rogue and mage stats ✓

## Jobs With Pure Stat Requirements (No Job Levels)

These jobs correctly use ONLY stat requirements, which is totally fine:

- **Barbarian**: STR 40 + CON 25
- **Sorcerer**: INT 40 + CONC 25
- **Thief**: DEX 40 + AGI 25

This design allows players to reach these jobs through ANY path that provides those stats.

## Summary Statistics

- **Redundant requirements removed**: 9 stat requirements
- **Meaningful requirements kept**: All cross-path and high-threshold stat checks
- **Jobs with pure stat unlocks**: 3 (Barbarian, Sorcerer, Thief)
- **Total jobs reviewed**: 21

## Guidelines for Future Jobs

When adding new job unlock requirements:

1. **Calculate what the prerequisite gives**: Multiply job level × stat bonus per level
2. **Only add stat requirements if**:
   - The stat comes from a DIFFERENT path (cross-training)
   - OR the requirement is HIGH ENOUGH that leveling the prerequisite won't get you there
3. **It's OK to have jobs with ONLY stat requirements** (no job level requirements)
4. **Keep "threshold" requirements** (exactly at the job level bonus) to signal mastery of that specific job

