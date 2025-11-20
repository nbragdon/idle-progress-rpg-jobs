# Horde Feature Implementation Summary

## Overview
Successfully implemented the "Horde" feature - a new progression system that allows players to spend passively generated goblins on upgrades that multiply stat gains for jobs with specific traits.

## Feature Details

### Unlock Condition
- **Unlocked after defeating Goblin King 5+ times**
- Unlock status persists through ascension
- New "Horde" tab appears once unlocked

### Goblin Generation
- **1 goblin per second** (constant rate)
- Goblins accumulate automatically when Horde is unlocked
- Goblins reset on ascension

### Upgrade System

#### Available Upgrades (3 starter upgrades)
1. **Physical Dominance**
   - Affects: Physical trait jobs
   - Base Cost: 100 goblins
   - Bonus: +25% stat gain per level

2. **Arcane Mastery**
   - Affects: Magical trait jobs
   - Base Cost: 100 goblins
   - Bonus: +25% stat gain per level

3. **Swift Reflexes**
   - Affects: Swift trait jobs
   - Base Cost: 100 goblins
   - Bonus: +25% stat gain per level

#### Cost Scaling Formula
```
Cost = baseCost × (3 ^ totalLevels)
```

**Example Progression:**
- 1st upgrade (level 0→1): 100 goblins
- 2nd upgrade (level 1→2): 300 goblins
- 3rd upgrade (level 2→3): 900 goblins
- 4th upgrade (level 3→4): 2,700 goblins
- 5th upgrade (level 4→5): 8,100 goblins

This exponential scaling encourages **specialization** - players must choose which trait to focus on rather than upgrading all equally.

#### Stat Gain Multipliers
- **Level 0**: 1.0x (base stats)
- **Level 1**: 1.25x (+25%)
- **Level 2**: 1.5x (+50%)
- **Level 3**: 1.75x (+75%)
- **Level 4**: 2.0x (+100%)
- **Level 5**: 2.25x (+125%)

Multiple upgrades affecting the same job are **multiplicative**:
- If a job has both Physical and DPS traits
- Physical Dominance Level 2 (1.5x) × DPS Upgrade Level 1 (1.25x) = 1.875x total

### Stat Rounding
All stat gains are now rounded to **1 decimal place** to handle the fractional values from Horde multipliers.

### Ascension Behavior
On ascension:
- ✅ **Unlocked status persists** (stays unlocked)
- ❌ **Goblins reset to 0**
- ❌ **All upgrade levels reset to 0**
- ❌ **Total levels counter resets**

This creates a fresh start each ascension while maintaining access to the system.

## Implementation Details

### Files Created

1. **`src/types/game.ts`** (modified)
   - Added `HordeUpgrade` interface
   - Added `HordeState` interface
   - Added `hordeState` to `GameState`
   - Added "Horde" to `activeTab` union type

2. **`src/data/horde/index.ts`** (new)
   - Defined `HordeUpgradeDefinition` interface
   - Created `HORDE_UPGRADES` data with 3 starter upgrades
   - Exported `BASE_GOBLIN_GENERATION` constant
   - Exported `calculateUpgradeCost()` helper function

3. **`src/components/HordeTab.tsx`** (new)
   - Full UI for the Horde system
   - Displays goblin count and generation rate
   - Shows 3 upgrade cards with:
     - Current level
     - Current multiplier (e.g., 1.25x)
     - Next level multiplier (e.g., 1.50x)
     - Affected traits
     - Purchase button with cost
   - Unlock message when not yet unlocked
   - Cost scaling explanation box
   - Warning about ascension reset

### Files Modified

4. **`src/state/initialState.ts`**
   - Added `hordeState` initialization
   - Set default values: 0 goblins, 1 generation rate, all upgrades at level 0, unlocked: false

5. **`src/game/GameEngine.ts`**
   - Added goblin generation in `tick()` method
   - Added `purchaseHordeUpgrade(upgradeId)` method
   - Updated `ascend()` to reset Horde state (but keep unlocked status)
   - Updated `calculatePlayerStats()` to apply Horde multipliers to stat gains
   - Added Horde unlock logic in `endBattle()` after Goblin King defeat #5
   - Implemented stat rounding to 1 decimal place

