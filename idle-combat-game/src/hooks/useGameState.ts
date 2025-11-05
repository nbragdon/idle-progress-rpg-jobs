// src/hooks/useGameState.ts (Partial Update)

// ... imports ...
// ... existing useGameState code ...

export const useGameState = () => {
  // ... existing useState and useGameLogic calls ...
  const [alert, setAlert] = useState<AlertState>({
    message: "",
    visible: false,
  });

  // ... showAlert, gainJobOrSkillExperience, gainAbilityExperience, updateAbilitiesUnlock ...

  const toggleJobActive = useCallback(
    (jobId: string) => {
      setGameState((prev) => {
        const job = prev.jobs[jobId];
        if (job.level === 0 && !job.isActive) {
          showAlert(`${JOB_DATA[jobId].name} must be level 1 to be activated.`);
          return prev;
        }
        if (job.isActive) {
          return {
            ...prev,
            jobs: { ...prev.jobs, [jobId]: { ...job, isActive: false } },
          };
        }

        const activeJobs = Object.keys(prev.jobs).filter(
          (id) => prev.jobs[id].isActive
        );
        let newState = { ...prev };

        if (activeJobs.length >= maxLimits.maxActiveJobs) {
          // Find the oldest active job (simple FIFO replacement)
          // Note: Real implementation might track activation time, but we'll swap arbitrarily here
          const jobToDeactivate = activeJobs[0];
          newState.jobs = {
            ...newState.jobs,
            [jobToDeactivate]: {
              ...prev.jobs[jobToDeactivate],
              isActive: false,
            },
          };
        }
        newState.jobs = {
          ...newState.jobs,
          [jobId]: { ...job, isActive: true },
        };
        return newState;
      });
    },
    [maxLimits.maxActiveJobs, showAlert]
  );

  const toggleSkillActive = useCallback(
    (skillId: string) => {
      setGameState((prev) => {
        const skill = prev.skills[skillId];
        if (skill.level === 0 && !skill.isActive) {
          showAlert(
            `${SKILL_DATA[skillId].name} must be level 1 to be activated.`
          );
          return prev;
        }
        if (skill.isActive) {
          return {
            ...prev,
            skills: {
              ...prev.skills,
              [skillId]: { ...skill, isActive: false },
            },
          };
        }

        const activeSkills = Object.keys(prev.skills).filter(
          (id) => prev.skills[id].isActive
        );
        if (activeSkills.length >= maxLimits.maxActiveSkills) {
          showAlert(
            `You can only have ${maxLimits.maxActiveSkills} active skill${
              maxLimits.maxActiveSkills !== 1 ? "s" : ""
            }.`
          );
          return prev;
        }

        return {
          ...prev,
          skills: { ...prev.skills, [skillId]: { ...skill, isActive: true } },
        };
      });
    },
    [maxLimits.maxActiveSkills, showAlert]
  );

  const toggleAbilityTraining = useCallback(
    (abilityId: string) => {
      setGameState((prev) => {
        const ability = prev.abilities[abilityId];
        if (!ability.unlocked) return prev; // Cannot train locked ability

        if (ability.isTraining) {
          // If training, stop training
          return {
            ...prev,
            abilities: {
              ...prev.abilities,
              [abilityId]: { ...ability, isTraining: false },
            },
          };
        }

        // If not training, try to start
        const trainingAbilities = Object.keys(prev.abilities).filter(
          (id) => prev.abilities[id].isTraining
        );
        if (trainingAbilities.length >= maxLimits.maxActiveAbilities) {
          showAlert(
            `You can only train ${maxLimits.maxActiveAbilities} ability${
              maxLimits.maxActiveAbilities !== 1 ? "s" : ""
            } at once.`
          );
          return prev;
        }

        return {
          ...prev,
          abilities: {
            ...prev.abilities,
            [abilityId]: { ...ability, isTraining: true },
          },
        };
      });
    },
    [maxLimits.maxActiveAbilities, showAlert]
  );

  const buyAscensionUpgrade = useCallback(
    (upgradeId: ASCENSION_UPGRADES[number]["id"]) => {
      setGameState((prev) => {
        const upgradeData = ASCENSION_UPGRADES.find((u) => u.id === upgradeId);
        if (!upgradeData) return prev;

        const currentLevel = prev.permanentUpgrades[upgradeId] || 0;
        if (currentLevel >= upgradeData.maxLevel) {
          showAlert("This upgrade is already maxed out.");
          return prev;
        }

        const cost = upgradeData.cost(currentLevel);
        if (prev.ascensionPoints < cost) {
          showAlert("Not enough Ascension Points.");
          return prev;
        }

        const newUpgrades = {
          ...prev.permanentUpgrades,
          [upgradeId]: currentLevel + 1,
        };
        showAlert(`Purchased ${upgradeData.name}! Level ${currentLevel + 1}.`);
        return {
          ...prev,
          ascensionPoints: prev.ascensionPoints - cost,
          permanentUpgrades: newUpgrades,
          // Update Max Limits if necessary (Jobs is currently only one hardcoded limit)
          maxActiveJobs:
            upgradeId === "maxActiveJobs"
              ? prev.maxActiveJobs + 1
              : prev.maxActiveJobs,
        };
      });
    },
    [showAlert]
  );

  const ascend = useCallback(() => {
    const totalPoints =
      gameState.ascensionPoints +
      Object.values(gameState.bossProgress).reduce(
        (sum, p) =>
          sum +
          p.defeated *
            (BOSS_DATA[gameState.currentBossId]?.ascensionPoints || 0),
        0
      );

    if (totalPoints === gameState.ascensionPoints) {
      showAlert(
        "You must defeat at least one boss to gain points from ascending."
      );
      return;
    }

    const initialState = getInitialState();

    setGameState((prev) => ({
      ...initialState, // Reset almost all game state
      version: prev.version, // Keep the version
      ascensionPoints: totalPoints, // Keep and add new points
      permanentUpgrades: prev.permanentUpgrades, // Keep permanent upgrades
      // Re-initialize based on permanent upgrades (Jobs/Skills will need to be re-activated)
      maxActiveJobs: prev.maxActiveJobs,
      maxActiveSkills:
        INITIAL_MAX_ACTIVE_SKILLS + (prev.permanentUpgrades.maxSkills || 0),
      maxActiveAbilities:
        INITIAL_MAX_ACTIVE_ABILITIES +
        (prev.permanentUpgrades.maxAbilities || 0),
    }));
    showAlert(
      `Ascension complete! Gained ${
        totalPoints - gameState.ascensionPoints
      } points.`
    );
  }, [
    gameState.ascensionPoints,
    gameState.currentBossId,
    gameState.bossProgress,
    showAlert,
  ]);

  // ... end of useGameState logic ...

  return {
    // ... all existing returns ...
    toggleJobActive,
    toggleSkillActive,
    toggleAbilityTraining,
    buyAscensionUpgrade,
    ascend,
    // ...
  };
};
