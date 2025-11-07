// src/components/StatsTab.tsx - REFACTORED

import React from "react";
import type { PlayerStats } from "../types/game";
import { StatValue } from "../types/game";
import { STAT_MAP } from "../core/data";

interface StatsTabProps {
  playerStats: PlayerStats;
  totalLevels: number;
}

const STAT_ORDER = [
  StatValue.STR,
  StatValue.DEX,
  StatValue.AGI,
  StatValue.TGH,
  StatValue.CON,
  StatValue.INT,
  StatValue.FRT,
  StatValue.CONC,
  StatValue.RES,
  StatValue.CRIT_C,
  StatValue.CRIT_D,
] as const;

const StatsTab: React.FC<StatsTabProps> = ({ playerStats, totalLevels }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-charcoal-400 to-teal-500"></div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Player Stats</h2>
          <p className="text-sm sm:text-base text-white/70">
            Your character's attributes and power level
          </p>
        </div>
      </div>

      {/* Total Levels Display */}
      <div className="rounded-2xl border border-teal-500/40 bg-gradient-to-br from-teal-500/20 via-transparent to-teal-500/10 p-6 sm:p-7 text-white shadow-[0_25px_60px_-35px_rgba(42,157,143,0.45)]">
        <div className="flex items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-teal-900">Total Job Levels</p>
            <p className="text-4xl font-semibold tracking-tight text-white">{totalLevels}</p>
          </div>
          <div className="hidden text-6xl opacity-20 sm:block text-teal-700/40">📊</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STAT_ORDER.map((statId) => {
          const statDef = STAT_MAP[statId];
          const value = playerStats[statId] || 0;
          const displayValue = statId === StatValue.CRIT_C
            ? `${(value * 100).toFixed(1)}%`
            : statId === StatValue.CRIT_D
            ? `${(value * 100).toFixed(0)}%`
            : Math.floor(value).toString();

          return (
            <div
              key={statId}
              className="group rounded-2xl border border-charcoal-200/30 bg-charcoal-200/15 p-4 sm:p-5 backdrop-blur-sm transition-all duration-200 hover:border-teal-500/40 hover:bg-charcoal-200/25"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-teal-500/20 p-2.5 text-teal-600 group-hover:bg-teal-500/30">
                  <statDef.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-white/70">
                    {statDef.name}
                  </p>
                  <p className="text-2xl font-semibold tracking-tight text-white font-mono">
                    {displayValue}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-white/70">
                {statDef.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsTab;