6. **`src/hooks/useGameEngine.ts`**
   - Exposed `purchaseHordeUpgrade` method

7. **`src/hooks/useGame.ts`**
   - Added `isHordeVisible` check
   - Added Horde tab to tabs array
   - Created wrapper for `purchaseHordeUpgrade` with success/failure alerts
   - Exported all Horde-related values

8. **`src/hooks/useGameUI.ts`**
   - Added "Horde" to `TabId` type

9. **`src/components/App.tsx`**
   - Imported `HordeTab` component
   - Added `purchaseHordeUpgrade` to destructured values
   - Added Horde tab rendering in main content area

10. **`src/state/persistence.ts`**
    - Added `hordeState` loading logic with proper defaults
    - Ensures Horde state is saved and loaded correctly

## Gameplay Flow

### Unlocking
1. Player defeats Training Dummy (unlocks Boss battles)
2. Player defeats Goblin King 5 times
3. Horde system unlocks (permanent unlock)
4. "Horde" tab appears in navigation

### Using the System
1. Goblins generate passively (1/second)
2. Player chooses which trait to specialize in (Physical/Magical/Swift)
3. Purchase upgrades with goblins
4. Each purchase increases ALL future upgrade costs
5. Stat gains for matching jobs immediately increase
6. Can check stats tab to see the multiplied stat values

### Strategic Considerations
- **Early Game**: Focus on one trait to maximize impact
- **Mid Game**: Costs get very high, choose carefully
- **Late Game**: May afford a few levels in multiple traits
- **Ascension Trade-off**: Lose all progress but keep faster progression on next run

## Testing Checklist

✅ All TODO items completed:
- [x] Add Horde types and state interfaces
- [x] Create Horde data definitions  
- [x] Add Horde logic to GameEngine (generation, purchasing)
- [x] Update stat calculations to include Horde multipliers
- [x] Create HordeTab component
- [x] Integrate Horde tab into App and unlock logic
- [x] Update ascension to reset Horde state
- [x] Round all stat gains to 1 decimal place

✅ No linter errors

## Example Scenario

**Starting Fresh:**
- Defeat Goblin King 5 times → Horde unlocks
- After 100 seconds: 100 goblins generated
- Purchase Physical Dominance Level 1 (100 goblins)
- All Physical jobs now gain 1.25x stats per level
- Next upgrade costs 300 goblins (for any upgrade)
- After 300 more seconds: 300 goblins → Purchase Physical Dominance Level 2
- Physical jobs now gain 1.5x stats per level
- Next upgrade costs 900 goblins
- Continue specializing or branch out...
- Ascend → All Horde progress resets, but system stays unlocked

## Future Expansion Ideas

The system is designed to be easily expandable:
- Add more trait-specific upgrades (DPS, Tank, Support, etc.)
- Add multi-trait upgrades (affects 2-3 traits at once)
- Add global upgrades (affects all jobs)
- Increase goblin generation rate through upgrades
- Add "Horde Events" for bonus goblins
- Add alternative spending options for goblins

## Files Summary

**New Files:** 2
- `src/data/horde/index.ts`
- `src/components/HordeTab.tsx`

**Modified Files:** 10
- `src/types/game.ts`
- `src/state/initialState.ts`
- `src/game/GameEngine.ts`
- `src/hooks/useGameEngine.ts`
- `src/hooks/useGame.ts`
- `src/hooks/useGameUI.ts`
- `src/components/App.tsx`
- `src/state/persistence.ts`
- (Plus documentation file: `HORDE_FEATURE_SUMMARY.md`)

## Code Quality

- ✅ TypeScript type safety maintained throughout
- ✅ No linter errors or warnings
- ✅ Follows existing code patterns and conventions
- ✅ Proper separation of concerns (data, logic, UI)
- ✅ All state properly persisted and loaded
- ✅ UI consistent with existing game styling

