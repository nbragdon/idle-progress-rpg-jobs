// src/hooks/useGameLogic.ts

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  type GameState,
  type PlayerStats,
  type StatId,
  type BattleLogEntry,
  type AbilityEffect, // <--- Imported AbilityEffect
} from "../types/game";
import {
  JOB_DATA,
  SKILL_DATA,
  ABILITY_DATA,
  STAT_MAP,
  ASCENSION_UPGRADES,
  BOSS_DATA,
} from "../core/data";
import {
  PLAYER_BASE_HP,
} from "../core/constants";
import { DamageValue, type AscensionUpgradeId, type DamageType } from "../types/data";

// Helper interface for battle simulation result
interface BattleResult {
  log: BattleLogEntry[];
  winner: "player" | "boss";
  bossId: string;
}

// =========================================================
// COMBAT HELPERS
// =========================================================

/**
 * Calculates the damage dealt, including critical hits.
 */
const calculateDamage = (
  baseDamage: number,
  critChance: number,
  critDamage: number
): { totalDamage: number; isCrit: boolean } => {
  // Crit Chance is expected to be a decimal (e.g., 0.15 for 15%)
  const isCrit = Math.random() < critChance;
  let totalDamage = baseDamage;
  if (isCrit) {
    totalDamage *= critDamage;
  }
  return { totalDamage, isCrit };
};

/**
 * Applies resistance reduction to damage based on damage type and opponent's defense stats.
 */
const applyResistanceReduction = (
  rawDamage: number,
  damageType: DamageType,
  targetStats: PlayerStats
): number => {
  if (damageType === DamageValue.True) {
    return rawDamage;
  }

  // Determine resistance stat
  const resistanceStat =
    damageType === DamageValue.Physical ? targetStats.TGH : targetStats.FRT;

  // Simple reduction model: 1 point of TGH/FRT reduces damage by 1% (up to a cap)
  // Max reduction cap set at 50% for TGH/FRT of 50
  const reductionPercent = Math.min(0.5, resistanceStat / 100);
  const finalDamage = rawDamage * (1 - reductionPercent);

  return finalDamage;
};

/**
 * Processes a single AbilityEffect against a target and updates the battle log.
 * This helper is essential for handling the new AbilityEffect array structure.
 */
const processAbilityEffect = ({
  effect,
  baseDamage, // The base damage (player STR/INT or boss baseDamage)
  targetStats, // The stats of the target (playerStats for player, or a mock for boss)
  critChance,
  critDamage,
  log,
  time,
  sourceName,
  targetName,
}: {
  effect: AbilityEffect;
  baseDamage: number;
  targetStats: PlayerStats; // Boss stats are not explicitly tracked, using playerStats structure for reduction calc
  critChance: number;
  critDamage: number;
  log: BattleLogEntry[];
  time: number;
  sourceName: string;
  targetName: string;
}): { damageDealt: number; isCrit: boolean } => {
  const rawDamage = baseDamage * effect.damageMultiplier;

  const { totalDamage: unresistedDamage, isCrit } = calculateDamage(
    rawDamage,
    critChance,
    critDamage
  );

  const finalDamage = applyResistanceReduction(
    unresistedDamage,
    effect.damageType,
    targetStats
  );

  // Log damage
  log.push({
    time,
    message: `${sourceName} deals ${finalDamage.toFixed(2)} ${effect.damageType
      } damage to ${targetName}.${isCrit ? " (CRIT!)" : ""}`,
    type: "ability",
    value: effect.damageType,
  });

  // Log status effect (simple log for now)
  if (effect.statusEffect) {
    log.push({
      time,
      message: `${sourceName} applies ${effect.statusEffect.id} to ${targetName} for ${effect.statusEffect.duration}s.`,
      type: "ability",
      value: effect.statusEffect.id,
    });
  }

  return { damageDealt: finalDamage, isCrit };
};

// =========================================================
// INITIAL STATE & HOOK SETUP
// =========================================================

