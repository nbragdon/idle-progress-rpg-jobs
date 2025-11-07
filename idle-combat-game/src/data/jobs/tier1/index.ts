// Tier 1 Jobs - Advanced Classes
// These jobs require specific conditions to unlock
// They provide higher stat bonuses than basic jobs

import { Guardian, Barbarian, Commander } from "./warrior-advanced";
import { Shadow, Thief, Skirmisher } from "./rogue-advanced";
import { Sorcerer, Wizard, Warlock } from "./mage-advanced";
import type { JobDefinition } from "../../../types/data";

export const TIER1_JOBS: Record<string, JobDefinition> = {
  Guardian,
  Barbarian,
  Commander,
  Shadow,
  Thief,
  Skirmisher,
  Sorcerer,
  Wizard,
  Warlock,
};


