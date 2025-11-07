// src/components/AbilitiesTab.tsx - REFACTORED

import React from "react";
import type { GameState, PlayerStats } from "../types/game";
import { ABILITY_DATA, STAT_MAP } from "../core/data";
import { calculateLevelFromExp } from "../core/utils";
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
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-rose-500 to-orange-500"></div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Abilities</h2>
          <p className="text-sm sm:text-base text-white/70 mt-1">
            Combat skills for boss battles • {activeCount} / {maxActiveAbilities} training
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 sm:p-7 backdrop-blur-sm">
        <p className="text-white/80 text-sm sm:text-base leading-relaxed">
          Abilities are active skills used in <span className="font-semibold text-rose-400">Boss Battles</span>.
          Leveling them reduces their <span className="font-semibold text-rose-400">cooldown</span>. 
          You can train{" "}
          <span className="font-semibold text-rose-400">{maxActiveAbilities}</span>{" "}
          at a time.
        </p>
      </div>

      <div className="grid gap-5 sm:gap-6 md:grid-cols-1">
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

          const { level, currentLevelExp, expNeeded } = calculateLevelFromExp(ability.exp);
          const progressPercent = isUnlocked && level < MAX_ABILITY_LEVEL
            ? (currentLevelExp / expNeeded) * 100
            : 0;
          const reduction = level * ABILITY_LEVEL_REDUCTION;
          const effectiveCooldown = data.cooldown * (1 - reduction);

          return (
            <div
              key={abilityId}
              className={`group relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
                !isUnlocked
                  ? "border-slate-700/50 bg-slate-800/50 opacity-60"
                  : ability.isTraining
                  ? "border-rose-400/60 bg-gradient-to-br from-rose-400/20 via-rose-400/10 to-transparent shadow-[0_35px_70px_-40px_rgba(244,114,182,0.75)]"
                  : "border-slate-700/50 bg-slate-800/50 hover:border-slate-600/50 hover:bg-slate-800/70"
              }`}
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-rose-400/20 blur-2xl transition-transform duration-500 group-hover:scale-125" />
              {/* Training indicator */}
              {ability.isTraining && isUnlocked && (
                <div className="absolute top-3 right-3">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                  </span>
                </div>
              )}

              {/* Max Level Badge */}
              {level >= MAX_ABILITY_LEVEL && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
                    MAX
                  </span>
                </div>
              )}

              <div className="relative z-10 flex items-start gap-4">
                <div
                  className={`rounded-2xl p-3.5 transition-all duration-300 ${
                    !isUnlocked
                      ? "bg-charcoal-200/20 text-charcoal-700/60"
                      : ability.isTraining
                      ? "bg-rose-500/20 text-rose-600 shadow-[0_15px_35px_-25px_rgba(231,111,81,0.45)]"
                      : "bg-charcoal-200/20 text-white/70"
                  }`}
                >
                  <data.icon className="h-7 w-7" />
                </div>

                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold tracking-tight text-white">
                      {data.name}
                    </h3>
                    <span className="rounded-full border border-charcoal-300/40 bg-charcoal-200/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/70">
                      Lvl {level}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs font-semibold">
                    <span className="rounded-full border border-rose-400/40 bg-rose-500/20 px-3 py-1 text-rose-600">
                      ×{data.effects[0].damageMultiplier} DMG
                    </span>
                    <span className="rounded-full border border-teal-500/40 bg-teal-500/20 px-3 py-1 text-teal-600">
                      {effectiveCooldown.toFixed(1)}s CD
                    </span>
                  </div>
                </div>
              </div>

              {/* Status / Progress */}
              <div className="relative z-10 mt-6 space-y-4">
                {!isUnlocked ? (
                  <div
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                      conditionMet
                        ? "border-teal-500/40 bg-teal-500/15 text-teal-700"
                        : "border-rose-400/40 bg-rose-400/15 text-rose-600"
                    }`}
                  >
                    <span className="mr-2">🔓</span>
                    {unlockStatus}
                  </div>
                ) : level >= MAX_ABILITY_LEVEL ? (
                  <div className="rounded-2xl border border-amber-400/40 bg-amber-400/15 px-4 py-3 text-center text-sm font-semibold text-amber-400">
                    ⭐ Max Level Achieved ⭐
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-medium text-white/70">
                      <span>EXP: {currentLevelExp.toFixed(1)} / {expNeeded}</span>
                      <span className="text-white">{progressPercent.toFixed(1)}%</span>
                    </div>
                    <div className="relative h-2.5 w-full overflow-hidden rounded-full border border-charcoal-300/40 bg-charcoal-200/30">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          ability.isTraining
                            ? "bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400"
                            : "bg-gradient-to-r from-charcoal-500/60 to-charcoal-400/40"
                        }`}
                        style={{ width: `${Math.min(100, progressPercent)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => toggleAbilityTraining(abilityId)}
                disabled={!isUnlocked || level >= MAX_ABILITY_LEVEL}
                className={`relative z-10 mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  !isUnlocked || level >= MAX_ABILITY_LEVEL
                    ? "cursor-not-allowed border border-charcoal-200/30 bg-charcoal-200/20 text-charcoal-700/40"
                    : ability.isTraining
                    ? "bg-gradient-to-r from-rose-400 to-rose-600 text-white shadow-[0_18px_35px_-20px_rgba(231,111,81,0.55)] hover:brightness-110"
                    : "bg-gradient-to-r from-amber-400 via-orange-500 to-teal-500 text-white shadow-[0_18px_35px_-20px_rgba(233,196,106,0.55)] hover:brightness-110"
                }`}
              >
                {!isUnlocked
                  ? "🔒 Locked"
                  : level >= MAX_ABILITY_LEVEL
                  ? "Max Level"
                  : ability.isTraining
                  ? "Stop Training"
                  : "Train"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AbilitiesTab;
