// src/data/paths/index.ts

import type { PathDefinition } from "../../types/data";
import { PathIdValue, TraitValue } from "../../types/data";
import { GiBrain, GiSwordman, GiNinjaHeroicStance } from "react-icons/gi";

// Path of the Mage: 2x exp for magical jobs, 2x exp for skills (grows to 4x over 1 hour)
const PATH_MAGE: PathDefinition = {
  id: PathIdValue.Mage,
  name: "Path of the Mage",
  description: "Gain increased experience for magical trait jobs and skills. Bonuses grow over 1 hour.",
  icon: GiBrain,
  effects: [
    {
      type: "traitJobExp",
      trait: TraitValue.Magical,
      baseValue: 2.0, // Starts at 2x
      maxValue: 4.0,  // Grows to 4x after 1 hour
    },
    {
      type: "skillExp",
      baseValue: 2.0, // Starts at 2x
      maxValue: 4.0,  // Grows to 4x after 1 hour
    },
  ],
};

// Path of the Warrior: 2x exp for physical jobs, 1.5x exp for all jobs (grows to 4x and 3x over 1 hour)
const PATH_WARRIOR: PathDefinition = {
  id: PathIdValue.Warrior,
  name: "Path of the Warrior",
  description: "Gain increased experience for physical trait jobs and all jobs. Bonuses grow over 1 hour.",
  icon: GiSwordman,
  effects: [
    {
      type: "traitJobExp",
      trait: TraitValue.Physical,
      baseValue: 2.0, // Starts at 2x
      maxValue: 4.0,  // Grows to 4x after 1 hour
    },
    {
      type: "jobExp",
      baseValue: 1.5, // Starts at 1.5x
      maxValue: 3.0,  // Grows to 3x after 1 hour
    },
  ],
};

// Path of the Rogue: 2x exp for swift jobs, 3x exp for abilities (grows to 4x and 6x over 1 hour)
const PATH_ROGUE: PathDefinition = {
  id: PathIdValue.Rogue,
  name: "Path of the Rogue",
  description: "Gain increased experience for swift trait jobs and all abilities. Bonuses grow over 1 hour.",
  icon: GiNinjaHeroicStance,
  effects: [
    {
      type: "traitJobExp",
      trait: TraitValue.Swift,
      baseValue: 2.0, // Starts at 2x
      maxValue: 4.0,  // Grows to 4x after 1 hour
    },
    {
      type: "abilityExp",
      baseValue: 3.0, // Starts at 3x
      maxValue: 6.0,  // Grows to 6x after 1 hour
    },
  ],
};

// Export all paths
export const PATH_DATA: Record<string, PathDefinition> = {
  [PATH_MAGE.id]: PATH_MAGE,
  [PATH_WARRIOR.id]: PATH_WARRIOR,
  [PATH_ROGUE.id]: PATH_ROGUE,
};

