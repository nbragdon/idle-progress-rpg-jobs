// src/hooks/useGameEngine.ts
// React hook that wraps the GameEngine

import { useState, useEffect, useRef, useCallback } from "react";
import { GameEngine } from "../game/GameEngine";
import { getInitialState } from "../state/initialState";
import { loadGame, saveGame } from "../state/persistence";
import type { GameState } from "../types/game";
import type { AscensionUpgradeId } from "../types/data";

export const useGameEngine = () => {
  // Initialize game engine
  const engineRef = useRef<GameEngine | null>(null);
  
  if (!engineRef.current) {
    const initialState = loadGame();
    engineRef.current = new GameEngine(initialState);
  }

  const engine = engineRef.current;

  // React state that mirrors game state
  const [gameState, setGameState] = useState<GameState>(() => engine.getState());

  // Subscribe to engine state changes
  useEffect(() => {
    const unsubscribe = engine.subscribe((newState) => {
      setGameState(newState);
    });

    return unsubscribe;
  }, [engine]);

  // Auto-save game state - save every time state changes with minimal debounce
  const saveTimeoutRef = useRef<number | null>(null);
  const lastSaveRef = useRef<number>(0);
  
  useEffect(() => {
    const now = Date.now();
    const timeSinceLastSave = now - lastSaveRef.current;
    
    // Clear any pending timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // If it's been more than 1 second since last save, save immediately
    // Otherwise, debounce for 100ms (one tick) to batch rapid changes
    const delay = timeSinceLastSave > 1000 ? 0 : 100;
    
    saveTimeoutRef.current = window.setTimeout(() => {
      saveGame(gameState);
      lastSaveRef.current = Date.now();
    }, delay);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [gameState]);

  // Save on page unload as a backup
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveGame(gameState);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [gameState]);

  // Game loop
  useEffect(() => {
    const TICK_INTERVAL = 100;
    let lastTime = Date.now();

    const gameLoop = setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - lastTime) / 1000;
      lastTime = now;

      // Don't update if delta is too large (e.g., tab was inactive)
      if (deltaTime > 10) return;

      engine.tick(deltaTime);
    }, TICK_INTERVAL);

    return () => clearInterval(gameLoop);
  }, [engine]);

  // Check for job unlocks when state changes
  const [unlockedJobNames, setUnlockedJobNames] = useState<string[]>([]);
  
  useEffect(() => {
    const newlyUnlocked = engine.checkJobUnlocks();
    if (newlyUnlocked.length > 0) {
      setUnlockedJobNames(newlyUnlocked);
    }
  }, [gameState.jobs, engine]);

  // Check for skill unlocks when state changes
  const [unlockedSkillNames, setUnlockedSkillNames] = useState<string[]>([]);
  
  useEffect(() => {
    const newlyUnlocked = engine.checkSkillUnlocks();
    if (newlyUnlocked.length > 0) {
      setUnlockedSkillNames(newlyUnlocked);
    }
  }, [gameState.skills, engine]);

  // Wrap engine methods in callbacks
  const toggleJobActive = useCallback((jobId: string, maxActiveJobs: number) => {
    return engine.toggleJobActive(jobId, maxActiveJobs);
  }, [engine]);

  const toggleSkillActive = useCallback((skillId: string, maxActiveSkills: number) => {
    return engine.toggleSkillActive(skillId, maxActiveSkills);
  }, [engine]);

  const toggleAbilityTraining = useCallback((abilityId: string, maxTrainingAbilities: number) => {
    return engine.toggleAbilityTraining(abilityId, maxTrainingAbilities);
  }, [engine]);

  const toggleAbilityBattle = useCallback((abilityId: string, maxBattleAbilities: number) => {
    return engine.toggleAbilityBattle(abilityId, maxBattleAbilities);
  }, [engine]);

  const buyAscensionUpgrade = useCallback((upgradeId: AscensionUpgradeId, cost: number) => {
    return engine.buyAscensionUpgrade(upgradeId, cost);
  }, [engine]);

  const ascend = useCallback(() => {
    engine.ascend();
  }, [engine]);

  const startBossBattle = useCallback(() => {
    return engine.startBossBattle();
  }, [engine]);

  const closeBattle = useCallback(() => {
    engine.closeBattle();
  }, [engine]);

  const calculatePlayerStats = useCallback(() => {
    return engine.calculatePlayerStats();
  }, [engine]);

  const resetGame = useCallback(() => {
    // Clear localStorage (using correct key)
    localStorage.removeItem("incrementalGameSave");
    
    // Get fresh initial state
    const freshState = getInitialState();
    
    // Reset engine
    engine.reset(freshState);
  }, [engine]);

  return {
    gameState,
    engine,
    unlockedJobNames,
    clearUnlockedJobNames: () => setUnlockedJobNames([]),
    unlockedSkillNames,
    clearUnlockedSkillNames: () => setUnlockedSkillNames([]),
    
    // Game actions
    toggleJobActive,
    toggleSkillActive,
    toggleAbilityTraining,
    toggleAbilityBattle,
    buyAscensionUpgrade,
    ascend,
    startBossBattle,
    closeBattle,
    calculatePlayerStats,
    resetGame,
  };
};

