// Basic Jobs - Tier 0
// These jobs are available from the start and have no unlock requirements

import { Warrior, Rogue } from "./physical";
import { Mage } from "./magical";
import type { JobDefinition } from "../../../types/data";

export const BASIC_JOBS: Record<string, JobDefinition> = {
  Warrior,
  Mage,
  Rogue,
};


