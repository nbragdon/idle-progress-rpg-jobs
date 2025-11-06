// src/core/gameCalculations.ts

import { AscensionUpgradeIdValue } from "../types/data";
import type { GameState } from "../types/game";
import {
    INITIAL_MAX_ACTIVE_JOBS,
    INITIAL_MAX_ACTIVE_SKILLS,
    INITIAL_MAX_ACTIVE_ABILITIES,
} from "./constants";

/**
 * Calculates the maximum number of jobs the player can have active.
 * It combines the base constant with the level of the 'maxJobs' permanent upgrade.
 */
export const getMaxActiveJobs = (state: GameState): number => {
    const maxJobsUpgradeLevel = state.permanentUpgrades[AscensionUpgradeIdValue.maxActiveJobs] || 0;
    return INITIAL_MAX_ACTIVE_JOBS + maxJobsUpgradeLevel;
};

/**
 * Calculates the maximum number of skills the player can train.
 * It combines the base constant with the level of the 'maxSkills' permanent upgrade.
 */
export const getMaxActiveSkills = (state: GameState): number => {
    const maxSkillsUpgradeLevel = state.permanentUpgrades[AscensionUpgradeIdValue.maxSkills] || 0;
    return INITIAL_MAX_ACTIVE_SKILLS + maxSkillsUpgradeLevel;
};

/**
 * Calculates the maximum number of abilities the player can train.
 * It combines the base constant with the level of the 'maxAbilities' permanent upgrade.
 */
export const getMaxActiveAbilities = (state: GameState): number => {
    const maxAbilitiesUpgradeLevel = state.permanentUpgrades[AscensionUpgradeIdValue.maxAbilities] || 0;
    return INITIAL_MAX_ACTIVE_ABILITIES + maxAbilitiesUpgradeLevel;
};