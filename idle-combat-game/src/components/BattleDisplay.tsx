// src/components/BattleDisplay.tsx
// Real-time battle display with HP bars, abilities, and battle log

import React from "react";
import type { BattleState } from "../types/game";
import { STAT_MAP } from "../core/data";
import { StatValue } from "../types/game";
import { FaHeart, FaCrosshairs, FaShieldAlt, FaTrophy, FaBolt } from "react-icons/fa";
import { GiCrossedSwords, GiBroadsword, GiFireball } from "react-icons/gi";

interface BattleDisplayProps {
  battleState: BattleState;
  closeBattle: () => void;
}

const BattleDisplay: React.FC<BattleDisplayProps> = ({ battleState, closeBattle }) => {
  const playerHpPercent = (battleState.playerHp / battleState.playerMaxHp) * 100;
  const bossHpPercent = (battleState.bossHp / battleState.bossMaxHp) * 100;

  // Get icon for damage type
  const getDamageIcon = (damageType: string) => {
    switch (damageType) {
      case "Physical":
        return GiBroadsword;
      case "Magic":
        return GiFireball;
      default:
        return GiCrossedSwords;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-rose-500 to-orange-500"></div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Battle in Progress</h2>
          <p className="text-sm sm:text-base text-white/70 mt-2">
            Time: {battleState.battleTime.toFixed(1)}s
          </p>
        </div>
      </div>

      {/* Main Battle Card */}
      <div className="rounded-2xl bg-slate-800/50 backdrop-blur-sm p-7 sm:p-8 space-y-6">
        {/* Player Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-teal-400 flex items-center gap-2">
              <FaHeart className="h-4 w-4" />
              Player
            </h3>
            <span className="text-sm font-mono text-white">
              {Math.ceil(battleState.playerHp)} / {battleState.playerMaxHp} HP
            </span>
          </div>
          
          {/* Player HP Bar */}
          <div className="relative h-6 w-full overflow-hidden rounded-lg bg-slate-700/50 border border-teal-500/30">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-teal-600 transition-all duration-300"
              style={{ width: `${playerHpPercent}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white drop-shadow">
                {playerHpPercent.toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Player Abilities */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {battleState.playerAbilities.length > 0 ? (
              battleState.playerAbilities.map((ability, index) => {
                const cooldownPercent = Math.max(0, (1 - ability.cooldown / ability.maxCooldown) * 100);
                const isReady = ability.cooldown <= 0;
                const DamageIcon = getDamageIcon(ability.damageType);
                
                return (
                  <div
                    key={index}
                    className={`rounded-lg border p-3 transition-all ${
                      isReady
                        ? "border-teal-500/50 bg-teal-500/10"
                        : "border-slate-600/30 bg-slate-700/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <DamageIcon className={`h-4 w-4 ${isReady ? "text-teal-400" : "text-slate-500"}`} />
                        <span className={`text-sm font-semibold ${isReady ? "text-teal-300" : "text-slate-400"}`}>
                          {ability.name}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-slate-400">
                        {isReady ? "Ready!" : `${ability.cooldown.toFixed(1)}s`}
                      </span>
                    </div>
                    {/* Cooldown Bar */}
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-700/50">
                      <div
                        className={`h-full transition-all duration-100 ${
                          isReady
                            ? "bg-gradient-to-r from-teal-400 to-teal-600"
                            : "bg-gradient-to-r from-slate-500 to-slate-600"
                        }`}
                        style={{ width: `${cooldownPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-slate-500 text-sm col-span-full">
                No abilities equipped
              </div>
            )}
          </div>
        </div>

        {/* VS Divider */}
        <div className="flex items-center justify-center">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
          <div className="px-4 py-2 rounded-full bg-slate-700/50 border border-slate-600">
            <GiCrossedSwords className="h-5 w-5 text-rose-400" />
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
        </div>

        {/* Boss Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-rose-400 flex items-center gap-2">
              <FaCrosshairs className="h-4 w-4" />
              {battleState.bossName}
            </h3>
            <span className="text-sm font-mono text-white">
              {Math.ceil(battleState.bossHp)} / {battleState.bossMaxHp} HP
            </span>
          </div>
          
          {/* Boss HP Bar */}
          <div className="relative h-6 w-full overflow-hidden rounded-lg bg-slate-700/50 border border-rose-500/30">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-300"
              style={{ width: `${bossHpPercent}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white drop-shadow">
                {bossHpPercent.toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Boss Abilities */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {battleState.bossAbilities.map((ability, index) => {
              const cooldownPercent = Math.max(0, (1 - ability.cooldown / ability.maxCooldown) * 100);
              const isReady = ability.cooldown <= 0;
              const DamageIcon = getDamageIcon(ability.damageType);
              
              return (
                <div
                  key={index}
                  className={`rounded-lg border p-3 transition-all ${
                    isReady
                      ? "border-rose-500/50 bg-rose-500/10"
                      : "border-slate-600/30 bg-slate-700/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <DamageIcon className={`h-4 w-4 ${isReady ? "text-rose-400" : "text-slate-500"}`} />
                      <span className={`text-sm font-semibold ${isReady ? "text-rose-300" : "text-slate-400"}`}>
                        {ability.name}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      {isReady ? "Ready!" : `${ability.cooldown.toFixed(1)}s`}
                    </span>
                  </div>
                  {/* Cooldown Bar */}
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-700/50">
                    <div
                      className={`h-full transition-all duration-100 ${
                        isReady
                          ? "bg-gradient-to-r from-rose-400 to-rose-600"
                          : "bg-gradient-to-r from-slate-500 to-slate-600"
                      }`}
                      style={{ width: `${cooldownPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Boss Stats Panel (Minimal) */}
          <div className="mt-4 p-4 rounded-lg bg-slate-700/30 border border-slate-600/20">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Boss Stats</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {([StatValue.STR, StatValue.INT, StatValue.TGH, StatValue.FRT] as const).map((statId) => {
                const statData = STAT_MAP[statId];
                const StatIcon = statData.icon;
                return (
                  <div key={statId} className="flex items-center gap-2">
                    <StatIcon className="h-3 w-3 text-slate-400" />
                    <span className="text-xs text-slate-300 font-mono">
                      {battleState.bossStats[statId]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Battle Log */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Battle Log</h3>
        <div className="rounded-xl bg-slate-800/50 backdrop-blur-sm p-4 max-h-64 overflow-y-auto">
          <div className="space-y-1.5 font-mono text-sm">
            {[...battleState.log].reverse().slice(0, 20).map((entry, index) => (
              <div
                key={index}
                className={`p-2.5 rounded-lg ${
                  entry.type === "result"
                    ? entry.value === "Win"
                      ? "bg-teal-500/10 text-teal-400 font-semibold border-l-2 border-teal-500"
                      : "bg-rose-500/10 text-rose-400 font-semibold border-l-2 border-rose-500"
                    : entry.type === "player"
                    ? "text-slate-300 bg-slate-700/30"
                    : "text-slate-400 bg-slate-700/20"
                }`}
              >
                <span className="text-slate-500 text-xs">[{entry.time.toFixed(1)}s]</span>{" "}
                <span>{entry.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Post-Battle Results Modal */}
      {battleState.result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl">
            {/* Header */}
            <div className={`p-6 rounded-t-2xl ${
              battleState.result.won
                ? "bg-gradient-to-r from-teal-500/20 to-teal-600/20 border-b border-teal-500/30"
                : "bg-gradient-to-r from-rose-500/20 to-rose-600/20 border-b border-rose-500/30"
            }`}>
              <h2 className={`text-3xl font-bold text-center ${
                battleState.result.won ? "text-teal-300" : "text-rose-300"
              }`}>
                {battleState.result.won ? "🎉 Victory!" : "💀 Defeat"}
              </h2>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="text-center text-white/80 text-sm">
                Battle Time: <span className="font-mono font-semibold text-white">{battleState.battleTime.toFixed(1)}s</span>
              </div>

              {battleState.result.won ? (
                <>
                  {/* Rewards */}
                  <div className="rounded-xl bg-teal-500/10 border border-teal-500/30 p-5">
                    <h3 className="text-sm font-semibold text-teal-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FaTrophy className="h-4 w-4" />
                      Rewards
                    </h3>
                    <div className="flex items-center justify-center gap-3">
                      <FaBolt className="h-6 w-6 text-purple-400" />
                      <span className="text-2xl font-bold text-white">
                        +{battleState.result.ascensionPoints}
                      </span>
                      <span className="text-sm text-slate-400">Potential AP</span>
                    </div>
                    <p className="text-xs text-center text-slate-500 mt-2">
                      Ascend to claim your points!
                    </p>
                  </div>

                  {/* Next Boss Unlocked */}
                  {battleState.result.nextBossUnlocked && (
                    <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-5 text-center">
                      <p className="text-amber-300 font-semibold mb-1">
                        🔓 New Boss Unlocked!
                      </p>
                      <p className="text-white text-lg font-bold">
                        {battleState.result.nextBossName}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-slate-300">
                  <p className="mb-2">Your HP reached zero!</p>
                  <p className="text-sm text-slate-400">Train your abilities and try again.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-700">
              <button
                onClick={closeBattle}
                className="w-full rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 py-3 text-base font-semibold text-white hover:brightness-110 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleDisplay;

