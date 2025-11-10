// Skills Data Registry
// Central export for all skill definitions

import { ArcaneStudies, PhysicalTraining, SwiftLearning, Dedication } from "./passive";
import { 
  CombatMastery, 
  FortifiedStudies, 
  ShadowTechniques, 
  StrategicMind, 
  VersatileWarrior,
  IntenseTraining,
  ScholarlyPursuit
} from "./advanced";
import type { SkillDefinition } from "../../types/data";

/**
 * All available skills in the game
 * 
 * To add new skills:
 * 1. Create a new file or add to existing category (passive.ts, advanced.ts, etc.)
 * 2. Define your skill following the SkillDefinition interface
 * 3. Export it here in ALL_SKILLS
 * 
 * Skill categories:
 * - Passive: Basic permanent bonuses (EXP gain for core traits)
 * - Advanced: Powerful bonuses with harder unlock requirements
 * - Active: Combat abilities (future)
 * - Crafting: Resource gathering/crafting bonuses (future)
 */
export const ALL_SKILLS: Record<string, SkillDefinition> = {
  // Basic Skills
  ArcaneStudies,
  PhysicalTraining,
  SwiftLearning,
  Dedication,
  
  // Advanced Skills
  CombatMastery,
  FortifiedStudies,
  ShadowTechniques,
  StrategicMind,
  VersatileWarrior,
  IntenseTraining,
  ScholarlyPursuit,
};


