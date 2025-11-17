// src/state/persistence.ts
// Simple merge-based persistence: Always sync with current game data definitions

import type { GameState } from "../types/game";
import { getInitialState } from "./initialState";
import { JOB_DATA, SKILL_DATA, ABILITY_DATA } from "../core/data";

export const loadGame = (): GameState => {
  try {
    const savedState = localStorage.getItem("incrementalGameSave");
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      const initialState = getInitialState();
      
      // Validate basic structure
      if (!parsedState || typeof parsedState !== 'object') {
        console.warn("Invalid save file, starting fresh");
        return getInitialState();
      }
      
      // JOBS: Start with current game data, overlay player progress
      const mergedJobs = { ...initialState.jobs };
      if (parsedState.jobs) {
        Object.keys(JOB_DATA).forEach(id => {
          if (parsedState.jobs[id]) {
            // Keep player progress for jobs that still exist
            mergedJobs[id] = parsedState.jobs[id];
          }
          // New jobs automatically get initial state
        });
      }
      
      // SKILLS: Start with current game data, overlay player progress
      const mergedSkills = { ...initialState.skills };
      if (parsedState.skills) {
        Object.keys(SKILL_DATA).forEach(id => {
          if (parsedState.skills[id]) {
            const savedSkill = parsedState.skills[id];
            // Keep player progress for skills that still exist
            // Ensure new fields have defaults
            mergedSkills[id] = {
              ...savedSkill,
              lastActiveTime: savedSkill.lastActiveTime ?? 0,
            };
          }
          // New skills automatically get initial state
        });
      }
      
      // ABILITIES: Start with current game data, overlay player progress
      const mergedAbilities: GameState["abilities"] = {};
      Object.keys(ABILITY_DATA).forEach(id => {
        const savedAbility = parsedState.abilities?.[id];
        if (savedAbility) {
          // Keep player progress for abilities that still exist
          mergedAbilities[id] = {
            ...initialState.abilities[id],
            ...savedAbility,
            // Ensure boolean flags are set
            unlocked: savedAbility.unlocked ?? initialState.abilities[id].unlocked,
            isTraining: savedAbility.isTraining ?? false,
            isActiveBattle: savedAbility.isActiveBattle ?? false,
          };
        } else {
          // New abilities get initial state
          mergedAbilities[id] = initialState.abilities[id];
        }
      });
      
      // Return merged state - ONLY include fields that exist in current GameState
      // This ensures deprecated fields are automatically dropped
      return {
        // Core progression (already filtered to current game data)
        jobs: mergedJobs,
        skills: mergedSkills,
        abilities: mergedAbilities,
        
        // Currencies and permanent systems
        gold: parsedState.gold ?? 0,
        ascensionPoints: parsedState.ascensionPoints ?? 0,
        potentialAscensionPoints: parsedState.potentialAscensionPoints ?? 0,
        ascensionUnlocked: parsedState.ascensionUnlocked ?? false,
        permanentUpgrades: {
          ...initialState.permanentUpgrades,
          ...parsedState.permanentUpgrades,
        },
        
        // Boss progression
        currentBossId: parsedState.currentBossId ?? initialState.currentBossId,
        bossProgress: {
          ...initialState.bossProgress,
          ...parsedState.bossProgress,
        },
        
        // UI state
        lastTickTime: parsedState.lastTickTime ?? Date.now(),
        activeTab: parsedState.activeTab ?? "Jobs",
        
        // Battle state (never persisted)
        battleState: null,
        
        // Paths system
        pathState: {
          selectedPathId: parsedState.pathState?.selectedPathId ?? null,
          selectionTime: parsedState.pathState?.selectionTime ?? 0,
          totalAscensions: parsedState.pathState?.totalAscensions ?? 0,
        },
      } as GameState;
    }
  } catch (error) {
    console.error("Failed to load game state:", error);
  }
  return getInitialState();
};

export const saveGame = (state: GameState): void => {
  try {
    // Remove non-serializable data before saving
    const saveData = {
      ...state,
      battleState: null, // Never persist active battles
      lastSave: Date.now(), // Add timestamp for debugging
    };
    
    localStorage.setItem(
      "incrementalGameSave",
      JSON.stringify(saveData)
    );
  } catch (error) {
    console.error("Failed to save game state:", error);
  }
};
