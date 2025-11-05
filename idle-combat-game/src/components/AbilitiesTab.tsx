// src/components/AbilitiesTab.tsx - REFACTORED

import React from "react";
import type { GameState, PlayerStats } from "../types/game";
import { ABILITY_DATA, STAT_MAP } from "../core/data";
import { calculateExpNeeded } from "../core/utils";
import { ABILITY_LEVEL_REDUCTION, MAX_ABILITY_LEVEL } from "../core/constants";
import type { AbilityDefinition } from "../types/data";

interface AbilitiesTabProps {
  abilities: GameState["abilities"];
  maxActiveAbilities: number;
  playerStats: PlayerStats;
  toggleAbilityTraining: (abilityId: string) => void;
}

const AbilitiesTab: React.FC<AbilitiesTabProps> = ({
  abilities,
  maxActiveAbilities,
  playerStats,
  toggleAbilityTraining,
}) => {
  const abilityIds = Object.keys(ABILITY_DATA);
  const activeCount = Object.values(abilities).filter(
    (a) => a.isTraining
  ).length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-indigo-300">Abilities 🗡️</h2>
      {" "}
      <p className="text-gray-400">
        Abilities are active skills used in **Boss Battles**. Leveling
        them reduces their **cooldown**. You can train{" "}
        <span className="font-bold text-yellow-400">{maxActiveAbilities}</span>{" "}
        at a time. ({activeCount} training)      {" "}
      </p>
      {" "}
      <div className="space-y-4">
        {" "}
        {abilityIds.map((abilityId) => {
          const ability = abilities[abilityId];
          const data = ABILITY_DATA[abilityId] as AbilityDefinition;

          const isUnlocked = ability.unlocked;
          const conditionMet =
            playerStats[data.unlockCondition.stat] >=
            data.unlockCondition.required;
          const unlockStatus = `Requires ${STAT_MAP[data.unlockCondition.stat].name
            } (${data.unlockCondition.required}) / Current: ${playerStats[
              data.unlockCondition.stat
            ].toFixed(2)}`;

          const expNeeded =
            isUnlocked && ability.level < MAX_ABILITY_LEVEL
              ? calculateExpNeeded(ability.level)
              : 1;
          const progressPercent =
            isUnlocked && ability.level < MAX_ABILITY_LEVEL
              ? (ability.exp / expNeeded) * 100
              : 0;
          const reduction = ability.level * ABILITY_LEVEL_REDUCTION;
          const effectiveCooldown = data.cooldown * (1 - reduction);

          // Determine the base card class
          const cardClass = ability.isTraining
            ? "ability-card-training"
            : "ability-card-inactive";

          // Determine the button class
          let buttonClass = "ability-button-base";
          if (!isUnlocked || ability.level >= MAX_ABILITY_LEVEL) {
            buttonClass += " ability-button-disabled";
          } else {
            buttonClass += ability.isTraining
              ? " ability-button-training"
              : " ability-button-train";
          }

          return (
            <div key={abilityId} className={`ability-card-base ${cardClass}`}>
              {" "}
              <div className="flex justify-between items-start">
                {" "}
                <div className="flex items-center space-x-3">
                  {" "}
                  <data.icon className="w-6 h-6 text-pink-400" />
                  {" "}
                  <div>
                    {" "}
                    <h3 className="text-xl font-semibold text-white">
                      {data.name} (Lvl {ability.level})
                    </h3>
                    {" "}
                    <p className="text-sm text-gray-400">
                      Dmg Mult: x{data.effects[0].damageMultiplier} | Cooldown:{" "}
                      {effectiveCooldown.toFixed(2)}s (Base: {data.cooldown}s)
                    </p>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <button
                  onClick={() => toggleAbilityTraining(abilityId)}
                  disabled={!isUnlocked || ability.level >= MAX_ABILITY_LEVEL}
                  className={buttonClass}
                >
                  {" "}
                  {isUnlocked
                    ? ability.isTraining
                      ? "Stop Training"
                      : "Train"
                    : "Locked"}
                  {" "}
                </button>
                {" "}
              </div>
              {/* Footer: EXP or Unlock Status */}             {" "}
              <div className="mt-3">
                {" "}
                {!isUnlocked ? (
                  <p
                    className={`text-sm ${conditionMet ? "text-green-400" : "text-red-400"
                      }`}
                  >
                    🔓 {unlockStatus}                 {" "}
                  </p>
                ) : ability.level >= MAX_ABILITY_LEVEL ? (
                  <p className="text-sm text-green-400">MAX LEVEL ACHIEVED!</p>
                ) : (
                  <div>
                    {" "}
                    <div className="w-full bg-gray-600 rounded-full h-2.5 mt-1">
                      {" "}
                      <div
                        className="bg-pink-500 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, progressPercent)}%` }}
                      />
                      {" "}
                    </div>
                    {" "}
                    <span className="text-xs text-gray-300 mt-1 block">
                      EXP: {ability.exp.toFixed(2)} / {expNeeded}
                    </span>
                    {" "}
                  </div>
                )}
                {" "}
              </div>
              {" "}
            </div>
          );
        })}
        {" "}
      </div>
      {" "}
    </div>
  );
};

export default AbilitiesTab;
