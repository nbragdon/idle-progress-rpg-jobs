// Jobs Data Registry
// Central export for all job definitions across all tiers

import { BASIC_JOBS } from "./basic";
import { TIER1_JOBS } from "./tier1";
import { TIER2_JOBS } from "./tier2";
import type { JobDefinition } from "../../types/data";

/**
 * All available jobs in the game, organized by tier
 * 
 * To add new jobs:
 * 1. Create a new file in the appropriate tier folder (basic/, tier1/, tier2/, etc.)
 * 2. Define your job(s) following the JobDefinition interface
 * 3. Export them in the tier's index.ts
 * 4. Import the tier here and add to ALL_JOBS
 * 
 * Job tiers:
 * - Basic: Starting jobs, no unlock requirements
 * - Tier 1: Advanced specializations, require level/stat conditions
 * - Tier 2: Elite classes with significant unlock requirements
 * - Tier 3+: Future expansions
 */
export const ALL_JOBS: Record<string, JobDefinition> = {
  ...BASIC_JOBS,
  ...TIER1_JOBS,
  ...TIER2_JOBS,
  // Future tiers will be added here:
  // ...TIER3_JOBS,
};

// Export individual tiers for organizational purposes
export { BASIC_JOBS, TIER1_JOBS, TIER2_JOBS };

// Helper to get jobs by tier
export const getJobsByTier = () => ({
  basic: Object.values(BASIC_JOBS),
  tier1: Object.values(TIER1_JOBS),
  tier2: Object.values(TIER2_JOBS),
});


