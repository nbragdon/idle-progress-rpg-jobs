// src/components/BossTab.tsx - REFACTORED

import React from "react";
import type { GameState, BossProgress } from "../types/game";
import { GiBossKey, GiCrossedSwords } from "react-icons/gi";
import { FaHeart } from "react-icons/fa";
import type { BossDefinition } from "../types/data";

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
      <div className="p-8 text-center bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700">
        <GiBossKey className="w-16 h-16 mx-auto mb-4 text-red-400 animate-pulse" />
        <h2 className="text-2xl font-bold text-red-300 mb-2">No Boss Available</h2>
        <p className="text-slate-400 leading-relaxed">
          You have defeated the final boss! Consider{" "}
          <span className="font-semibold text-purple-400">Ascending</span> to start a
          new, more challenging run.
        </p>
      </div>
    );
  }
  const currentProgress: BossProgress = bossProgress[bossData.id] || {
    defeated: 0,
    lastBattleLog: [],
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-rose-500 to-orange-500"></div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Boss Battle</h2>
          <p className="text-sm sm:text-base text-white/70 mt-1">
            Challenge the current nemesis
          </p>
        </div>
      </div>

      {/* Boss Card */}
      <div className="rounded-3xl border border-charcoal-200/30 bg-charcoal-200/20 p-6 sm:p-8 backdrop-blur-md shadow-[0_35px_80px_-45px_rgba(231,111,81,0.45)] text-white">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-500">
              <GiBossKey className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-3xl font-semibold tracking-tight text-white">
                {bossData.name}
              </h3>
              <p className="text-sm font-medium uppercase tracking-wide text-white/60">Current Nemesis</p>
            </div>
          </div>
          <div className="rounded-full border border-rose-400/40 bg-rose-400/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
            Tier {bossData.baseDamage > 0 ? Math.max(1, Math.round(bossData.baseDamage / 10)) : 1}
          </div>
        </div>

        {/* Boss Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-teal-500/30 bg-teal-500/15 p-4">
            <div className="flex items-center gap-3 text-sm text-teal-600">
              <FaHeart className="h-4 w-4 text-rose-500" />
              <span>Health Points</span>
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-white font-mono">
              {bossData.baseHp}
            </p>
          </div>
          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/15 p-4">
            <div className="flex items-center gap-3 text-sm text-amber-500">
              <GiCrossedSwords className="h-4 w-4 text-orange-500" />
              <span>Base Damage</span>
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-white font-mono">
              {bossData.baseDamage}
            </p>
          </div>
        </div>

        {/* Boss Ability */}
        <div className="mt-6 rounded-2xl border border-rose-400/40 bg-rose-500/15 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-500/80">Boss Ability</p>
          <p className="mt-2 text-lg font-semibold text-white">{bossData.bossAbility.name}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
            <span className="rounded-full border border-rose-400/40 bg-rose-400/20 px-3 py-1 text-rose-600">
              ×{bossData.bossAbility.effects[0].damageMultiplier} Damage
            </span>
            <span className="rounded-full border border-teal-500/40 bg-teal-500/20 px-3 py-1 text-teal-600">
              {bossData.bossAbility.cooldown}s Cooldown
            </span>
          </div>
        </div>

        {/* Progress & Rewards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-teal-500/30 bg-teal-500/15 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-teal-600">Times Defeated</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
              {currentProgress.defeated}
            </p>
          </div>
          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/15 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-500">Reward per Victory</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
              {bossData.ascensionPoints} AP
            </p>
          </div>
        </div>

        {/* Battle Button */}
        <button
          onClick={startBattle}
          className="mt-8 w-full rounded-2xl bg-gradient-to-r from-rose-400 via-orange-500 to-amber-400 py-4 text-lg font-semibold text-white shadow-[0_25px_55px_-30px_rgba(231,111,81,0.55)] transition-all duration-200 hover:brightness-110"
        >
          ⚔️ Start Battle
        </button>
      </div>

      {/* Battle Log */}
      <div>
        <h3 className="text-xl font-bold text-white mb-3">Last Battle Log</h3>
        <div className="bg-charcoal-200/20 rounded-xl p-4 border border-charcoal-200/30 max-h-64 overflow-y-auto">
          {currentProgress.lastBattleLog.length > 0 ? (
            <div className="space-y-2 font-mono text-sm">
              {[...currentProgress.lastBattleLog].reverse().map((entry, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    entry.type === "result"
                      ? entry.value === "Win"
                        ? "bg-teal-500/15 text-teal-600 font-bold border-l-4 border-teal-500"
                        : "bg-rose-500/15 text-rose-500 font-bold border-l-4 border-rose-500"
                      : entry.type === "player"
                      ? "text-teal-500"
                      : "text-amber-500"
                  }`}
                >
                  <span className="text-white/50">[{entry.time.toFixed(1)}s]</span> {entry.message}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/50 text-center py-8">
              No battle history yet. Start a battle to see the combat log!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BossTab;