// ... [INITIAL_GAME_STATE and hook setup omitted for brevity] ...

// The initial state definition is required for the hook to run.
const INITIAL_GAME_STATE: GameState = {
  jobs: Object.keys(JOB_DATA).reduce(
    (acc, id) => ({
      ...acc,
      [id]: { id, level: 1, exp: 0, isActive: false, lastActiveTime: 0 },
    }),
    {} as GameState["jobs"]
  ),
  skills: Object.keys(SKILL_DATA).reduce(
    (acc, id) => ({
      ...acc,
      [id]: { id, level: 1, exp: 0, isActive: false },
    }),
    {} as GameState["skills"]
  ),
  abilities: Object.keys(ABILITY_DATA).reduce(
    (acc, id) => ({
      ...acc,
      [id]: { id, level: 1, exp: 0, unlocked: false, isTraining: false },
    }),
    {} as GameState["abilities"]
  ),
  gold: 0,
  ascensionPoints: 0,
  permanentUpgrades: {
    jobExp: 0,
    skillExp: 0,
    maxSkills: 0,
    maxAbilities: 0,
    maxActiveJobs: 0
  },
  currentBossId: "TrainingDummy",
  bossProgress: {},
  lastTickTime: Date.now(),
  activeTab: "Jobs",
};

const usePersistedState = <T>(key: string, initialState: T) => {
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialState;
    } catch (error) {
      console.error("Error reading localStorage key “" + key + "”:", error);
      return initialState;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error("Error writing localStorage key “" + key + "”:", error);
    }
  }, [key, state]);

  return [state, setState] as const;
};

// =========================================================
// MAIN HOOK
// =========================================================

