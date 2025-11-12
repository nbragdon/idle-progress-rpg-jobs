// src/components/AbilitiesTab.tsx - REFACTORED WITH MODAL

import React, { useState } from "react";
import type { GameState, PlayerStats } from "../types/game";
import { ABILITY_DATA, STAT_MAP } from "../core/data";
import { calculateLevelFromExp } from "../core/utils";
import { MAX_ABILITY_LEVEL } from "../core/constants";
import type { AbilityDefinition } from "../types/data";
import Modal from "./Modal";
import { getEffectiveBaseDamage, getEffectiveCooldown } from "../core/combatSystem";
import { calculateAbilityExpPerSecond } from "../core/expCalculations";

interface AbilitiesTabProps {
  abilities: GameState["abilities"];
  maxActiveAbilities: number;
  maxBattleAbilities: number;
  playerStats: PlayerStats;
  gameState: GameState;
  toggleAbilityTraining: (abilityId: string) => void;
  toggleAbilityBattle: (abilityId: string) => void;
}

const AbilitiesTab: React.FC<AbilitiesTabProps> = ({
  abilities,
  maxActiveAbilities,
  maxBattleAbilities,
  playerStats,
  gameState,
  toggleAbilityTraining,
  toggleAbilityBattle,
}) => {
  // Modal state
  const [selectedAbilityId, setSelectedAbilityId] = useState<string | null>(null);

  const abilityIds = Object.keys(ABILITY_DATA);
  const trainingCount = Object.values(abilities).filter((a) => a.isTraining).length;
  const battleCount = Object.values(abilities).filter((a) => a.isActiveBattle).length;

  // Get selected ability data for modal
  const selectedAbility = selectedAbilityId ? abilities[selectedAbilityId] : null;
  const selectedAbilityData = selectedAbilityId ? ABILITY_DATA[selectedAbilityId] as AbilityDefinition : null;
  const selectedAbilityLevel = selectedAbility ? calculateLevelFromExp(selectedAbility.exp) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-rose-500 to-orange-500"></div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Abilities</h2>
          <p className="text-sm sm:text-base text-white/70 mt-2">
            {trainingCount} / {maxActiveAbilities} training • {battleCount} / {maxBattleAbilities} battle • Click for details
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 p-7 sm:p-8 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-teal-500/20 p-3 text-teal-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-2">How Abilities Work</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              <span className="font-semibold text-blue-400">⚙️ Training</span> increases an ability's level, reducing its cooldown.{" "}
              <span className="font-semibold text-rose-400">⚔️ Battle Active</span> abilities are used automatically in boss battles.
            </p>
          </div>
        </div>
      </div>

      {/* Compact Ability Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {abilityIds.map((abilityId) => {
          const ability = abilities[abilityId];
          const data = ABILITY_DATA[abilityId] as AbilityDefinition;

          // Skip if ability not yet initialized in state
          if (!ability) return null;

          const isUnlocked = ability.unlocked;
          const conditionMet =
            playerStats[data.unlockCondition.stat] >=
            data.unlockCondition.required;

          const { level, currentLevelExp, expNeeded } = calculateLevelFromExp(ability.exp);
          const progressPercent = isUnlocked && level < MAX_ABILITY_LEVEL
            ? (currentLevelExp / expNeeded) * 100
            : 0;

          const effectiveCooldown = getEffectiveCooldown(data, level);
          const effectiveDamage = getEffectiveBaseDamage(data, level);
          const expPerSecond = calculateAbilityExpPerSecond(abilityId, gameState);

          return (
            <div
              key={abilityId}
              className={`group relative overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                !isUnlocked
                  ? "border-slate-700/50 bg-slate-800/50 opacity-60"
                  : ability.isTraining
                  ? "border-rose-400/60 bg-gradient-to-br from-rose-400/20 via-rose-400/10 to-transparent shadow-lg"
                  : "border-slate-700/50 bg-slate-800/50 hover:border-slate-600/50"
              }`}
            >
              {/* Training indicator */}
              {ability.isTraining && isUnlocked && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-400"></span>
                  </span>
                </div>
              )}

              {/* Clickable area for details */}
              <button
                onClick={() => setSelectedAbilityId(abilityId)}
                disabled={!isUnlocked}
                className="w-full p-5 text-left transition-all hover:bg-slate-800/30 disabled:cursor-not-allowed"
              >
                <div className="flex items-start gap-3 mb-3">
                  {/* Icon */}
                  <div
                    className={`rounded-xl p-2.5 transition-all ${
                      !isUnlocked
                        ? "bg-slate-700/30 text-slate-600"
                        : ability.isTraining
                        ? "bg-rose-400/20 text-rose-400"
                        : "bg-slate-700/30 text-slate-400"
                    }`}
                  >
                    <data.icon className="h-5 w-5" />
                  </div>

                  {/* Name & Level */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-base font-semibold truncate ${isUnlocked ? "text-white" : "text-slate-600"}`}>
                        {data.name}
                      </h3>
                      {isUnlocked && (
                        <span className="rounded-full border border-slate-600/50 bg-slate-700/50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300 shrink-0">
                          {level}
                        </span>
                      )}
                    </div>
                    
                    {/* Damage & Cooldown - compact */}
                    {isUnlocked ? (
                      <div className="flex items-center gap-2">
                        <div className="text-[10px] font-semibold text-rose-600 bg-rose-500/15 px-2 py-0.5 rounded">
                          {Math.round(effectiveDamage)} DMG
                        </div>
                        <div className="text-[10px] font-semibold text-teal-600 bg-teal-500/15 px-2 py-0.5 rounded">
                          {effectiveCooldown.toFixed(1)}s CD
                        </div>
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-600">
                        Requires {STAT_MAP[data.unlockCondition.stat].name} {data.unlockCondition.required}
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                {isUnlocked && (
                  <div className="space-y-1.5">
                    {level < MAX_ABILITY_LEVEL && (
                      <div className="text-[10px] font-medium text-center mb-0.5">
                        <span className={ability.isTraining ? "text-rose-400" : "text-slate-500"}>
                          +{expPerSecond.toFixed(1)} XP/s
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[10px] font-medium text-white/60">
                      <span>{level >= MAX_ABILITY_LEVEL ? "MAX" : `${progressPercent.toFixed(0)}%`}</span>
                      {level < MAX_ABILITY_LEVEL && (
                        <span>{currentLevelExp.toFixed(0)} / {expNeeded}</span>
                      )}
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-700/50">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          level >= MAX_ABILITY_LEVEL
                            ? "bg-gradient-to-r from-amber-500 to-amber-600"
                            : ability.isTraining
                            ? "bg-gradient-to-r from-rose-400 to-rose-600"
                            : "bg-slate-600/60"
                        }`}
                        style={{ width: `${level >= MAX_ABILITY_LEVEL ? 100 : Math.min(100, progressPercent)}%` }}
                      />
                    </div>
                  </div>
                )}
              </button>

              {/* Action Buttons */}
              <div className="px-5 pb-4 space-y-2">
                {/* Training Button */}
                <button
                  onClick={() => toggleAbilityTraining(abilityId)}
                  disabled={!isUnlocked || level >= MAX_ABILITY_LEVEL}
                  className={`w-full rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                    !isUnlocked || level >= MAX_ABILITY_LEVEL
                      ? "cursor-not-allowed border border-slate-600/30 bg-slate-700/20 text-slate-600"
                      : ability.isTraining
                      ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white hover:brightness-110"
                      : "bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:brightness-110"
                  }`}
                >
                  {!isUnlocked
                    ? "🔒 Locked"
                    : level >= MAX_ABILITY_LEVEL
                    ? "✓ Maxed"
                    : ability.isTraining
                    ? "⚙️ Training"
                    : "⚙️ Train"}
                </button>

                {/* Battle Button */}
                <button
                  onClick={() => toggleAbilityBattle(abilityId)}
                  disabled={!isUnlocked}
                  className={`w-full rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                    !isUnlocked
                      ? "cursor-not-allowed border border-slate-600/30 bg-slate-700/20 text-slate-600"
                      : ability.isActiveBattle
                      ? "bg-gradient-to-r from-rose-400 to-rose-600 text-white hover:brightness-110"
                      : "bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:brightness-110"
                  }`}
                >
                  {!isUnlocked
                    ? "🔒 Locked"
                    : ability.isActiveBattle
                    ? "⚔️ Battle Active"
                    : "⚔️ Set for Battle"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={selectedAbilityId !== null}
        onClose={() => setSelectedAbilityId(null)}
        title={selectedAbilityData?.name}
      >
        {selectedAbility && selectedAbilityData && selectedAbilityLevel && (
          <div className="space-y-6">
            {/* Header with icon and level */}
            <div className="flex items-start gap-4">
              <div className="rounded-2xl p-4 bg-rose-400/20 text-rose-400">
                <selectedAbilityData.icon className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="rounded-full border border-slate-600/50 bg-slate-700/50 px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-slate-300">
                    Level {selectedAbilityLevel.level} / {MAX_ABILITY_LEVEL}
                  </span>
                  {selectedAbility.isTraining && (
                    <span className="rounded-full px-3 py-1 text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      ● Training
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-slate-300">
                  {selectedAbilityData.description}
                </p>
              </div>
            </div>

            {/* Combat Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4">
                <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wide mb-2">Damage</h4>
                <p className="text-2xl font-bold text-rose-300">
                  {Math.round(getEffectiveBaseDamage(selectedAbilityData, selectedAbilityLevel.level))}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedAbilityData.effects[0].damageType} damage
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Base: {selectedAbilityData.effects[0].baseDamage}
                  {selectedAbilityData.damageScaling && ` (+${(selectedAbilityData.damageScaling.value * 100).toFixed(0)}%/lvl)`}
                </p>
                <p className="text-xs text-slate-500">
                  + {selectedAbilityData.effects[0].damageType === "Physical" ? "STR" : "INT"} bonus
                </p>
              </div>

              <div className="rounded-xl border border-teal-500/40 bg-teal-500/10 p-4">
                <h4 className="text-xs font-semibold text-teal-400 uppercase tracking-wide mb-2">Cooldown</h4>
                <p className="text-2xl font-bold text-teal-300">
                  {getEffectiveCooldown(selectedAbilityData, selectedAbilityLevel.level).toFixed(1)}s
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Base: {selectedAbilityData.cooldown}s
                </p>
                {selectedAbilityData.cooldownScaling ? (
                  <p className="text-xs text-slate-500 mt-1">
                    -{selectedAbilityData.cooldownScaling.reductionPerLevels}s per {selectedAbilityData.cooldownScaling.levelsPerReduction} levels
                    <br />Min: {selectedAbilityData.cooldownScaling.minCooldown}s
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1">
                    Scales with level
                  </p>
                )}
              </div>
            </div>

            {/* Progress (if not maxed) */}
            {selectedAbilityLevel.level < MAX_ABILITY_LEVEL && (
              <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                <div className="flex items-center justify-between text-sm font-medium text-white/70 mb-2">
                  <span>Experience Progress</span>
                  <span className="text-white">{((selectedAbilityLevel.currentLevelExp / selectedAbilityLevel.expNeeded) * 100).toFixed(1)}%</span>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-700/50 mb-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-600"
                    style={{ width: `${Math.min(100, (selectedAbilityLevel.currentLevelExp / selectedAbilityLevel.expNeeded) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400">
                  {selectedAbilityLevel.currentLevelExp.toFixed(1)} / {selectedAbilityLevel.expNeeded} XP
                </p>
              </div>
            )}

            {/* Unlock Requirement */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Unlock Requirement</h4>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  selectedAbility.unlocked
                    ? "bg-teal-500/10 border-teal-500/30 text-teal-300"
                    : "bg-slate-700/30 border-slate-600/30 text-slate-400"
                }`}
              >
                <span>{selectedAbility.unlocked ? "✓" : "○"}</span>
                <span className="text-sm">
                  {STAT_MAP[selectedAbilityData.unlockCondition.stat].name} {selectedAbilityData.unlockCondition.required}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AbilitiesTab;
