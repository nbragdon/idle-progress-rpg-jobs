// Horde System Data
// Defines upgrades that can be purchased with goblins

import type { TraitType } from "../../types/data";
import { TraitValue } from "../../types/data";
import { GiSwordsPower, GiSpellBook, GiRunningNinja } from "react-icons/gi";
import type { IconType } from "react-icons";

export interface HordeUpgradeDefinition {
  id: string;
  name: string;
  description: string;
  icon: IconType;
  traits: TraitType[]; // Jobs with these traits get the stat multiplier
  baseCost: number; // Base cost in goblins (multiplied by 3^totalLevels)
  statMultiplierPerLevel: number; // Multiplier added per level (e.g., 0.25 = 25% per level)
}

export const HORDE_UPGRADES: Record<string, HordeUpgradeDefinition> = {
  Physical: {
    id: "Physical",
    name: "Physical Dominance",
    description: "Increases stat gains for Physical jobs by 25% per level",
    icon: GiSwordsPower,
    traits: [TraitValue.Physical],
    baseCost: 100,
    statMultiplierPerLevel: 0.25,
  },
  Magical: {
    id: "Magical",
    name: "Arcane Mastery",
    description: "Increases stat gains for Magical jobs by 25% per level",
    icon: GiSpellBook,
    traits: [TraitValue.Magical],
    baseCost: 100,
    statMultiplierPerLevel: 0.25,
  },
  Swift: {
    id: "Swift",
    name: "Swift Reflexes",
    description: "Increases stat gains for Swift jobs by 25% per level",
    icon: GiRunningNinja,
    traits: [TraitValue.Swift],
    baseCost: 100,
    statMultiplierPerLevel: 0.25,
  },
};

// Goblin generation rate scales with total job levels
// Formula: Math.max(1, 1 + (totalJobLevels / 100))
// - Base minimum: 1 goblin/second
// - At 100 levels: 2 goblins/second
// - At 200 levels: 3 goblins/second
// - At 350 levels: 4.5 goblins/second
export const BASE_GOBLIN_GENERATION = 1; // Minimum goblin generation rate

// Cost formula: baseCost * (3 ^ totalLevels)
export function calculateUpgradeCost(baseCost: number, totalLevels: number): number {
  return Math.ceil(baseCost * Math.pow(3, totalLevels));
}

