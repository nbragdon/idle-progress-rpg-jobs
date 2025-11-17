# Job Unlock Requirements Cleanup

## Overview
This document summarizes the comprehensive review and cleanup of job unlock requirements across all Tier 1 and Tier 2 jobs. The goal was to remove redundant stat requirements that would be automatically met through the prerequisite job leveling chains.

## Philosophy
- **Remove Redundant Requirements**: If a stat requirement is automatically met by leveling the prerequisite jobs, it should be removed
- **Keep Meaningful Requirements**: Stat requirements that force cross-training or specialization should be kept
- **Job-Only Unlocks Are Fine**: Not all jobs need stat requirements; job level requirements alone can be sufficient

## Changes Made

### Tier 1 Jobs

#### Commander
**Before**: Warrior 12 + STR 36 + INT 30  
**After**: Warrior 12 + INT 30  
**Reason**: Warrior 12 automatically gives 36 STR (redundant). INT 30 requires Mage training (meaningful).

#### Warlock
**Before**: Mage 12 + INT 36 + FRT 30  
**After**: Mage 12 + FRT 30  
**Reason**: Mage 12 automatically gives 36 INT (redundant). FRT 30 requires Guardian training (meaningful).

#### Skirmisher
**Before**: Rogue 12 + DEX 24 + AGI 30  
**After**: Rogue 12 + AGI 30  
**Reason**: Rogue 12 automatically gives 24 DEX (redundant). AGI 30 requires Rogue 15 or cross-training (meaningful).

### Tier 2 Jobs - Warrior Path

#### Juggernaut
**Before**: Guardian 18 + Barbarian 18 + TGH 72  
**After**: Guardian 18 + Barbarian 18  
**Reason**: 
- Guardian 18 gives 72 TGH
- But Barbarian requires Warrior 14 (28 TGH)
- Total TGH = 100, making the 72 requirement redundant

#### Warlord
**Before**: Commander 24 + totalJobLevels 120 + STR 60  
**After**: Commander 24 + totalJobLevels 120  
**Reason**:
- Commander requires Warrior 12 (36 STR)
- Commander 24 gives 60 STR
- Total STR = 96, making the 60 requirement redundant

#### Berserker
**Requirements Unchanged**: Barbarian 24 + 12 boss defeats + CRIT_D 120  
**Reason**: Barbarian 24 only gives 48 CRIT_D total, so CRIT_D 120 is meaningful (requires additional training).

### Tier 2 Jobs - Mage Path

#### Archmage
**Before**: Wizard 30 + Sorcerer 18 + INT 200 + CONC 132  
**After**: Wizard 30 + Sorcerer 18  
**Reason**: These two jobs combined give 201 INT and 132 CONC, making both stat requirements redundant.

#### Elementalist
**Before**: Sorcerer 24 + Beam 36 + 6 boss defeats + INT 108  
**After**: Sorcerer 24 + Beam 36 + 6 boss defeats  
**Reason**: Sorcerer 24 (including Mage prerequisites) gives 108+ INT (redundant).

### Tier 2 Jobs - Rogue Path

#### Assassin
**Requirements Unchanged**: Shadow 24 + Smash 36 + DEX 84 + CRIT_C 240  
**Reason**: 
- Total DEX from prerequisites = 80, need 84 (meaningful)
- Total CRIT_C from prerequisites = 166, need 240 (meaningful)

#### Trickster
**Requirements Unchanged**: Thief 24 + Skirmisher 18 + totalSkillLevels 60  
**Reason**: No stat requirements to remove.

#### Duelist
**Before**: Skirmisher 24 + AGI 84 + DEX 72 + FRT 60  
**After**: Skirmisher 24 + FRT 60  
**Reason**:
- Total AGI from prerequisites = 114 (redundant)
- Total DEX from prerequisites = 90 (redundant)
- Total FRT from prerequisites = 48, need 60 (meaningful - requires cross-training)

### Tier 2 Jobs - Hybrid Classes

#### Spellblade
**Before**: Any warrior job 18 + Any mage job 18 + STR 60 + INT 60  
**After**: Any warrior job 18 + Any mage job 18 + STR 60  
**Reason**:
- Minimum mage path (Wizard 18) gives 102 INT total (redundant)
- Minimum warrior path (Guardian 18) only gives 30 STR, need 60 (meaningful)

