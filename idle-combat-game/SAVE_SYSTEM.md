# Save System

## Philosophy

**Simple merge-based approach**: Game data definitions are the source of truth. Player saves only store progress, which is overlaid on top of current game data when loaded.

## How It Works

### Loading a Save

```
Saved Progress + Current Game Data = Loaded State
```

1. Load player progress from localStorage
2. Start with fresh initial state (based on current game data)
3. Overlay player progress on top
4. Result: Player keeps their progress, automatically gets new content

### What This Handles Automatically

✅ **Adding new content**
- New jobs/skills/abilities appear automatically
- Players don't need to do anything

✅ **Removing content**
- Deleted jobs/skills/abilities are ignored
- Player progress for deleted items is simply not loaded
- Deprecated top-level fields are automatically dropped

✅ **Adding new fields**
- Uses `??` operator to provide defaults
- Example: `lastActiveTime: savedSkill.lastActiveTime ?? 0`
- TypeScript ensures you don't forget to handle new fields

✅ **Renaming content**
- Old ID is ignored, new ID gets default state
- Player loses progress on that specific item (acceptable tradeoff)

### What Gets Saved

**Progress Data** (varies per player):
- Job/Skill/Ability exp and levels
- Which jobs/skills/abilities are active
- Boss defeats and progress
- Ascension points and upgrades
- Gold, timestamps, etc.

**NOT Saved**:
- Active battle state (always null on load)
- Game data definitions (comes from code)

## For Developers

### Adding New Content

Just add to the data files - no migration needed!

```typescript
// src/data/abilities/physical.ts
export const NewAbility: AbilityDefinition = {
  // ... definition
};

// src/data/abilities/index.ts
export const ALL_ABILITIES = {
  // ... existing abilities
  NewAbility, // Just add it!
};
```

Next time a player loads their save, the new ability will be there with default state.

### Removing Content

Just remove from data files - no migration needed!

Old saves won't break, they'll just skip the removed item.

### Adding New Fields to State

Use the `??` operator for backwards compatibility:

```typescript
mergedSkills[id] = {
  ...savedSkill,
  newField: savedSkill.newField ?? defaultValue,
};
```

### Changing Data Structure

If you need to restructure (e.g., change a field type), you have two options:

1. **Accept data loss** - Just change it, old saves lose that specific data
2. **Handle gracefully** - Add conversion logic in persistence.ts

```typescript
// Example: Converting array to object
const converted = Array.isArray(oldData) 
  ? arrayToObject(oldData) 
  : oldData;
```

## Testing

### Test with Old Save

1. Play the game, make progress
2. Copy save from localStorage
3. Make your changes to game data
4. Paste save back, reload
5. Verify player keeps valid progress

### Test Fresh Start

1. Clear localStorage
2. Start new game
3. Verify everything initializes correctly

## Edge Cases Handled

- **Invalid JSON**: Returns fresh state
- **Corrupted save**: Returns fresh state  
- **Missing fields**: Uses defaults with `??`
- **Extra fields**: Ignored (harmless)
- **Deleted items**: Skipped during merge

## Why This Approach?

**Pros:**
- ✅ Simple - no version tracking or migration code
- ✅ Automatic - handles most changes without intervention
- ✅ Resilient - gracefully handles corrupt/incomplete saves
- ✅ Maintainable - less code to maintain over time

**Cons:**
- ❌ Can't do complex transformations
- ❌ May lose progress if you rename things
- ❌ No explicit "upgrade path" tracking

**Perfect for:** Incremental games where game data is the source of truth and occasional progress loss on major refactors is acceptable.

## Emergency Reset

Players can reset via browser console:

```javascript
localStorage.clear();
location.reload();
```

Consider adding a "Reset Save" button in Settings for convenience.

