# Ascension Upgrades Implementation

## Overview
Added four new ascension upgrades that allow players to increase their training and battle capacity slots. All new upgrades are locked behind defeating the Training Dummy 3 times.

## New Ascension Upgrades

### 1. Battle Ability Slots
- **ID**: `maxBattleAbilities`
- **Cost**: 3 AP (flat cost per level)
- **Max Level**: 5
- **Effect**: +1 ability slot for battle per level
- **Unlock Requirement**: Defeat Training Dummy 3 times
- **Description**: "Increases the number of abilities you can use in battle by 1 per level."

### 2. Active Job Slots
- **ID**: `maxActiveJobs`
- **Cost**: 5 AP (flat cost per level)
- **Max Level**: 5
- **Effect**: +1 job training slot per level
- **Unlock Requirement**: Defeat Training Dummy 3 times
- **Description**: "Increases the number of jobs you can train simultaneously by 1 per level."

### 3. Active Skill Slots
- **ID**: `maxActiveSkills`
- **Cost**: 5 AP (flat cost per level)
- **Max Level**: 5
- **Effect**: +1 skill training slot per level
- **Unlock Requirement**: Defeat Training Dummy 3 times
- **Description**: "Increases the number of skills you can train simultaneously by 1 per level."

### 4. Training Ability Slots
- **ID**: `maxActiveAbilities`
- **Cost**: 5 AP (flat cost per level)
- **Max Level**: 5
- **Effect**: +1 ability training slot per level
- **Unlock Requirement**: Defeat Training Dummy 3 times
- **Description**: "Increases the number of abilities you can train simultaneously by 1 per level."

## Technical Changes

### Type System (`src/types/data.ts`)
- Added new `AscensionUpgradeId` enum values: `maxActiveSkills`, `maxActiveAbilities`, `maxBattleAbilities`
- Extended `AscensionUpgradeDefinition` interface with optional `unlockConditions` field supporting boss defeat requirements

### Data Layer (`src/core/data.ts`)
- Added all four new upgrades to `ASCENSION_UPGRADES` array
- Each upgrade includes unlock conditions checking for 3 Training Dummy defeats

### Game Calculations (`src/core/gameCalculations.ts`)
- Updated `getMaxActiveSkills()` to use new `maxActiveSkills` upgrade
- Updated `getMaxActiveAbilities()` to use new `maxActiveAbilities` upgrade
- Added new `getMaxBattleAbilities()` function for battle ability slots

### Utilities (`src/core/utils.ts`)
- Added `isAscensionUpgradeUnlocked()` function to check if an upgrade meets its unlock conditions
- Supports `bossDefeats` condition type

### Game Engine (`src/game/GameEngine.ts`)
- Updated `buyAscensionUpgrade()` method signature to use `AscensionUpgradeId` type

### Hooks
- **`useGame.ts`**: 
  - Added `maxBattleAbilities` to `maxLimits` object
  - Updated `toggleAbilityBattle()` to use separate battle ability limit
- **`useGameEngine.ts`**: Updated type signature for `buyAscensionUpgrade()`

### UI Components
- **`AscensionTab.tsx`**: 
  - Added lock icon and visual styling for locked upgrades
  - Displays unlock requirements with progress tracking
  - Shows "Defeat Training Dummy X/3 times" for locked upgrades
  - Locked upgrades have reduced opacity and cannot be purchased
- **`AbilitiesTab.tsx`**: 
  - Now displays separate limits for training and battle abilities
  - Format: "X / Y training • Z / W battle"

## Game Balance

### Initial State
- All slots start at 1 (unchanged)

### Maximum Capacity
- Jobs: 6 total (1 base + 5 from upgrades)
- Skills: 6 total (1 base + 5 from upgrades)
- Training Abilities: 6 total (1 base + 5 from upgrades)
- Battle Abilities: 6 total (1 base + 5 from upgrades)

### Upgrade Costs
- **Battle Abilities**: 3 AP × 5 levels = 15 AP total
- **Jobs**: 5 AP × 5 levels = 25 AP total
- **Skills**: 5 AP × 5 levels = 25 AP total
- **Training Abilities**: 5 AP × 5 levels = 25 AP total
- **Grand Total**: 90 AP to max all slot upgrades

## Unlock Progression
1. Player must defeat Training Dummy 3 times to see any slot upgrades
2. All four upgrades become visible and purchasable simultaneously
3. Creates a clear progression gate for mid-game players
4. Encourages players to engage with the combat system before expanding capacity

## Backward Compatibility
- Merge-based save system automatically handles new upgrades
- Existing saves will have all new upgrades at level 0
- No migration needed