#### BattlePriest
**Requirements Unchanged**: Guardian 24 + Wizard 18 + totalSkillLevels 90 + FRT 84  
**Reason**: Guardian 24 only gives 48 FRT, need 84 (meaningful - requires significant cross-training).

#### ShadowDancer
**Before**: Any rogue job 24 + Any mage job 18 + AGI 84 + INT 72  
**After**: Any rogue job 24 + Any mage job 18  
**Reason**:
- Minimum rogue path (Shadow 24) gives 116 AGI total (redundant)
- Minimum mage path (Wizard 18) gives 102 INT total (redundant)

### Tier 2 Jobs - Specialist Classes

#### GrandMaster
**Requirements Unchanged**: Guardian 24 + Barbarian 24 + Commander 24 + totalJobLevels 180 + anyStat 120  
**Reason**: No redundant stat requirements (uses "anyStat" which is flexible).

#### Sage
**Before**: Wizard 24 + Sorcerer 24 + Warlock 24 + 3 skills at 24 + INT 120  
**After**: Wizard 24 + Sorcerer 24 + Warlock 24 + 3 skills at 24  
**Reason**: Just Wizard 24 alone gives 126 INT, plus Sorcerer and Warlock push this to 330+ INT (massively redundant).

#### ApexPredator
**Before**: Shadow 24 + Thief 24 + Skirmisher 24 + GoblinKing defeat + AGI 96 + DEX 96 + CRIT_C 480  
**After**: Shadow 24 + Thief 24 + Skirmisher 24 + GoblinKing defeat + CRIT_C 480  
**Reason**:
- Total AGI from prerequisites = 220 (redundant)
- Total DEX from prerequisites = 268 (redundant)
- Total CRIT_C from prerequisites = 272, need 480 (meaningful - requires focused training)

## Summary Statistics

### Total Changes
- **Tier 1 Jobs**: 3 stat requirements removed (Commander, Warlock, Skirmisher)
- **Tier 2 Warrior Jobs**: 2 stat requirements removed (Juggernaut, Warlord)
- **Tier 2 Mage Jobs**: 3 stat requirements removed (Archmage, Elementalist)
- **Tier 2 Rogue Jobs**: 2 stat requirements removed (Duelist)
- **Tier 2 Hybrid Jobs**: 4 stat requirements removed (Spellblade, ShadowDancer)
- **Tier 2 Specialist Jobs**: 3 stat requirements removed (Sage, ApexPredator)

### Total: 17 redundant stat requirements removed

## Remaining Stat Requirements (All Meaningful)

### Requirements That Force Cross-Training
- **Commander**: INT 30 (Warriors need Mage training)
- **Warlock**: FRT 30 (Mages need Guardian training)
- **Skirmisher**: AGI 30 (Need extra Rogue levels or cross-training)
- **Duelist**: FRT 60 (Rogues need Guardian/Warlock training)
- **Spellblade**: STR 60 (Guardian path needs extra Warrior training)
- **BattlePriest**: FRT 84 (Requires significant cross-training beyond Guardian 24)

### Requirements That Encourage Specialization
- **Berserker**: CRIT_D 120 (Focus on crit damage beyond Barbarian leveling)
- **Assassin**: DEX 84, CRIT_C 240 (Extra precision and crit chance focus)
- **ApexPredator**: CRIT_C 480 (Massive crit chance specialization required)

## Design Principles Confirmed

1. ✅ **Job level requirements alone can be sufficient** - Many high-tier jobs now have only job/skill/boss requirements
2. ✅ **Stat requirements should be meaningful** - Remaining stat requirements all require intentional player decisions
3. ✅ **Cross-training is valuable** - Several hybrid jobs reward diversifying across job trees
4. ✅ **Specialization is valuable** - Some jobs reward focusing heavily on specific stats (crit builds, etc.)

## Future Job Design Guidelines

When adding new jobs, follow these principles:

1. **Calculate total stats from prerequisites** - Add up all stats gained from required job levels
2. **Only add stat requirements if they're meaningful** - Must require extra levels or cross-training
3. **Consider multiple unlock paths** - "anyJobFromList" requirements make stat calculations more complex
4. **Document your reasoning** - Include comments explaining which stats are meaningful and why
5. **Test the unlock chain** - Play through or simulate the unlock path to verify requirements make sense

