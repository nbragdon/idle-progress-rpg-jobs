// Basic Skills - Available from the start, provide foundational bonuses

import { GiSpellBook, GiSwordsPower, GiRunningNinja } from "react-icons/gi";
import type { SkillDefinition } from "../../types/data";
import { TraitValue } from "../../types/data";

/**
 * BASIC SKILLS
 * - No unlock requirements
 * - Core trait-based exp bonuses
 * - Foundation for character specialization
 */

export const ArcaneStudies: SkillDefinition = {
  id: "ArcaneStudies",
  name: "Arcane Studies",
  description: "Increases EXP gain for Magical jobs by 20% per level.",
  icon: GiSpellBook,
  effects: [{ type: "traitJobExp", trait: TraitValue.Magical, value: 0.20 }],
  // No unlock conditions - available from start
};

export const PhysicalTraining: SkillDefinition = {
  id: "PhysicalTraining",
  name: "Physical Training",
  description: "Increases EXP gain for Physical jobs by 20% per level.",
  icon: GiSwordsPower,
  effects: [{ type: "traitJobExp", trait: TraitValue.Physical, value: 0.20 }],
  // No unlock conditions - available from start
};

export const SwiftLearning: SkillDefinition = {
  id: "SwiftLearning",
  name: "Swift Learning",
  description: "Increases EXP gain for Swift jobs by 20% per level.",
  icon: GiRunningNinja,
  effects: [{ type: "traitJobExp", trait: TraitValue.Swift, value: 0.20 }],
  // No unlock conditions - available from start
};

