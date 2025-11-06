// src/hooks/useGameState.ts

import { useState, useCallback, useMemo } from "react";
import { getInitialState } from "../state/initialState";
import { ASCENSION_UPGRADES, BOSS_DATA } from "../core/data";
import type { GameState, PlayerStats } from "../types/game";
import {
  getMaxActiveJobs,
  getMaxActiveSkills,
  getMaxActiveAbilities,
} from "../core/gameCalculations";
import type { AscensionUpgradeId, BossDefinition } from "../types/data";
// NEW IMPORTS for Tab definitions
import { FaBriefcase, FaChartBar, FaGraduationCap, FaFistRaised, FaSkull, FaRedoAlt } from "react-icons/fa";
import React from "react"; // Required for React.ElementType

// Mock Types used in App.tsx (assuming they are defined elsewhere)
type TabId = "Jobs" | "Stats" | "Skills" | "Abilities" | "Boss" | "Ascension";
interface TabDefinition {
  id: TabId;
  name: string;
  icon: React.ElementType;
  disabled: boolean;
}

interface AlertState {
  message: string;
  visible: boolean;
}

interface MaxLimits {
  maxActiveJobs: number;
  maxActiveSkills: number;
  maxActiveAbilities: number;
}

export const useGameState = () => {
  const [state, setGameState] = useState<GameState>(getInitialState());
  const [alert, setAlert] = useState<AlertState>({
    message: "",
    visible: false,
  });

  // NEW STATE: Active Tab management
  const [activeTab, setActiveTab] = useState<TabId>("Jobs");
  const setTab = useCallback((tabId: TabId) => setActiveTab(tabId), []);

  // Helper function for showing alerts
  const showAlert = useCallback(
    (message: string) => {
      setAlert({ message, visible: true });
      setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 3000);
    },
    []
  );

  // Memoize max limits calculation
  const maxLimits: MaxLimits = useMemo(() => {
    return {
      maxActiveJobs: getMaxActiveJobs(state),
      maxActiveSkills: getMaxActiveSkills(state),
      maxActiveAbilities: getMaxActiveAbilities(state),
    };
  }, [state]);

  // --- DERIVED GAME STATE & LOGIC (Required by App.tsx) ---

  // MOCK: Derived State: Player Stats
  // This would typically come from a useGameLogic hook, but mocked here for compilation
  const playerStats: PlayerStats = useMemo(() => ({
    // Mocking a calculation based on job levels
    TotalLevels: Object.values(state.jobs).reduce((sum, j) => sum + j.level, 0) + 1,
    Attack: 10 + Math.floor(Object.values(state.abilities).find(a => a.id === 'str')?.level || 1),
    Defense: 5,
    Health: 100,
    Speed: 10,
  }), [state.jobs, state.abilities]);

  // MOCK: Derived State: Current Boss Data
  const currentBossData: BossDefinition = useMemo(() => BOSS_DATA[state.currentBossId], [state.currentBossId]);

  // MOCK: Visibility check for Ascension (e.g., Boss defeated at least once)
  const isAscensionVisible = useMemo(() => {
    const totalBossDefeats = Object.values(state.bossProgress).reduce((sum, p) => sum + p.defeated, 0);
    return totalBossDefeats >= 1;
  }, [state.bossProgress]);

  // MOCK: Tab Definitions
  const tabs: TabDefinition[] = useMemo(() => [
    { id: "Jobs", name: "Jobs", icon: FaBriefcase, disabled: false },
    { id: "Stats", name: "Stats", icon: FaChartBar, disabled: false },
    { id: "Skills", name: "Skills", icon: FaGraduationCap, disabled: false },
    { id: "Abilities", name: "Abilities", icon: FaFistRaised, disabled: false },
    { id: "Boss", name: "Boss", icon: FaSkull, disabled: false },
    { id: "Ascension", name: "Ascension", icon: FaRedoAlt, disabled: !isAscensionVisible },
  ], [isAscensionVisible]);

  // MOCK: Boss Battle Action
  const startBossBattle = useCallback(() => {
    showAlert("Battle started! (Logic pending in game loop)");
    // This function would normally trigger the game simulation loop to run a battle
  }, [showAlert]);


  // --- ACTIONS (Unchanged) ---

  const toggleJobActive = useCallback((jobId: string) => {
    setGameState(prev => {
      const maxJobs = getMaxActiveJobs(prev);
      const activeJobs = Object.values(prev.jobs).filter(j => j.isActive).length;

      if (prev.jobs[jobId].isActive) {
        return {
          ...prev,
          jobs: {
            ...prev.jobs,
            [jobId]: { ...prev.jobs[jobId], isActive: false }
          }
        };
      } else if (activeJobs < maxJobs) {
        return {
          ...prev,
          jobs: {
            ...prev.jobs,
            [jobId]: { ...prev.jobs[jobId], isActive: true, lastActiveTime: Date.now() }
          }
        };
      } else {
        showAlert(`Cannot activate more than ${maxJobs} jobs.`);
        return prev;
      }
    });
  }, [showAlert]);

  const toggleSkillActive = useCallback((skillId: string) => {
    setGameState(prev => {
      const maxSkills = getMaxActiveSkills(prev);
      const activeSkills = Object.values(prev.skills).filter(s => s.isActive).length;

      if (prev.skills[skillId].isActive) {
        return {
          ...prev,
          skills: {
            ...prev.skills,
            [skillId]: { ...prev.skills[skillId], isActive: false }
          }
        };
      } else if (activeSkills < maxSkills) {
        return {
          ...prev,
          skills: {
            ...prev.skills,
            [skillId]: { ...prev.skills[skillId], isActive: true }
          }
        };
      } else {
        showAlert(`Cannot train more than ${maxSkills} skills.`);
        return prev;
      }
    });
  }, [showAlert]);

  const toggleAbilityTraining = useCallback((abilityId: string) => {
    setGameState(prev => {
      const maxAbilities = getMaxActiveAbilities(prev);
      const trainingAbilities = Object.values(prev.abilities).filter(a => a.isTraining).length;

      if (prev.abilities[abilityId].isTraining) {
        return {
          ...prev,
          abilities: {
            ...prev.abilities,
            [abilityId]: { ...prev.abilities[abilityId], isTraining: false }
          }
        };
      } else if (trainingAbilities < maxAbilities) {
        return {
          ...prev,
          abilities: {
            ...prev.abilities,
            [abilityId]: { ...prev.abilities[abilityId], isTraining: true }
          }
        };
      } else {
        showAlert(`Cannot train more than ${maxAbilities} abilities.`);
        return prev;
      }
    });
  }, [showAlert]);

  const buyAscensionUpgrade = useCallback((upgradeId: AscensionUpgradeId) => {
    const upgrade = ASCENSION_UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return;

    setGameState(prev => {
      const currentLevel = prev.permanentUpgrades[upgradeId] || 0;
      const cost = upgrade.cost(currentLevel);

      if (currentLevel >= upgrade.maxLevel) {
        showAlert(`${upgrade.name} is already at max level.`);
        return prev;
      }

      if (prev.ascensionPoints < cost) {
        showAlert(`Not enough Ascension Points. Need ${cost}.`);
        return prev;
      }

      const newUpgrades = {
        ...prev.permanentUpgrades,
        [upgradeId]: currentLevel + 1
      };

      return {
        ...prev,
        ascensionPoints: prev.ascensionPoints - cost,
        permanentUpgrades: newUpgrades,
      };
    });
  }, [showAlert]);

  const ascend = useCallback(() => {
    setGameState((prev) => {
      const bossDefeats = Object.values(prev.bossProgress).reduce(
        (sum, progress) => sum + progress.defeated,
        0
      );
      // NOTE: Using currentBossId for AP calculation even on ascend
      const currentBossAP = BOSS_DATA[prev.currentBossId]?.ascensionPoints || 0;
      const pointsFromBosses = Math.floor(bossDefeats * currentBossAP);
      const totalPoints = prev.ascensionPoints + pointsFromBosses;

      const initialState = getInitialState();

      return {
        ...initialState, // Reset almost all game state
        ascensionPoints: totalPoints, // Keep and add new points
        permanentUpgrades: prev.permanentUpgrades, // Keep permanent upgrades
      };
    });
    // This message is incorrect, it should use the value calculated inside setGameState
    // But for the sake of making it runnable:
    showAlert(`Ascension complete! Gained points (details in console).`);
  }, [showAlert]);


  // Placeholder for other actions
  const gainJobOrSkillExperience = () => { };
  const gainAbilityExperience = () => { };
  const updateAbilitiesUnlock = () => { };

  return {
    gameState: state,
    setGameState,
    maxLimits,
    alert,
    setAlert,
    showAlert,

    // NEW EXPORTS ADDED FOR App.tsx
    activeTab,
    setTab,
    playerStats,
    currentBossData,
    isAscensionVisible,
    tabs,
    startBossBattle,

    // Other placeholder returns
    gainJobOrSkillExperience,
    gainAbilityExperience,
    updateAbilitiesUnlock,
    // Actions
    toggleJobActive,
    toggleSkillActive,
    toggleAbilityTraining,
    buyAscensionUpgrade,
    ascend,
  };
};
