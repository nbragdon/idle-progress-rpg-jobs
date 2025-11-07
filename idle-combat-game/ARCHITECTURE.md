# Architecture Documentation

## Overview

The codebase is now organized into clear layers separating game logic from presentation logic.

## Directory Structure

```
src/
├── game/                    # Pure game logic (framework-agnostic)
│   └── GameEngine.ts       # Core game state and rules
│
├── hooks/                   # React integration layer
│   ├── useGameEngine.ts    # React wrapper for GameEngine
│   ├── useGameUI.ts        # UI-specific state (tabs, alerts)
│   ├── useGame.ts          # Combined hook for components
│   ├── useGameState.ts     # (Legacy - can be deprecated)
│   └── useGameLogic.ts     # (Legacy - can be deprecated)
│
├── components/              # React components (presentation)
│   ├── App.tsx
│   ├── JobsTab.tsx
│   ├── StatsTab.tsx
│   └── ...
│
├── core/                    # Shared utilities and calculations
│   ├── data.ts             # Game data definitions
│   ├── utils.ts            # Pure utility functions
│   ├── constants.ts        # Game constants
│   └── gameCalculations.ts # Game calculation formulas
│
├── data/                    # Game content definitions
│   ├── jobs/
│   ├── abilities/
│   └── skills/
│
├── state/                   # State management utilities
│   ├── initialState.ts     # Initial game state
│   └── persistence.ts      # Save/load functionality
│
└── types/                   # TypeScript type definitions
    ├── game.ts
    └── data.ts
```

## Layer Descriptions

### 1. Game Logic Layer (`/game`)

**Pure TypeScript - No React Dependencies**

- `GameEngine.ts` - Core game engine
  - Manages game state
  - Implements game rules and mechanics
  - Provides state change notifications
  - Can be tested without React
  - Could be reused with other frameworks (Vue, Svelte, etc.)

**Key Responsibilities:**
- State management
- Game tick/update loop
- Job unlocking logic
- Stat calculations
- Toggle job/skill/ability states
- Ascension logic

### 2. React Integration Layer (`/hooks`)

**React Hooks - Bridge between game logic and UI**

- `useGameEngine.ts` - Wraps GameEngine for React
  - Subscribes to state changes
  - Auto-saves to localStorage
  - Runs game loop
  - Checks for job unlocks
  - Exposes engine methods as React callbacks

- `useGameUI.ts` - UI-specific state
  - Active tab management
  - Alert/notification system
  - Modal states (future)
  - Any other UI-only concerns

- `useGame.ts` - Main hook for components
  - Combines game logic and UI state
  - Calculates derived values (stats, levels)
  - Provides convenient API for components
  - Handles user feedback (alerts for failed actions)

### 3. Presentation Layer (`/components`)

**React Components - Pure UI**

- Receive props from hooks
- Render UI based on state
- Call callbacks for user actions
- Should contain minimal logic
- Focus on layout and styling

## Data Flow

```
User Interaction
      ↓
Component (e.g., JobsTab)
      ↓
useGame() hook
      ↓
GameEngine (pure logic)
      ↓
State Update
      ↓
Notify subscribers
      ↓
useGameEngine re-renders
      ↓
Component updates
```

## Benefits of This Architecture

### 1. **Separation of Concerns**
- Game logic is independent of React
- UI concerns are isolated
- Easy to reason about each layer

### 2. **Testability**
- GameEngine can be unit tested without React
- Pure functions are easy to test
- Mock UI layer for integration tests

### 3. **Maintainability**
- Changes to game rules don't affect React code
- UI changes don't affect game logic
- Clear boundaries between layers

### 4. **Reusability**
- GameEngine could work with Vue, Svelte, etc.
- Game logic could be extracted to a library
- Components can be easily refactored

### 5. **Performance**
- Game calculations run in pure JS
- React only updates when necessary
- Can optimize each layer independently

## Example Usage

### Adding a New Game Feature

1. **Add game logic to `GameEngine.ts`**
```typescript
class GameEngine {
  // Add new method
  craftItem(itemId: string): boolean {
    // Pure game logic here
    return true;
  }
}
```

2. **Expose in `useGameEngine.ts`**
```typescript
const craftItem = useCallback((itemId: string) => {
  return engine.craftItem(itemId);
}, [engine]);
```

3. **Use in `useGame.ts`** (with UI feedback)
```typescript
const craftItem = (itemId: string) => {
  const success = engineCraftItem(itemId);
  if (success) {
    showAlert("Item crafted!");
  } else {
    showAlert("Not enough materials!");
  }
};
```

4. **Call from component**
```typescript
const { craftItem } = useGame();

<button onClick={() => craftItem("sword")}>
  Craft Sword
</button>
```

## Migration Notes

The old `useGameState.ts` and `useGameLogic.ts` can be deprecated once all components are migrated to use `useGame()`.

## Future Improvements

- [ ] Add game events system (achievements, milestones)
- [ ] Implement undo/redo with command pattern
- [ ] Add multiplayer support (GameEngine could sync state)
- [ ] Create save state versioning/migration system
- [ ] Add replay/recording functionality
- [ ] Implement time travel debugging

