// Skills Data Registry
// Central export for all skill definitions organized by tier

import { ArcaneStudies, PhysicalTraining, SwiftLearning } from "./basic";
import { 
  Dedication,
  CombatMastery, 
  FortifiedStudies, 
  ShadowTechniques,
} from "./tier1";
import { 
  StrategicMind, 
  VersatileWarrior,
  IntenseTraining,
  ScholarlyPursuit
} from "./tier2";
import type { SkillDefinition } from "../../types/data";

/**
 * All available skills in the game - organized by unlock difficulty
 * 
 * To add new skills:
 * 1. Determine tier based on unlock requirements:
 *    - Basic: No unlock requirements (starter skills)
 *    - Tier 1: 20-50 total levels, basic stats (early-mid game)
 *    - Tier 2: 75-100+ levels, high stats, boss defeats (late game)
 * 2. Add to appropriate tier file (basic.ts, tier1.ts, tier2.ts)
 * 3. Import and export it here in ALL_SKILLS
 * 
 * Skill Progression:
 * - Basic: Foundation trait bonuses (Physical, Magical, Swift)
 * - Tier 1: Multi-trait specializations (Combat, Defense, Stealth)
 * - Tier 2: Universal bonuses and advanced specializations
 */
export const ALL_SKILLS: Record<string, SkillDefinition> = {
  // ===== BASIC SKILLS (No Unlocks) =====
  ArcaneStudies,
  PhysicalTraining,
  SwiftLearning,
  
  // ===== TIER 1 SKILLS (Early-Mid Game) =====
  Dedication,
  CombatMastery,
  FortifiedStudies,
  ShadowTechniques,
  
  // ===== TIER 2 SKILLS (Late Game) =====
  StrategicMind,
  VersatileWarrior,
  IntenseTraining,
  ScholarlyPursuit,
};


