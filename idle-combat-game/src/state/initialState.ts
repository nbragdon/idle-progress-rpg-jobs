// src/state/initialState.ts

import type {
  GameState,
  JobState,
  SkillState,
  AbilityState,
} from "../types/game";
import {
  JOB_DATA,
  SKILL_DATA,
  ABILITY_DATA,
  ASCENSION_UPGRADES,
} from "../core/data";
import {
  INITIAL_MAX_ACTIVE_JOBS,
  INITIAL_MAX_ACTIVE_SKILLS,
  INITIAL_MAX_ACTIVE_ABILITIES,
  INITIAL_ABILITY_LEVEL,
} from "../core/constants";

export const getInitialState = (): GameState => {
  const initialJobs = Object.keys(JOB_DATA).reduce<Record<string, JobState>>(
    (acc, id) => {
      acc[id] = {
        level: id === "Warrior" ? 1 : 0,
        exp: 0,
        isActive: id === "Warrior",
      };
      return acc;
    },
    {}
  );

  const initialSkills = Object.keys(SKILL_DATA).reduce<
    Record<string, SkillState>
  >((acc, id) => {
    acc[id] = { level: 0, exp: 0, isActive: id === "Focus" };
    return acc;
  }, {});
  const initialAbilities = Object.keys(ABILITY_DATA).reduce<
    Record<string, AbilityState>
  >((acc, id) => {
    const isInitialUnlock = ABILITY_DATA[id].unlockCondition.required === 0;
    acc[id] = {
      cooldown: 0,
      unlocked: isInitialUnlock,
      level: isInitialUnlock ? INITIAL_ABILITY_LEVEL : 0,
      exp: 0,
      isTraining: isInitialUnlock,
    };
    return acc;
  }, {});

  return {
    version: 5,
    lastSave: Date.now(),
    maxActiveJobs: INITIAL_MAX_ACTIVE_JOBS,
    maxActiveSkills: INITIAL_MAX_ACTIVE_SKILLS,
    maxActiveAbilities: INITIAL_MAX_ACTIVE_ABILITIES,
    ascensionPoints: 0,
    permanentUpgrades: ASCENSION_UPGRADES.reduce((acc, up) => {
      acc[up.id] = 0;
      return acc;
    }, {} as Record<AscensionUpgrade["id"], number>),
    jobs: initialJobs,
    skills: initialSkills,
    abilities: initialAbilities,
    currentBossId: "Boss1",
    bossProgress: {
      Boss1: { defeated: 0, lastBattleLog: [] },
    },
    activeTab: "Jobs",
  };
};
