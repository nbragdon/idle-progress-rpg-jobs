// Tier 2 Skills - Late game skills with significant unlock requirements

import { 
  GiChessKnight,
  GiSpellBook,
  GiSkills,
  GiTwoCoins
} from "react-icons/gi";
import type { SkillDefinition } from "../../types/data";
import { TraitValue } from "../../types/data";

/**
 * TIER 2 SKILLS
 * - Significant unlock requirements (75-100 job levels, high stats, boss defeats)
 * - Powerful multi-trait bonuses or universal effects
 * - Late game progression and specialization
 */

export const StrategicMind: SkillDefinition = {
  id: "StrategicMind",
  name: "Strategic Mind",
  description: "Increases EXP gain for Tactical, Support, and Skirmish jobs by 17% per level. For strategic commanders.",
  icon: GiChessKnight,
  effects: [
    { type: "traitJobExp", trait: TraitValue.Tactical, value: 0.17 },
    { type: "traitJobExp", trait: TraitValue.Support, value: 0.17 },
    { type: "traitJobExp", trait: TraitValue.Skirmish, value: 0.17 },
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
  description: "Increases EXP gain for DPS, Tank, and Aggressive jobs by 20% per level. For balanced fighters.",
  icon: GiTwoCoins,
  effects: [
    { type: "traitJobExp", trait: TraitValue.DPS, value: 0.20 },
    { type: "traitJobExp", trait: TraitValue.Tank, value: 0.20 },
    { type: "traitJobExp", trait: TraitValue.Aggressive, value: 0.20 },
  ],
  unlockConditions: [
    { type: "totalJobLevels", value: 100 },
    { type: "anyJobFromList", jobIds: ["Guardian", "Barbarian", "Commander"], level: 15 },
  ],
};

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

