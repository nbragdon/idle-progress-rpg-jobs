// src/hooks/useGame.ts
// Main hook that combines game logic and UI state

import { useMemo, useEffect } from "react";
import { useGameEngine } from "./useGameEngine";
import { useGameUI } from "./useGameUI";
import { JOB_DATA, BOSS_DATA, SKILL_DATA } from "../core/data";
import { calculateTotalLevels } from "../core/utils";
import {
  getMaxActiveJobs,
  getMaxActiveSkills,
  getMaxActiveAbilities,
} from "../core/gameCalculations";
import { FaBriefcase, FaChartBar, FaGraduationCap, FaFistRaised, FaSkull, FaRedoAlt, FaCog } from "react-icons/fa";
import type { TabId } from "./useGameUI";
import type { BossDefinition } from "../types/data";

interface TabDefinition {
  id: TabId;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

export const useGame = () => {
  // Game engine (pure game logic)
  const {
    gameState,
    unlockedJobNames,
    clearUnlockedJobNames,
    unlockedSkillNames,
    clearUnlockedSkillNames,
    toggleJobActive: engineToggleJobActive,
    toggleSkillActive: engineToggleSkillActive,
    toggleAbilityTraining: engineToggleAbilityTraining,
    buyAscensionUpgrade: engineBuyUpgrade,
    ascend: engineAscend,
    startBossBattle: engineStartBattle,
    calculatePlayerStats: engineCalculateStats,
    resetGame: engineResetGame,
  } = useGameEngine();

  // UI state
  const { activeTab, setTab, alert, showAlert } = useGameUI();

  // Show alert when jobs are unlocked
  useEffect(() => {
    if (unlockedJobNames.length > 0) {
      const jobNames = unlockedJobNames.map(id => JOB_DATA[id].name).join(", ");
      showAlert(`New job${unlockedJobNames.length > 1 ? 's' : ''} unlocked: ${jobNames}!`);
      clearUnlockedJobNames();
    }
  }, [unlockedJobNames, clearUnlockedJobNames, showAlert]);

  // Show alert when skills are unlocked
  useEffect(() => {
    if (unlockedSkillNames.length > 0) {
      const skillNames = unlockedSkillNames.map(id => SKILL_DATA[id].name).join(", ");
      showAlert(`New skill${unlockedSkillNames.length > 1 ? 's' : ''} unlocked: ${skillNames}!`);
      clearUnlockedSkillNames();
    }
  }, [unlockedSkillNames, clearUnlockedSkillNames, showAlert]);

  // Calculate derived values
  const playerStats = useMemo(() => engineCalculateStats(), [gameState.jobs, engineCalculateStats]);
  const totalLevels = useMemo(() => calculateTotalLevels(gameState), [gameState]);
  
  const maxLimits = useMemo(() => ({
    maxActiveJobs: getMaxActiveJobs(gameState),
    maxActiveSkills: getMaxActiveSkills(gameState),
    maxActiveAbilities: getMaxActiveAbilities(gameState),
  }), [gameState]);

  const currentBossData: BossDefinition = useMemo(
    () => BOSS_DATA[gameState.currentBossId],
    [gameState.currentBossId]
  );

  const isAscensionVisible = useMemo(() => {
    return Object.values(gameState.bossProgress).some(progress => progress.defeated > 0);
  }, [gameState.bossProgress]);

  // Tab definitions
  const tabs: TabDefinition[] = useMemo(() => [
    { id: "Jobs", name: "Jobs", icon: FaBriefcase },
    { id: "Stats", name: "Stats", icon: FaChartBar },
    { id: "Skills", name: "Skills", icon: FaGraduationCap },
    { id: "Abilities", name: "Abilities", icon: FaFistRaised },
    { id: "Boss", name: "Boss", icon: FaSkull },
    { id: "Ascension", name: "Ascension", icon: FaRedoAlt, disabled: !isAscensionVisible },
    { id: "Settings", name: "Settings", icon: FaCog },
  ], [isAscensionVisible]);

  // Wrapper functions that include limits
  const toggleJobActive = (jobId: string) => {
    // Jobs now auto-swap when at limit, so no error alert needed
    engineToggleJobActive(jobId, maxLimits.maxActiveJobs);
  };

  const toggleSkillActive = (skillId: string) => {
    const success = engineToggleSkillActive(skillId, maxLimits.maxActiveSkills);
    if (!success && gameState.skills[skillId] && !gameState.skills[skillId].isActive) {
      showAlert(`Cannot activate more than ${maxLimits.maxActiveSkills} skills at once!`);
    }
  };

  const toggleAbilityTraining = (abilityId: string) => {
    const success = engineToggleAbilityTraining(abilityId, maxLimits.maxActiveAbilities);
    if (!success && gameState.abilities[abilityId] && !gameState.abilities[abilityId].isTraining) {
      showAlert(`Cannot train more than ${maxLimits.maxActiveAbilities} abilities at once!`);
    }
  };

  const buyAscensionUpgrade = (upgradeId: string, cost: number) => {
    const success = engineBuyUpgrade(upgradeId, cost);
    if (!success) {
      showAlert("Not enough Ascension Points!");
    }
  };

  const ascend = () => {
    // Calculate ascension points before ascending
    const points = Math.floor(totalLevels / 10); // Example formula
    engineAscend(points);
    showAlert(`Ascended! Gained ${points} Ascension Points!`);
  };

  const startBossBattle = () => {
    engineStartBattle();
    showAlert("Boss battle started!");
  };

  const resetGame = () => {
    engineResetGame();
    showAlert("Game reset successfully!");
  };

  return {
    // Game state
    gameState,
    playerStats,
    totalLevels,
    maxLimits,
    currentBossData,
    isAscensionVisible,
    
    // UI state
    activeTab,
    setTab,
    alert,
    tabs,
    
    // Actions
    toggleJobActive,
    toggleSkillActive,
    toggleAbilityTraining,
    buyAscensionUpgrade,
    ascend,
    startBossBattle,
    resetGame,
  };
};

