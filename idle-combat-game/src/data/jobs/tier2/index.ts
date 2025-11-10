// Tier 2 Jobs - Elite Classes
// These jobs require significant progression and offer powerful stat bonuses

import { Juggernaut, Warlord, Berserker } from "./warrior-advanced";
import { Assassin, Trickster, Duelist } from "./rogue-advanced";
import { Archmage, Elementalist, Necromancer } from "./mage-advanced";
import { Spellblade, BattlePriest, ShadowDancer } from "./hybrid";
import { GrandMaster, Sage, ApexPredator } from "./specialist";
import type { JobDefinition } from "../../../types/data";

export const TIER2_JOBS: Record<string, JobDefinition> = {
  // Warrior Path
  Juggernaut,
  Warlord,
  Berserker,
  
  // Rogue Path
  Assassin,
  Trickster,
  Duelist,
  
  // Mage Path
  Archmage,
  Elementalist,
  Necromancer,
  
  // Hybrid Path
  Spellblade,
  BattlePriest,
  ShadowDancer,
  
  // Specialist Path
  GrandMaster,
  Sage,
  ApexPredator,
};

