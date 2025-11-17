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
import type { AscensionUpgradeDefinition } from "../types/data";

// Dynamically determine the ID of the first boss
const FIRST_BOSS_ID = Object.keys(BOSS_DATA)[0];

export const getInitialState = (): GameState => {
  const now = Date.now();

  // --- Initialize Jobs ---
  // Only initialize basic jobs (jobs without unlock conditions)
  const initialJobs: Record<string, JobState> = {};
  
  Object.entries(JOB_DATA).forEach(([id, jobDef]) => {
    // Only add jobs that have no unlock conditions (basic jobs)
    if (!jobDef.unlockConditions || jobDef.unlockConditions.length === 0) {
      initialJobs[id] = {
        id: id,
        exp: 0, // All jobs start at level 0
        isActive: id === "Warrior",
        lastActiveTime: now,
      };
    }
  });

  // --- Initialize Skills ---
  // Only initialize skills without unlock conditions
  const initialSkills: Record<string, SkillState> = {};
  Object.entries(SKILL_DATA).forEach(([id, skillDef]) => {
    if (!skillDef.unlockConditions || skillDef.unlockConditions.length === 0) {
      initialSkills[id] = {
        id: id,
        exp: 0, // Skills start at level 0
        isActive: id === "PhysicalTraining", // Physical Training starts active
        lastActiveTime: id === "PhysicalTraining" ? now : 0
      };
    }
  });

  // --- Initialize Abilities ---
  const initialAbilities = Object.keys(ABILITY_DATA).reduce<
    Record<string, AbilityState>
  >((acc, id) => {
    const abilityDef = ABILITY_DATA[id];
    // Only unlock if legacy condition is met AND there are no new unlock conditions
    // This prevents abilities with job/skill level requirements from being auto-unlocked
    const isInitialUnlock = abilityDef.unlockCondition.required === 0 && 
                            (!abilityDef.unlockConditions || abilityDef.unlockConditions.length === 0);
    acc[id] = {
      id: id,
      unlocked: isInitialUnlock,
      exp: 0, // All abilities start at level 0
      isTraining: id === "Smash", // Only Smash starts training (matches starter Warrior job)
      isActiveBattle: false, // Player must manually select abilities for battle
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
    potentialAscensionPoints: 0,
    permanentUpgrades: ASCENSION_UPGRADES.reduce((acc, up) => {
      acc[up.id] = 0;
      return acc;
    }, {} as Record<AscensionUpgradeDefinition["id"], number>), // FIX: Used correct type for permanentUpgrades accumulator
    ascensionUnlocked: false, // Unlocked after first boss defeat

    // Boss Data
    currentBossId: FIRST_BOSS_ID, // FIX: Corrected to use "TrainingDummy"
    bossProgress: {
      [FIRST_BOSS_ID]: { defeated: 0, lastBattleLog: [] }, // FIX: Used correct ID
    },

    // UI State
    activeTab: "Jobs",
    
    // Battle State
    battleState: null,
    
    // Paths System
    pathState: {
      selectedPathId: null,
      selectionTime: 0,
      totalAscensions: 0,
    },

    // Removed extraneous properties: version, lastSave, maxActiveJobs, maxActiveSkills, maxActiveAbilities
  };
};

