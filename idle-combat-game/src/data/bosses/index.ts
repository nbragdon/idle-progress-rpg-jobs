// Boss Data Export
// All bosses organized by tier

import { TrainingDummy } from "./training-dummy";
import { GoblinKing } from "./goblin-king";
import { AncientDragon } from "./ancient-dragon";
import type { BossDefinition } from "../../types/data";

export const ALL_BOSSES: Record<string, BossDefinition> = {
  // Tier 1 - Tutorial Boss
  TrainingDummy,

  // Tier 2 - Early Game Boss
  GoblinKing,

  // Tier 3 - Mid Game Boss
  AncientDragon,
};

