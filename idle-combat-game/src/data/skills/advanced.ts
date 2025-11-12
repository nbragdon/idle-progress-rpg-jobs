// Advanced Skills - Provide powerful bonuses with significant unlock requirements

import { 
  GiMuscleUp, 
  GiSwordBrandish, 
  GiNinjaArmor, 
  GiChessKnight,
  GiSpellBook,
  GiSkills,
  GiTwoCoins
} from "react-icons/gi";
import type { SkillDefinition } from "../../types/data";
import { TraitValue } from "../../types/data";

// Multi-Trait Job EXP Bonuses

export const CombatMastery: SkillDefinition = {
  id: "CombatMastery",
  name: "Combat Mastery",
  description: "Increases EXP gain for DPS and Aggressive jobs by 15% per level. For pure offensive builds.",
  icon: GiSwordBrandish,
  effects: [
    { type: "traitJobExp", trait: TraitValue.DPS, value: 0.15 },
    { type: "traitJobExp", trait: TraitValue.Aggressive, value: 0.15 },
  ],
  unlockConditions: [
    { type: "totalJobLevels", value: 50 },
    { type: "stat", stat: "STR", value: 40 },
  ],
};

export const FortifiedStudies: SkillDefinition = {
  id: "FortifiedStudies",
  name: "Fortified Studies",
  description: "Increases EXP gain for Tank and Support jobs by 15% per level. For defensive builds.",
  icon: GiMuscleUp,
  effects: [
    { type: "traitJobExp", trait: TraitValue.Tank, value: 0.15 },
    { type: "traitJobExp", trait: TraitValue.Support, value: 0.15 },
  ],
  unlockConditions: [
    { type: "totalJobLevels", value: 50 },
    { type: "stat", stat: "CON", value: 40 },
  ],
};

export const ShadowTechniques: SkillDefinition = {
  id: "ShadowTechniques",
  name: "Shadow Techniques",
  description: "Increases EXP gain for Stealth and Opportunist jobs by 15% per level. For cunning rogues.",
  icon: GiNinjaArmor,
  effects: [
    { type: "traitJobExp", trait: TraitValue.Stealth, value: 0.15 },
    { type: "traitJobExp", trait: TraitValue.Opportunist, value: 0.15 },
  ],
  unlockConditions: [
    { type: "totalJobLevels", value: 50 },
    { type: "stat", stat: "DEX", value: 40 },
  ],
};

export const StrategicMind: SkillDefinition = {
  id: "StrategicMind",
  name: "Strategic Mind",
  description: "Increases EXP gain for Tactical, Support, and Skirmish jobs by 12% per level. For strategic commanders.",
  icon: GiChessKnight,
  effects: [
    { type: "traitJobExp", trait: TraitValue.Tactical, value: 0.12 },
    { type: "traitJobExp", trait: TraitValue.Support, value: 0.12 },
    { type: "traitJobExp", trait: TraitValue.Skirmish, value: 0.12 },
  ],
  unlockConditions: [
    { type: "totalJobLevels", value: 75 },
    { type: "totalSkillLevels", value: 40 },
    { type: "stat", stat: "INT", value: 50 },
  ],
};

export const VersatileWarrior: SkillDefinition = {
  id: "VersatileWarrior",
  name: "Versatile Warrior",
  description: "Increases EXP gain for DPS, Tank, and Aggressive jobs by 10% per level. For balanced fighters.",
  icon: GiTwoCoins,
  effects: [
    { type: "traitJobExp", trait: TraitValue.DPS, value: 0.10 },
    { type: "traitJobExp", trait: TraitValue.Tank, value: 0.10 },
    { type: "traitJobExp", trait: TraitValue.Aggressive, value: 0.10 },
  ],
  unlockConditions: [
    { type: "totalJobLevels", value: 100 },
    { type: "anyJobFromList", jobIds: ["Guardian", "Barbarian", "Commander"], level: 15 },
  ],
};

// Ability and Skill EXP Bonuses

export const IntenseTraining: SkillDefinition = {
  id: "IntenseTraining",
  name: "Intense Training",
  description: "Increases EXP gain for ALL abilities by 30% per level. Master your combat techniques.",
  icon: GiSkills,
  effects: [
    { type: "abilityExp", value: 0.30 },
  ],
  unlockConditions: [
    { type: "totalSkillLevels", value: 60 },
    { type: "anyAbilityLevel", level: 20 },
  ],
};

export const ScholarlyPursuit: SkillDefinition = {
  id: "ScholarlyPursuit",
  name: "Scholarly Pursuit",
  description: "Increases EXP gain for ALL skills by 25% per level. Knowledge begets knowledge.",
  icon: GiSpellBook,
  effects: [
    { type: "skillExp", value: 0.25 },
  ],
  unlockConditions: [
    { type: "totalSkillLevels", value: 80 },
    { type: "skillLevel", skillId: "Dedication", level: 10 },
    { type: "bossDefeats", bossId: "TrainingDummy", count: 3 },
  ],
};

