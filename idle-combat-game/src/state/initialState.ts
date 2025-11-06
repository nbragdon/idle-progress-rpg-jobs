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
  BOSS_DATA, // Added to find the correct initial boss ID
} from "../core/data";
import {
  INITIAL_ABILITY_LEVEL,
} from "../core/constants";
import type { AscensionUpgradeDefinition } from "../types/data";

// Dynamically determine the ID of the first boss
const FIRST_BOSS_ID = Object.keys(BOSS_DATA)[0];

export const getInitialState = (): GameState => {
  const now = Date.now();

  // --- Initialize Jobs ---
  const initialJobs = Object.keys(JOB_DATA).reduce<Record<string, JobState>>(
    (acc, id) => {
      acc[id] = {
        id: id, // FIX: Added missing 'id' field
        level: id === "Warrior" ? 1 : 0,
        exp: 0,
        isActive: id === "Warrior",
        lastActiveTime: now, // FIX: Added missing 'lastActiveTime' field
      };
      return acc;
    },
    {}
  );

  // --- Initialize Skills ---
  const initialSkills = Object.keys(SKILL_DATA).reduce<
    Record<string, SkillState>
  >((acc, id) => {
    acc[id] = {
      id: id, // FIX: Added missing 'id' field
      level: 0,
      exp: 0,
      isActive: id === "Focus"
    };
    return acc;
  }, {});

  // --- Initialize Abilities ---
  const initialAbilities = Object.keys(ABILITY_DATA).reduce<
    Record<string, AbilityState>
  >((acc, id) => {
    const isInitialUnlock = ABILITY_DATA[id].unlockCondition.required === 0;
    acc[id] = {
      id: id, // FIX: Added missing 'id' field
      // FIX: Removed 'cooldown' property as it is not part of AbilityState
      unlocked: isInitialUnlock,
      level: isInitialUnlock ? INITIAL_ABILITY_LEVEL : 0,
      exp: 0,
      isTraining: isInitialUnlock,
    };
    return acc;
  }, {});

  return {
    // FIX: Added missing required fields from GameState
    gold: 0,
    lastTickTime: now,

    // Core Progression
    jobs: initialJobs,
    skills: initialSkills,
    abilities: initialAbilities,

    // Currencies and Permanent Systems
    ascensionPoints: 0,
    permanentUpgrades: ASCENSION_UPGRADES.reduce((acc, up) => {
      acc[up.id] = 0;
      return acc;
    }, {} as Record<AscensionUpgradeDefinition["id"], number>), // FIX: Used correct type for permanentUpgrades accumulator

    // Boss Data
    currentBossId: FIRST_BOSS_ID, // FIX: Corrected to use "TrainingDummy"
    bossProgress: {
      [FIRST_BOSS_ID]: { defeated: 0, lastBattleLog: [] }, // FIX: Used correct ID
    },

    // UI State
    activeTab: "Jobs",

    // Removed extraneous properties: version, lastSave, maxActiveJobs, maxActiveSkills, maxActiveAbilities
  };
};

