// src/components/BossTab.tsx - CLEAN REDESIGN

import React from "react";
import type { GameState, BossProgress } from "../types/game";
import { GiBossKey, GiCrossedSwords } from "react-icons/gi";
import { FaHeart, FaBolt, FaTrophy } from "react-icons/fa";
import type { BossDefinition } from "../types/data";
import { STAT_MAP } from "../core/data";
import { calculateMaxHP } from "../core/combatSystem";

interface BossTabProps {
  bossData: BossDefinition | undefined;
  bossProgress: GameState["bossProgress"];
  startBattle: () => void;
}

const BossTab: React.FC<BossTabProps> = ({
  bossData,
  bossProgress,
  startBattle,
}) => {
  if (!bossData) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-rose-500 to-orange-500"></div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Boss Battle</h2>
            <p className="text-sm sm:text-base text-white/70 mt-2">
              Challenge the current nemesis
            </p>
          </div>
        </div>

        <div className="text-center py-16 px-8">
          <GiBossKey className="w-20 h-20 mx-auto mb-6 text-rose-400/50" />
          <h3 className="text-2xl font-bold text-white mb-3">No Boss Available</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            You have defeated the final boss! Consider{" "}
            <span className="font-semibold text-purple-400">Ascending</span> to start a
            new, more challenging run.
          </p>
        </div>
      </div>
    );
  }

  const currentProgress: BossProgress = bossProgress[bossData.id] || {
    defeated: 0,
    lastBattleLog: [],
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-rose-500 to-orange-500"></div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Boss Battle</h2>
          <p className="text-sm sm:text-base text-white/70 mt-2">
            Challenge the current nemesis
          </p>
        </div>
      </div>

      {/* Main Boss Card */}
      <div className="rounded-2xl bg-slate-800/50 backdrop-blur-sm p-8">
        {/* Boss Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-rose-500/20 flex items-center justify-center">
              <GiBossKey className="h-8 w-8 text-rose-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-1">{bossData.name}</h3>
              <p className="text-sm text-slate-400 uppercase tracking-wider">Current Nemesis</p>
            </div>
          </div>
          <div className="rounded-lg bg-rose-500/10 px-4 py-2 border border-rose-500/20">
            <p className="text-xs text-rose-400 uppercase tracking-wider">Tier {Math.max(1, Math.round(bossData.baseDamage / 10))}</p>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {/* Health */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FaHeart className="h-4 w-4 text-rose-400" />
              <p className="text-xs text-slate-400 uppercase tracking-wider">Max HP</p>
            </div>
            <p className="text-xl font-bold text-white font-mono">{calculateMaxHP(bossData.stats.CON)}</p>
          </div>

          {/* Defeats */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FaTrophy className="h-4 w-4 text-amber-400" />
              <p className="text-xs text-slate-400 uppercase tracking-wider">Defeated</p>
            </div>
            <p className="text-xl font-bold text-white font-mono">{currentProgress.defeated}</p>
          </div>

          {/* Reward */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FaBolt className="h-4 w-4 text-purple-400" />
              <p className="text-xs text-slate-400 uppercase tracking-wider">Reward</p>
            </div>
            <p className="text-xl font-bold text-white font-mono">{bossData.ascensionPoints} AP</p>
          </div>
        </div>

        {/* Boss Stats */}
        <div className="mb-6 p-5 rounded-xl bg-slate-700/30 border border-slate-600/20">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-4">Boss Stats</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {Object.entries(bossData.stats).map(([statId, value]) => {
              const statInfo = STAT_MAP[statId as keyof typeof bossData.stats];
              const StatIcon = statInfo.icon;
              
              // Format display value
              let displayValue = value.toString();
              if (statId === 'CRIT_C') {
                displayValue = `${(value * 100).toFixed(1)}%`;
              } else if (statId === 'CRIT_D') {
                displayValue = `${(value * 100).toFixed(0)}%`;
              }
              
              return (
                <div
                  key={statId}
                  className="flex flex-col items-center p-2 rounded-lg bg-slate-800/50"
                  title={statInfo.name}
                >
                  <StatIcon className="h-4 w-4 text-slate-400 mb-1" />
                  <p className="text-xs text-slate-500 mb-1">{statId}</p>
                  <p className="text-sm font-bold text-white">{displayValue}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Boss Ability - Subtle design */}
        <div className="mb-8 p-5 rounded-xl bg-slate-700/30 border border-slate-600/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs text-rose-400 uppercase tracking-wider mb-2">Boss Ability</p>
              <p className="text-lg font-semibold text-white mb-3">{bossData.bossAbility.name}</p>
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-1.5 text-xs bg-rose-500/10 text-rose-400 px-3 py-1 rounded-full">
                  <span className="font-mono font-semibold">{bossData.bossAbility.effects[0].baseDamage}</span>
                  <span>Damage</span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs bg-teal-500/10 text-teal-400 px-3 py-1 rounded-full">
                  <span className="font-mono font-semibold">{bossData.bossAbility.cooldown}s</span>
                  <span>Cooldown</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Battle Button */}
        <button
          onClick={startBattle}
          className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 py-4 text-lg font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-200"
        >
          ⚔️ Start Battle
        </button>
      </div>

      {/* Battle Log */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Last Battle Log</h3>
        <div className="rounded-xl bg-slate-800/50 backdrop-blur-sm p-4 max-h-64 overflow-y-auto">
          {currentProgress.lastBattleLog.length > 0 ? (
            <div className="space-y-1.5 font-mono text-sm">
              {[...currentProgress.lastBattleLog].reverse().map((entry, index) => (
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
          ) : (
            <p className="text-slate-500 text-center py-12 text-sm">
              No battle history yet. Start a battle to see the combat log!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BossTab;