export const useGameLogic = () => {
  const [gameState, setGameState] = usePersistedState<GameState>(
    "game-v0.1",
    INITIAL_GAME_STATE
  );
  const [alert, setAlert] = useState<{ message: string; id: number } | null>(
    null
  );

  // Helper for displaying alerts
  const showAlert = useCallback((message: string) => {
    setAlert({ message, id: Date.now() });
  }, []);

  // UseMemo to calculate player stats based on current jobs/skills
  const playerStats = useMemo<PlayerStats>(() => {
    const stats: PlayerStats = Object.keys(STAT_MAP).reduce(
      (acc, key) => ({ ...acc, [key as StatId]: 1 }), // Base stat of 1
      {} as PlayerStats
    );
    stats.CRIT_C = 0.05; // Base Crit Chance 5%
    stats.CRIT_D = 1.5; // Base Crit Damage 150%

    // 1. Apply Job Level bonuses
    Object.values(gameState.jobs).forEach((job) => {
      const jobDef = JOB_DATA[job.id];
      const level = job.level;
      jobDef.statBonuses.forEach((bonus) => {
        stats[bonus.stat] += bonus.value * level;
      });
    });

    // 2. Apply Skill bonuses
    Object.values(gameState.skills).forEach((skill) => {
      const skillDef = SKILL_DATA[skill.id];
      // TODO: Apply skill bonuses
      // const level = skill.level;
      skillDef.effects.forEach(() => {
        //stats[effect.] += bonus.multiplier * level;
      });
    });

    // 3. Apply Permanent Upgrades
    Object.entries(gameState.permanentUpgrades).forEach(
      ([upgradeId]) => {
        // TODO: Apply permanent upgrade effects
        // const upgradeDef = ASCENSION_UPGRADES.find((u) => u.id === upgradeId);
        // const level = gameState.permanentUpgrades[upgradeId];
        void upgradeId; // Suppress unused warning
      }
    );

    // 4. Calculate Total Levels (for ability unlocking)
    stats.TotalLevels = Object.values(gameState.jobs).reduce(
      (sum, job) => sum + job.level,
      0
    );

    return stats;
  }, [gameState.jobs, gameState.skills, gameState.permanentUpgrades]);

  // UseMemo to calculate current max limits
  const maxLimits = useMemo(() => {
    const maxActiveJobsLevel =
      gameState.permanentUpgrades["maxActiveJobs"] || 0;
    const maxSkillsLevel = gameState.permanentUpgrades["maxSkills"] || 0;
    const maxAbilitiesLevel = gameState.permanentUpgrades["maxAbilities"] || 0;

    return {
      maxActiveJobs: 1 + maxActiveJobsLevel,
      maxSkills: 1 + maxSkillsLevel,
      maxAbilities: 1 + maxAbilitiesLevel,
    };
  }, [gameState.permanentUpgrades]);

  // UseMemo to check if Ascension is possible (Boss defeated > 0)
  const isAscensionVisible = useMemo(() => {
    const currentBossProgress =
      gameState.bossProgress[gameState.currentBossId]?.defeated || 0;
    return currentBossProgress > 0;
  }, [gameState.bossProgress, gameState.currentBossId]);

  // =========================================================
  // BATTLE SIMULATION FUNCTION
  // =========================================================

  /**
   * Simulates a single battle against the current boss.
   * Player's base damage is a simple scaling of primary stats.
   * Boss's resistance is approximated using the player's current stats (for simplicity).
   */
  const simulateBattle = (
    bossId: string,
    playerStats: PlayerStats,
    abilities: GameState["abilities"]
  ): BattleResult => {
    const currentBossDef = BOSS_DATA[bossId];
    if (!currentBossDef) {
      console.error("Boss data not found for ID:", bossId);
      return { log: [], winner: "boss", bossId };
    }

    // Combat State Setup
    // Calculate initial Player HP based on TGH
    let playerHP = PLAYER_BASE_HP + playerStats.TGH * 10;
    let bossHP = currentBossDef.baseHp;
    let time = 0;
    const log: BattleLogEntry[] = [];
    const battleDuration = 60; // Max battle time in seconds

    // Attack Speed (simplified: one attack per interval)
    // Agility and Dexterity affect attack speed
    const playerAttackInterval = 10 / (playerStats.AGI * 0.5 + playerStats.DEX * 0.5);
    const bossAttackInterval = currentBossDef.bossAbility.cooldown;

    let playerNextAttackTime = 0;
    let bossNextAttackTime = 0;
    let abilityNextCastTime: Record<string, number> = {};

    // Player's primary damage stat (simplified combination of STR/DEX/INT)
    const playerBaseDamage =
      playerStats.STR * 0.3 + playerStats.DEX * 0.3 + playerStats.INT * 0.4;
    const playerCritChance = playerStats.CRIT_C;
    const playerCritDamage = playerStats.CRIT_D;

    // Boss's "stats" for resistance calculation (approximated for now)
    // In a real game, boss would have its own stats. For now, TGH/FRT is 10
    const bossResistanceStats: PlayerStats = { ...playerStats, TGH: 10, FRT: 10 };

    // --------------------------------------------------------------------------------
    // BATTLE LOOP
    // --------------------------------------------------------------------------------
    while (playerHP > 0 && bossHP > 0 && time < battleDuration) {
      // 1. Check for Player Basic Attack
      if (time >= playerNextAttackTime) {
        // Player basic attack is simplified: 1.0 multiplier, Physical damage
        const basicAttackEffect: AbilityEffect = {
          damageMultiplier: 1.0,
          damageType: DamageValue.Physical,
        };

        const { damageDealt } = processAbilityEffect({
          effect: basicAttackEffect,
          baseDamage: playerBaseDamage,
          targetStats: bossResistanceStats, // Target's resistance stats
          critChance: playerCritChance,
          critDamage: playerCritDamage,
          log,
          time,
          sourceName: "Player",
          targetName: currentBossDef.name,
        });

        bossHP -= damageDealt;
        playerNextAttackTime = time + playerAttackInterval;
      }

      // 2. Check for Boss Ability Attack
      if (time >= bossNextAttackTime) {
        log.push({
          time,
          message: `${currentBossDef.name} executes ${currentBossDef.bossAbility.name}.`,
          type: "boss",
          value: currentBossDef.bossAbility.name,
        });

        // --- CRITICAL CHANGE: Loop over effects array for Boss Attack ---
        currentBossDef.bossAbility.effects.forEach((effect) => {
          // Boss base damage is the multiplier source
          const bossBaseDamage = currentBossDef.baseDamage;

          // Player stats are the target's resistance source
          const { damageDealt } = processAbilityEffect({
            effect,
            baseDamage: bossBaseDamage,
            targetStats: playerStats, // Target's resistance stats
            critChance: 0.05, // Bosses have low crit chance
            critDamage: 1.5,
            log,
            time,
            sourceName: currentBossDef.name,
            targetName: "Player",
          });

          playerHP -= damageDealt;
        });
        // --- END CRITICAL CHANGE ---

        bossNextAttackTime = time + bossAttackInterval;
      }

      // 3. Check for Player Abilities
      // Find a random unlocked and trained ability to cast
      const castableAbilityId = Object.keys(abilities).find((id) => {
        const state = abilities[id];
        const def = ABILITY_DATA[id];
        return (
          state.unlocked &&
          state.isTraining &&
          time >= (abilityNextCastTime[id] || 0) &&
          def.cooldown > 0
        );
      });

      if (castableAbilityId) {
        const abilityDef = ABILITY_DATA[castableAbilityId];

        log.push({
          time,
          message: `Player uses ${abilityDef.name}!`,
          type: "player",
          value: abilityDef.name,
        });

        // --- CRITICAL CHANGE: Loop over effects array for Player Ability ---
        abilityDef.effects.forEach((effect) => {
          const { damageDealt } = processAbilityEffect({
            effect,
            baseDamage: playerBaseDamage,
            targetStats: bossResistanceStats, // Target's resistance stats
            critChance: playerCritChance,
            critDamage: playerCritDamage,
            log,
            time,
            sourceName: "Player",
            targetName: currentBossDef.name,
          });

          bossHP -= damageDealt;
        });
        // --- END CRITICAL CHANGE ---

        // Set cooldown
        abilityNextCastTime[castableAbilityId] = time + abilityDef.cooldown;
      }

      // Advance time by a small step
      const nextEventTime = Math.min(
        playerNextAttackTime,
        bossNextAttackTime,
        ...Object.keys(abilityNextCastTime)
          .filter(
            (id) => abilities[id].unlocked && abilities[id].isTraining
          )
          .map((id) => abilityNextCastTime[id])
      );

      // Using a small step size to ensure the battle ends precisely at event times.
      const step = Math.min(
        0.1, // Max step size
        Math.max(0, nextEventTime - time), // Time until the next event
        battleDuration - time // Time until battle timeout
      );

      // Ensure step is positive, otherwise default to a small tick or break if time is up
      if (step > 0) {
        time += step;
      } else if (nextEventTime === Infinity && time < battleDuration) {
        time += 1; // Default step if nothing is happening
      } else {
        break; // Stop if time is up or no progress can be made
      }
    }

    // 4. Determine Winner and Log Result
    let winner: "player" | "boss";
    let resultMessage: string;

    if (playerHP <= 0) {
      winner = "boss";
      resultMessage = "Player was defeated.";
    } else if (bossHP <= 0) {
      winner = "player";
      resultMessage = `Boss vanquished in ${time.toFixed(1)}s!`;
    } else {
      // Time ran out
      winner = "boss"; // Treat timeout as a loss
      resultMessage = `Time ran out, boss escaped (Boss HP remaining: ${bossHP.toFixed(0)})`;
    }

    log.push({
      time: time < battleDuration ? time : battleDuration,
      message: resultMessage,
      type: "result",
      value: winner === "player" ? "Win" : "Loss",
    });

    return { log, winner, bossId };
  };

  // =========================================================
  // GAME LOGIC TICK & ACTIONS
  // =========================================================

  // ... [tickGame, updateJobExp, updateSkillExp, unlockAbilities, battleBoss, etc. omitted for brevity] ...
  // Full implementation of remaining logic would be here.

  // 1. Core Game Loop (Tick)
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prev) => {
        const now = Date.now();
        const delta = (now - prev.lastTickTime) / 1000; // Delta in seconds

        if (delta > 0) {
          // Placeholder for the full tick logic
          // A real implementation would:
          // 1. Update Job EXP based on delta
          // 2. Update Skill EXP based on delta
          // 3. Update Ability EXP based on delta
          // 4. Unlock new abilities if conditions are met
        }

        return { ...prev, lastTickTime: now };
      });
    }, 1000); // Tick every 1 second

    return () => clearInterval(interval);
  }, []);

  // 2. Actions (Simplified Stubs)
  const setTab = (tab: GameState["activeTab"]) =>
    setGameState((prev) => ({ ...prev, activeTab: tab }));

  const toggleJobActive = useCallback((jobId: string) => {
    setGameState((prev) => {
      const job = prev.jobs[jobId];
      if (!job) return prev;

      let activeCount = Object.values(prev.jobs).filter((j) => j.isActive)
        .length;
      const willActivate = !job.isActive;
      let newJobs = { ...prev.jobs };

      if (willActivate) {
        if (activeCount >= maxLimits.maxActiveJobs) {
          // Find the oldest active job to deactivate
          const oldestJobId = Object.values(newJobs)
            .filter((j) => j.isActive)
            .sort((a, b) => a.lastActiveTime - b.lastActiveTime)[0].id;

          newJobs[oldestJobId] = {
            ...newJobs[oldestJobId],
            isActive: false,
            lastActiveTime: 0,
          };
        }
        // Activate the new job
        newJobs[jobId] = {
          ...job,
          isActive: true,
          lastActiveTime: Date.now(),
        };
      } else {
        // Deactivate
        newJobs[jobId] = { ...job, isActive: false, lastActiveTime: 0 };
      }

      return { ...prev, jobs: newJobs };
    });
  }, [maxLimits.maxActiveJobs]);

  const toggleSkillActive = useCallback((skillId: string) => {
    setGameState((prev) => {
      const skill = prev.skills[skillId];
      if (!skill) return prev;

      let activeCount = Object.values(prev.skills).filter((s) => s.isActive)
        .length;
      const willActivate = !skill.isActive;
      let newSkills = { ...prev.skills };

      if (willActivate) {
        if (activeCount >= maxLimits.maxSkills) {
          showAlert(
            `You can only train ${maxLimits.maxSkills} skills simultaneously.`
          );
          return prev;
        }
        newSkills[skillId] = { ...skill, isActive: true };
      } else {
        newSkills[skillId] = { ...skill, isActive: false };
      }

      return { ...prev, skills: newSkills };
    });
  }, [maxLimits.maxSkills, showAlert]);

  const toggleAbilityTraining = useCallback((abilityId: string) => {
    setGameState((prev) => {
      const ability = prev.abilities[abilityId];
      if (!ability || !ability.unlocked) return prev;

      let trainingCount = Object.values(prev.abilities).filter(
        (a) => a.isTraining
      ).length;
      const willTrain = !ability.isTraining;
      let newAbilities = { ...prev.abilities };

      if (willTrain) {
        if (trainingCount >= maxLimits.maxAbilities) {
          showAlert(
            `You can only train ${maxLimits.maxAbilities} abilities simultaneously.`
          );
          return prev;
        }
        newAbilities[abilityId] = { ...ability, isTraining: true };
      } else {
        newAbilities[abilityId] = { ...ability, isTraining: false };
      }

      return { ...prev, abilities: newAbilities };
    });
  }, [maxLimits.maxAbilities, showAlert]);

  const battleBoss = useCallback(() => {
    const result = simulateBattle(
      gameState.currentBossId,
      playerStats,
      gameState.abilities
    );

    setGameState((prev) => {
      const prevProgress = prev.bossProgress[result.bossId] || {
        defeated: 0,
        lastBattleLog: [],
      };
      const defeated =
        result.winner === "player" ? prevProgress.defeated + 1 : prevProgress.defeated;

      const newProgress = {
        ...prevProgress,
        defeated,
        lastBattleLog: result.log,
      };

      const newState = {
        ...prev,
        bossProgress: {
          ...prev.bossProgress,
          [result.bossId]: newProgress,
        },
      };

      if (result.winner === "player") {
        const goldGained = currentBossData.baseHp / 10; // Simple gold formula
        showAlert(
          `Victory! Defeated ${currentBossData.name} and gained ${goldGained.toFixed(2)} gold.`
        );
        newState.gold += goldGained;
      } else {
        showAlert(`Defeat! ${currentBossData.name} was too strong.`);
      }

      return newState;
    });
  }, [gameState.currentBossId, playerStats, gameState.abilities, showAlert]);

  const buyAscensionUpgrade = useCallback(
    (upgradeId: AscensionUpgradeId) => {
      const upgradeDef = ASCENSION_UPGRADES.find((u) => u.id === upgradeId);
      if (!upgradeDef) return;

      const currentLevel = gameState.permanentUpgrades[upgradeId] || 0;
      if (currentLevel >= upgradeDef.maxLevel) {
        showAlert(`Error: ${upgradeDef.name} is already max level.`);
        return;
      }

      const cost = upgradeDef.cost(currentLevel);
      if (gameState.ascensionPoints < cost) {
        showAlert(
          `Error: Not enough AP. Requires ${cost} AP (You have ${gameState.ascensionPoints} AP).`
        );
        return;
      }

      setGameState((prev) => {
        const newState = { ...prev };
        newState.ascensionPoints -= cost;
        newState.permanentUpgrades = {
          ...prev.permanentUpgrades,
          [upgradeId]: currentLevel + 1,
        };
        showAlert(
          `Purchased ${upgradeDef.name} Lv. ${currentLevel + 1} for ${cost} AP!`
        );
        return newState;
      });
    },
    [gameState.ascensionPoints, gameState.permanentUpgrades, showAlert]
  );

  // 7. Ascend
  const ascend = useCallback(() => {
    const currentBossData = BOSS_DATA[gameState.currentBossId];
    const currentBossDefeats =
      gameState.bossProgress[gameState.currentBossId]?.defeated || 0;
    const pointsPerDefeat = currentBossData?.ascensionPoints || 0;
    const pendingPoints = currentBossDefeats * pointsPerDefeat;

    if (pendingPoints === 0) {
      showAlert("You must defeat the current boss at least once to Ascend.");
      return;
    }

    const newGameState: GameState = {
      ...INITIAL_GAME_STATE, // Reset all job/skill/ability progress
      ascensionPoints: gameState.ascensionPoints + pendingPoints,
      permanentUpgrades: gameState.permanentUpgrades, // Keep permanent upgrades
      lastTickTime: Date.now(),
      // Keep the current boss ID to immediately start fighting it again
      currentBossId: gameState.currentBossId,
    };

    setGameState(newGameState);
    showAlert(`ASCENDED! Gained ${pendingPoints} AP. Progress reset.`);
  }, [gameState, showAlert]);

  const currentBossData = BOSS_DATA[gameState.currentBossId];
  const tabs = INITIAL_GAME_STATE.activeTab;

  // --- Return values ---\
  return {
    gameState,
    alert,
    maxLimits,
    isAscensionVisible,
    tabs,
    playerStats,
    currentBossData,
    setTab,
    toggleJobActive,
    toggleSkillActive,
    toggleAbilityTraining,
    battleBoss,
    buyAscensionUpgrade,
    ascend,
  };
};

