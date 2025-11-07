# Jobs Data Structure

This directory contains all job definitions organized by tier and category.

## Directory Structure

```
jobs/
├── basic/              # Tier 0 - Starting jobs (no unlock requirements)
│   ├── physical.ts     # Physical combat jobs (Warrior, Rogue)
│   ├── magical.ts      # Magical combat jobs (Mage)
│   └── index.ts        # Exports BASIC_JOBS
├── tier1/              # Tier 1 - Advanced specializations
│   ├── warrior-advanced.ts  # Warrior progression (Guardian, Barbarian, Commander)
│   └── index.ts        # Exports TIER1_JOBS
├── tier2/              # Tier 2 - Master classes (future)
├── tier3/              # Tier 3 - Legendary classes (future)
└── index.ts            # Main export - combines all tiers into ALL_JOBS
```

## Adding New Jobs

### 1. Choose the Appropriate Tier

- **Basic (Tier 0)**: Starting jobs with no unlock requirements
- **Tier 1**: Advanced jobs requiring level 5-15 or 10-30 in a stat
- **Tier 2**: Master jobs requiring level 20-30 or 40-60 in a stat
- **Tier 3+**: Legendary/Mythic jobs with complex requirements

### 2. Create or Update a Job File

Create a new file or add to an existing one in the appropriate tier folder:

```typescript
// Example: src/data/jobs/tier1/mage-advanced.ts

import { GiFireball, GiIceCube } from "react-icons/gi";
import type { JobDefinition } from "../../../types/data";

export const Pyromancer: JobDefinition = {
  id: "Pyromancer",
  name: "Pyromancer",
  description: "Master of fire magic. Burns enemies with intense flames.",
  icon: GiFireball,
  statBonuses: [
    { stat: "INT", value: 3.5 },
    { stat: "CONC", value: 2.0 },
    { stat: "FRT", value: 1.0 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Mage", level: 10 },
    { type: "stat", stat: "INT", value: 25 },
  ],
};

export const Cryomancer: JobDefinition = {
  id: "Cryomancer",
  name: "Cryomancer",
  description: "Master of ice magic. Freezes enemies in their tracks.",
  icon: GiIceCube,
  statBonuses: [
    { stat: "INT", value: 3.0 },
    { stat: "CONC", value: 2.5 },
    { stat: "RES", value: 1.5 },
  ],
  unlockConditions: [
    { type: "jobLevel", jobId: "Mage", level: 10 },
    { type: "stat", stat: "CONC", value: 20 },
  ],
};
```

### 3. Export from Tier Index

Update the tier's `index.ts` file:

```typescript
// src/data/jobs/tier1/index.ts

import { Guardian, Barbarian, Commander } from "./warrior-advanced";
import { Pyromancer, Cryomancer } from "./mage-advanced"; // NEW
import type { JobDefinition } from "../../../types/data";

export const TIER1_JOBS: Record<string, JobDefinition> = {
  Guardian,
  Barbarian,
  Commander,
  Pyromancer,  // NEW
  Cryomancer,  // NEW
};
```

### 4. Update Main Jobs Index (if adding a new tier)

If you're adding a completely new tier (e.g., tier2), update `src/data/jobs/index.ts`:

```typescript
import { BASIC_JOBS } from "./basic";
import { TIER1_JOBS } from "./tier1";
import { TIER2_JOBS } from "./tier2"; // NEW

export const ALL_JOBS: Record<string, JobDefinition> = {
  ...BASIC_JOBS,
  ...TIER1_JOBS,
  ...TIER2_JOBS, // NEW
};

export { BASIC_JOBS, TIER1_JOBS, TIER2_JOBS }; // NEW

export const getJobsByTier = () => ({
  basic: Object.values(BASIC_JOBS),
  tier1: Object.values(TIER1_JOBS),
  tier2: Object.values(TIER2_JOBS), // NEW
});
```

## Job Definition Guidelines

### Stat Bonuses by Tier

- **Basic (Tier 0)**: 1.0 - 2.0 per level
- **Tier 1**: 1.5 - 3.5 per level
- **Tier 2**: 2.5 - 5.0 per level
- **Tier 3+**: 4.0+ per level

### Unlock Conditions

Jobs can have multiple unlock conditions (all must be met):

```typescript
unlockConditions: [
  // Require a specific job level
  { type: "jobLevel", jobId: "Warrior", level: 10 },
  
  // Require a stat threshold
  { type: "stat", stat: "STR", value: 20 },
  
  // Can combine multiple conditions
  { type: "jobLevel", jobId: "Mage", level: 5 },
  { type: "stat", stat: "INT", value: 15 },
]
```

### Naming Conventions

- **File names**: Use kebab-case (e.g., `warrior-advanced.ts`, `mage-advanced.ts`)
- **Job IDs**: Use PascalCase matching the export name (e.g., `Pyromancer`)
- **Exports**: Use PascalCase for individual jobs, SCREAMING_SNAKE_CASE for tier collections

### Thematic Organization

Group related jobs in the same file:
- `physical.ts` - Physical melee/ranged jobs
- `magical.ts` - Magical caster jobs
- `warrior-advanced.ts` - Warrior specializations
- `mage-advanced.ts` - Mage specializations
- `hybrid.ts` - Multi-stat hybrid jobs
- `support.ts` - Buff/healing focused jobs

## Icon Resources

- **react-icons/gi**: Game Icons (best for fantasy RPG)
- **react-icons/fa**: Font Awesome (general purpose)
- **react-icons/fa6**: Font Awesome 6 (modern icons)

Browse icons at: https://react-icons.github.io/react-icons/

## Testing New Jobs

After adding jobs:

1. Check for TypeScript errors: The linter will catch any issues
2. Verify imports: Make sure all icon imports are correct
3. Test unlock conditions: Ensure jobs appear when conditions are met
4. Balance check: Compare stat bonuses with other jobs in the same tier
5. Visual check: Confirm icons display correctly in the UI

## Future Enhancements

Potential additions to the job system:
- Job prerequisites (e.g., "Must have Guardian AND Mage at level 10")
- Mutually exclusive jobs (e.g., can't have both Paladin and Death Knight)
- Job-specific abilities that unlock at certain levels
- Job evolution/promotion systems
- Prestige/mastery bonuses for maxing jobs


