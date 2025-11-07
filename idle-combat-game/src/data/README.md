# Game Data Organization

This directory contains all game content data organized by type. The structure is designed to be modular, scalable, and easy to maintain.

## Directory Structure

```
data/
├── jobs/           # Job definitions organized by tier
│   ├── basic/      # Tier 0 starting jobs
│   ├── tier1/      # Advanced specializations
│   ├── tier2/      # Master classes (future)
│   └── index.ts    # Main export combining all tiers
├── skills/         # Skill definitions by category
│   ├── passive.ts  # Passive bonus skills
│   └── index.ts    # Main export
├── abilities/      # Combat ability definitions
│   ├── physical.ts # Physical attacks
│   ├── magical.ts  # Magical spells
│   └── index.ts    # Main export
└── README.md       # This file
```

## Design Principles

### 1. Separation of Concerns
Each game system (jobs, skills, abilities) has its own directory with logical subdivisions.

### 2. Single Source of Truth
All game data is defined once in these files and imported where needed. No duplicate definitions.

### 3. Scalability
The structure supports unlimited growth:
- Add new job tiers (tier2, tier3, etc.)
- Add new skill categories (active, crafting, etc.)
- Add new ability types (hybrid, support, ultimate, etc.)

### 4. Type Safety
All definitions follow strict TypeScript interfaces, ensuring consistency and catching errors at compile time.

### 5. Easy Discovery
Related content is grouped together, making it easy to find and modify similar items.

## How It Works

### Data Flow

```
Individual Files (e.g., jobs/basic/physical.ts)
    ↓
Category Index (e.g., jobs/basic/index.ts)
    ↓
Main Index (e.g., jobs/index.ts)
    ↓
Core Data Registry (src/core/data.ts)
    ↓
Game Components
```

### Example: Adding a New Job

1. **Create/Edit a job file** in the appropriate tier:
   ```typescript
   // src/data/jobs/tier1/mage-advanced.ts
   export const Pyromancer: JobDefinition = {
     id: "Pyromancer",
     name: "Pyromancer",
     // ... rest of definition
   };
   ```

2. **Export from tier index**:
   ```typescript
   // src/data/jobs/tier1/index.ts
   import { Pyromancer } from "./mage-advanced";
   
   export const TIER1_JOBS: Record<string, JobDefinition> = {
     // ... existing jobs
     Pyromancer,
   };
   ```

3. **That's it!** The main index automatically includes it via the spread operator.

## File Organization Guidelines

### Jobs (`jobs/`)
- **basic/**: Starting jobs, no unlock requirements
  - `physical.ts`: Melee/physical jobs (Warrior, Rogue)
  - `magical.ts`: Caster jobs (Mage)
- **tier1/**: Advanced jobs with unlock requirements
  - `warrior-advanced.ts`: Warrior specializations
  - `mage-advanced.ts`: Mage specializations (future)
  - `rogue-advanced.ts`: Rogue specializations (future)
- **tier2/**: Master classes (future)
  - Group by theme or progression path

### Skills (`skills/`)
- `passive.ts`: Permanent bonuses (EXP, stats)
- `active.ts`: Active combat skills (future)
- `crafting.ts`: Resource/crafting bonuses (future)
- `social.ts`: Multiplayer/guild bonuses (future)

### Abilities (`abilities/`)
- `physical.ts`: STR/DEX/AGI based attacks
- `magical.ts`: INT based spells
- `hybrid.ts`: Multi-stat abilities (future)
- `support.ts`: Buffs/heals (future)
- `ultimate.ts`: High-power abilities (future)

## Benefits of This Structure

### For Developers
- **Easy to find**: Related content is grouped logically
- **Easy to add**: Clear patterns to follow
- **Easy to modify**: Changes are localized to specific files
- **Easy to test**: Individual files can be tested in isolation

### For Game Balance
- **Compare similar items**: All tier 1 warrior jobs are in one file
- **Adjust tiers**: Easy to see power progression across tiers
- **Identify gaps**: Missing content is obvious from folder structure

### For Performance
- **Tree shaking**: Unused content can be eliminated by bundler
- **Code splitting**: Future optimization can load tiers on demand
- **Fast compilation**: TypeScript only recompiles changed files

## Future Enhancements

Potential additions to the data structure:

### Content Types
- **Bosses**: Move boss data to `data/bosses/` with tiers
- **Items**: Add `data/items/` for equipment/consumables
- **Quests**: Add `data/quests/` for quest chains
- **Zones**: Add `data/zones/` for areas/dungeons

### Organization Features
- **Tags/Categories**: Add metadata for filtering/searching
- **Dependencies**: Track which content requires other content
- **Variants**: Support multiple versions of the same content
- **Localization**: Add translation support

### Developer Tools
- **Validation**: Scripts to verify data consistency
- **Generation**: Templates for creating new content
- **Documentation**: Auto-generate docs from data
- **Balance Tools**: Scripts to analyze stat distributions

## Migration Notes

This structure was created to replace the monolithic `src/core/data.ts` file. The old file now serves as a thin wrapper that re-exports data from the organized structure.

**Before:**
```typescript
// Everything in one 400+ line file
export const JOB_DATA = { /* 50+ jobs */ };
export const SKILL_DATA = { /* 30+ skills */ };
export const ABILITY_DATA = { /* 40+ abilities */ };
```

**After:**
```typescript
// Clean imports from organized structure
import { ALL_JOBS } from "../data/jobs";
import { ALL_SKILLS } from "../data/skills";
import { ALL_ABILITIES } from "../data/abilities";

export const JOB_DATA = ALL_JOBS;
export const SKILL_DATA = ALL_SKILLS;
export const ABILITY_DATA = ALL_ABILITIES;
```

This maintains backward compatibility while providing a much better development experience.


