// src/state/persistence.ts

// src/state/persistence.ts
import type { GameState } from "../types/game";
import { getInitialState } from "./initialState";

export const loadGame = (): GameState => {
  try {
    const savedState = localStorage.getItem("incrementalGameSave");
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      const initialState = getInitialState(); // Type-safe merging and migration
      
      // Merge saved jobs with initial jobs
      const mergedJobs = { ...initialState.jobs };
      if (parsedState.jobs) {
        Object.entries(parsedState.jobs).forEach(([id, job]) => {
          mergedJobs[id] = job as GameState["jobs"][string];
        });
      }
      
      // Merge saved skills with initial skills
      const mergedSkills = { ...initialState.skills };
      if (parsedState.skills) {
        Object.entries(parsedState.skills).forEach(([id, skill]) => {
          mergedSkills[id] = skill as GameState["skills"][string];
        });
      }
      
      return {
        ...initialState,
        ...parsedState,
        jobs: mergedJobs,
        skills: mergedSkills,
        abilities: Object.keys(initialState.abilities).reduce((acc, id) => {
          acc[id] = {
            ...initialState.abilities[id],
            ...parsedState.abilities?.[id],
            isTraining:
              parsedState.abilities?.[id]?.isTraining ??
              initialState.abilities[id].isTraining,
          };
          return acc;
        }, {} as GameState["abilities"]),
        permanentUpgrades: {
          ...initialState.permanentUpgrades,
          ...parsedState.permanentUpgrades,
        },
        bossProgress: {
          ...initialState.bossProgress,
          ...parsedState.bossProgress,
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
    localStorage.setItem(
      "incrementalGameSave",
      JSON.stringify({ ...state, lastSave: Date.now() })
    );
  } catch (error) {
    console.error("Failed to save game state:", error);
  }
};
