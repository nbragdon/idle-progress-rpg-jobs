// src/components/StatsTab.tsx - REFACTORED

import React from "react";
import type { PlayerStats } from "../types/game";
import { STAT_MAP } from "../core/data";

interface StatsTabProps {
  playerStats: PlayerStats;
  totalLevels: number;
}

const STAT_ORDER = [
  "STR",
  "DEX",
  "AGI",
  "TGH",
  "CON",
  "INT",
  "FRT",
  "CONC",
  "RES",
  "CRIT_C",
  "CRIT_D",
] as const;

const StatsTab: React.FC<StatsTabProps> = ({ playerStats, totalLevels }) => {
  return (
    <div className="space-y-6">
      {" "}
      <h2 className="text-2xl font-bold text-indigo-300">Player Stats 📈</h2>
      {" "}
      <div className="stats-summary-box">
        {" "}
        <p className="text-lg font-semibold text-white">
          Total Job Levels:{" "}
          <span className="text-yellow-400">{totalLevels}</span>
        </p>
        {" "}
      </div>
      {" "}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {" "}
        {STAT_ORDER.map((statId) => {
          const statDef = STAT_MAP[statId];
          const value = playerStats[statId] || 0;
          const displayValue = ["CRIT_C", "CRIT_D"].includes(statId)
            ? `${(value * 100).toFixed(2)}%`
            : value.toFixed(2);

          return (
            <div key={statId} className="stats-detail-box">
              <statDef.icon className="w-5 h-5 text-green-400" />
              {" "}
              <div>
                {" "}
                <p className="font-semibold text-white">
                  {statDef.name}:{" "}
                  <span className="text-lg font-mono text-indigo-400">
                    {displayValue}
                  </span>
                </p>
                {" "}
                <p className="text-xs text-gray-400">{statDef.desc}</p>
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

export default StatsTab;
