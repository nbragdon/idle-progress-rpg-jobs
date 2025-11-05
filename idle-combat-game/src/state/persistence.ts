// src/state/persistence.ts

import { GameState } from "../types/game";
import { getInitialState } from "./initialState";

export const loadGame = (): GameState => {
  try {
    const savedState = localStorage.getItem("incrementalGameSave");
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      const initialState = getInitialState(); // Type-safe merging and migration
      return {
        ...initialState,
        ...parsedState,
        jobs: { ...initialState.jobs, ...parsedState.jobs }, // Use type assertions and optional chaining for merging complex objects
        skills: Object.keys(initialState.skills).reduce((acc, id) => {
          acc[id] = {
            ...initialState.skills[id],
            ...parsedState.skills?.[id],
            isActive:
              parsedState.skills?.[id]?.isActive ??
              initialState.skills[id].isActive,
          };
          return acc;
        }, {} as GameState["skills"]),
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
