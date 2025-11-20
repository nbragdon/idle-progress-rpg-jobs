// src/hooks/useGame.ts
// Main hook that combines game logic and UI state

import { useMemo, useEffect } from "react";
import { useGameEngine } from "./useGameEngine";
import { useGameUI } from "./useGameUI";
import { JOB_DATA, BOSS_DATA, SKILL_DATA, ABILITY_DATA } from "../core/data";
import { calculateTotalLevels } from "../core/utils";
import {
  getMaxActiveJobs,
  getMaxActiveSkills,
  getMaxActiveAbilities,
  getMaxBattleAbilities,
} from "../core/gameCalculations";
import { FaBriefcase, FaGraduationCap, FaFistRaised, FaSkull, FaRedoAlt, FaCog } from "react-icons/fa";
import { GiPathDistance, GiGoblinHead } from "react-icons/gi";
import type { TabId } from "./useGameUI";
import type { BossDefinition, AscensionUpgradeId } from "../types/data";

interface TabDefinition {
  id: TabId;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const useGame = () => {
  // Game engine (pure game logic)
  const {
    gameState,
    unlockedJobNames,
    clearUnlockedJobNames,
    unlockedSkillNames,
    clearUnlockedSkillNames,
    unlockedAbilityNames,
    clearUnlockedAbilityNames,
    toggleJobActive: engineToggleJobActive,
    toggleSkillActive: engineToggleSkillActive,
    toggleAbilityTraining: engineToggleAbilityTraining,
    toggleAbilityBattle: engineToggleAbilityBattle,
    toggleAutoTrainingJobs: engineToggleAutoTrainingJobs,
    toggleAutoTrainingSkills: engineToggleAutoTrainingSkills,
    toggleAutoTrainingAbilities: engineToggleAutoTrainingAbilities,
    buyAscensionUpgrade: engineBuyUpgrade,
    ascend: engineAscend,
    startBossBattle: engineStartBattle,
    closeBattle: engineCloseBattle,
    calculatePlayerStats: engineCalculateStats,
    resetGame: engineResetGame,
    selectPath: engineSelectPath,
    purchaseHordeUpgrade: enginePurchaseHordeUpgrade,
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

  // Show alert when abilities are unlocked
  useEffect(() => {
    if (unlockedAbilityNames.length > 0) {
      const abilityNames = unlockedAbilityNames.map(id => ABILITY_DATA[id].name).join(", ");
      showAlert(`New abilit${unlockedAbilityNames.length > 1 ? 'ies' : 'y'} unlocked: ${abilityNames}!`);
      clearUnlockedAbilityNames();
    }
  }, [unlockedAbilityNames, clearUnlockedAbilityNames, showAlert]);

  // Calculate derived values
  const playerStats = useMemo(() => engineCalculateStats(), [gameState.jobs, engineCalculateStats]);
  const totalLevels = useMemo(() => calculateTotalLevels(gameState), [gameState]);
  
  const maxLimits = useMemo(() => ({
    maxActiveJobs: getMaxActiveJobs(gameState),
    maxActiveSkills: getMaxActiveSkills(gameState),
    maxActiveAbilities: getMaxActiveAbilities(gameState),
    maxBattleAbilities: getMaxBattleAbilities(gameState),
  }), [gameState]);

  const currentBossData: BossDefinition = useMemo(
    () => BOSS_DATA[gameState.currentBossId],
    [gameState.currentBossId]
  );

  const isAscensionVisible = useMemo(() => {
    // Ascension is visible once unlocked (first boss defeat) and stays visible through resets
    return gameState.ascensionUnlocked;
  }, [gameState.ascensionUnlocked]);
  
  const isPathsVisible = useMemo(() => {
    // Paths are visible after 10 or more total ascensions
    return gameState.pathState.totalAscensions >= 10;
  }, [gameState.pathState.totalAscensions]);
  
  const isHordeVisible = useMemo(() => {
    // Horde is visible after unlocking (5+ Goblin King defeats)
    return gameState.hordeState.unlocked;
  }, [gameState.hordeState.unlocked]);

  // Tab definitions
  const tabs: TabDefinition[] = useMemo(() => {
    const baseTabs: TabDefinition[] = [
      { id: "Jobs", name: "Jobs", icon: FaBriefcase },
      { id: "Skills", name: "Skills", icon: FaGraduationCap },
      { id: "Abilities", name: "Abilities", icon: FaFistRaised },
      { id: "Boss", name: "Boss", icon: FaSkull },
    ];
    
    // Only add Ascension tab if it's been unlocked
    if (isAscensionVisible) {
      baseTabs.push({ id: "Ascension", name: "Ascension", icon: FaRedoAlt });
    }
    
    // Only add Paths tab if it's been unlocked
    if (isPathsVisible) {
      baseTabs.push({ id: "Paths", name: "Paths", icon: GiPathDistance });
    }
    
    // Only add Horde tab if it's been unlocked
    if (isHordeVisible) {
      baseTabs.push({ id: "Horde", name: "Horde", icon: GiGoblinHead });
    }
    
    baseTabs.push({ id: "Settings", name: "Settings", icon: FaCog });
    
    return baseTabs;
  }, [isAscensionVisible, isPathsVisible, isHordeVisible]);

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
    // Abilities now auto-swap when at limit, so no error alert needed
    engineToggleAbilityTraining(abilityId, maxLimits.maxActiveAbilities);
  };

  const toggleAbilityBattle = (abilityId: string) => {
    const success = engineToggleAbilityBattle(abilityId, maxLimits.maxBattleAbilities);
    if (!success && gameState.abilities[abilityId] && !gameState.abilities[abilityId].isActiveBattle) {
      showAlert(`Cannot have more than ${maxLimits.maxBattleAbilities} abilities active in battle!`);
    }
  };

  const buyAscensionUpgrade = (upgradeId: AscensionUpgradeId, cost: number) => {
    const success = engineBuyUpgrade(upgradeId, cost);
    if (!success) {
      showAlert("Not enough Ascension Points!");
    }
  };

  const ascend = () => {
    const potentialPoints = gameState.potentialAscensionPoints;
    engineAscend();
    showAlert(`Ascended! Claimed ${potentialPoints} Ascension Points!`);
  };

  const startBossBattle = () => {
    const success = engineStartBattle();
    if (!success) {
      showAlert("You must select at least 1 ability for battle! Go to the Abilities tab.");
    }
  };

  const closeBattle = () => {
    engineCloseBattle();
  };

  const resetGame = () => {
    engineResetGame();
    showAlert("Game reset successfully!");
  };
  
  const selectPath = (pathId: string) => {
    const success = engineSelectPath(pathId);
    if (success) {
      showAlert(`Path selected! Bonuses will grow over the next hour.`);
    } else {
      showAlert("Cannot select path - you already have one selected!");
    }
  };
  
  const purchaseHordeUpgrade = (upgradeId: string) => {
    const success = enginePurchaseHordeUpgrade(upgradeId);
    if (success) {
      showAlert(`Upgrade purchased! Stat gains increased.`);
    } else {
      showAlert("Cannot purchase upgrade - not enough goblins!");
    }
  };

  return {
    // Game state
    gameState,
    playerStats,
    totalLevels,
    maxLimits,
    currentBossData,
    isAscensionVisible,
    isPathsVisible,
    isHordeVisible,
    
    // UI state
    activeTab,
    setTab,
    alert,
    tabs,
    
    // Actions
    toggleJobActive,
    toggleSkillActive,
    toggleAbilityTraining,
    toggleAbilityBattle,
    toggleAutoTrainingJobs: engineToggleAutoTrainingJobs,
    toggleAutoTrainingSkills: engineToggleAutoTrainingSkills,
    toggleAutoTrainingAbilities: engineToggleAutoTrainingAbilities,
    buyAscensionUpgrade,
    ascend,
    startBossBattle,
    closeBattle,
    resetGame,
    selectPath,
    purchaseHordeUpgrade,
  };
};

