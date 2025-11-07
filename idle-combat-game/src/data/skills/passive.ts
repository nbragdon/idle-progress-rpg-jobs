// Passive Skills - Provide permanent bonuses

import { GiSpellBook, GiSwordsPower, GiRunningNinja, GiBrain } from "react-icons/gi";
import type { SkillDefinition } from "../../types/data";
import { TraitValue } from "../../types/data";

export const ArcaneStudies: SkillDefinition = {
  id: "ArcaneStudies",
  name: "Arcane Studies",
  description: "Increases EXP gain for Magical jobs by 5% per level.",
  icon: GiSpellBook,
  effects: [{ type: "traitJobExp", trait: TraitValue.Magical, value: 0.05 }], // +5% per level
};

export const PhysicalTraining: SkillDefinition = {
  id: "PhysicalTraining",
  name: "Physical Training",
  description: "Increases EXP gain for Physical jobs by 5% per level.",
  icon: GiSwordsPower,
  effects: [{ type: "traitJobExp", trait: TraitValue.Physical, value: 0.05 }], // +5% per level
};

export const SwiftLearning: SkillDefinition = {
  id: "SwiftLearning",
  name: "Swift Learning",
  description: "Increases EXP gain for Swift jobs by 5% per level.",
  icon: GiRunningNinja,
  effects: [{ type: "traitJobExp", trait: TraitValue.Swift, value: 0.05 }], // +5% per level
};

export const Dedication: SkillDefinition = {
  id: "Dedication",
  name: "Dedication",
  description: "Increases EXP gain for ALL skills by 10% per level.",
  icon: GiBrain,
  effects: [{ type: "skillExp", value: 0.10 }], // +10% per level
  unlockConditions: [{ type: "skillTotalLevels", value: 20 }],
};


