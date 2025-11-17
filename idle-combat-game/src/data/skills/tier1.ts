// Tier 1 Skills - Early to mid-game skills with moderate unlock requirements

import { 
  GiBrain,
  GiMuscleUp, 
  GiSwordBrandish, 
  GiNinjaArmor, 
} from "react-icons/gi";
import type { SkillDefinition } from "../../types/data";
import { TraitValue } from "../../types/data";

/**
 * TIER 1 SKILLS
 * - Moderate unlock requirements (20-50 job levels, basic stats)
 * - Multi-trait bonuses or specialized effects
 * - Early-mid game progression
 */

export const Dedication: SkillDefinition = {
  id: "Dedication",
  name: "Dedication",
  description: "Increases EXP gain for ALL skills by 40% per level.",
  icon: GiBrain,
  effects: [{ type: "skillExp", value: 0.40 }],
  unlockConditions: [{ type: "skillTotalLevels", value: 20 }],
};

export const CombatMastery: SkillDefinition = {
  id: "CombatMastery",
  name: "Combat Mastery",
  description: "Increases EXP gain for DPS and Aggressive jobs by 20% per level. For pure offensive builds.",
  icon: GiSwordBrandish,
  effects: [
    { type: "traitJobExp", trait: TraitValue.DPS, value: 0.20 },
    { type: "traitJobExp", trait: TraitValue.Aggressive, value: 0.20 },
  ],
  unlockConditions: [
    { type: "totalJobLevels", value: 50 },
    { type: "stat", stat: "STR", value: 40 },
  ],
};

export const FortifiedStudies: SkillDefinition = {
  id: "FortifiedStudies",
  name: "Fortified Studies",
  description: "Increases EXP gain for Tank and Support jobs by 20% per level. For defensive builds.",
  icon: GiMuscleUp,
  effects: [
    { type: "traitJobExp", trait: TraitValue.Tank, value: 0.20 },
    { type: "traitJobExp", trait: TraitValue.Support, value: 0.20 },
  ],
  unlockConditions: [
    { type: "totalJobLevels", value: 50 },
    { type: "stat", stat: "CON", value: 40 },
  ],
};

export const ShadowTechniques: SkillDefinition = {
  id: "ShadowTechniques",
  name: "Shadow Techniques",
  description: "Increases EXP gain for Stealth and Opportunist jobs by 20% per level. For cunning rogues.",
  icon: GiNinjaArmor,
  effects: [
    { type: "traitJobExp", trait: TraitValue.Stealth, value: 0.20 },
    { type: "traitJobExp", trait: TraitValue.Opportunist, value: 0.20 },
  ],
  unlockConditions: [
    { type: "totalJobLevels", value: 50 },
    { type: "stat", stat: "DEX", value: 40 },
  ],
};

