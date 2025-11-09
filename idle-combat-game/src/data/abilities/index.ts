// Abilities Data Registry
// Central export for all ability definitions

import { Smash, QuickStrike, ShieldBash } from "./physical";
import { Beam, Fireball } from "./magical";
import type { AbilityDefinition } from "../../types/data";

/**
 * All available abilities in the game
 * 
 * To add new abilities:
 * 1. Create a new file or add to existing category (physical.ts, magical.ts, etc.)
 * 2. Define your ability following the AbilityDefinition interface
 * 3. Export it here in ALL_ABILITIES
 * 
 * Ability categories:
 * - Physical: STR/DEX/AGI based attacks
 * - Magical: INT based spells
 * - Hybrid: Multi-stat abilities (future)
 * - Support: Buffs/heals (future)
 * - Ultimate: High-power, long cooldown abilities (future)
 */
export const ALL_ABILITIES: Record<string, AbilityDefinition> = {
  Smash,       // Starter physical ability
  Beam,        // Starter magical ability
  QuickStrike,
  ShieldBash,
  Fireball,
  // Future abilities will be added here
};


