// Skills Data Registry
// Central export for all skill definitions

import { ArcaneStudies, PhysicalTraining, SwiftLearning, Dedication } from "./passive";
import type { SkillDefinition } from "../../types/data";

/**
 * All available skills in the game
 * 
 * To add new skills:
 * 1. Create a new file or add to existing category (passive.ts, active.ts, etc.)
 * 2. Define your skill following the SkillDefinition interface
 * 3. Export it here in ALL_SKILLS
 * 
 * Skill categories:
 * - Passive: Permanent bonuses (EXP gain, stat increases)
 * - Active: Combat abilities (future)
 * - Crafting: Resource gathering/crafting bonuses (future)
 */
export const ALL_SKILLS: Record<string, SkillDefinition> = {
  ArcaneStudies,
  PhysicalTraining,
  SwiftLearning,
  Dedication,
  // Future skills will be added here
};


