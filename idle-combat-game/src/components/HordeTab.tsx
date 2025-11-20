import React from "react";
import type { GameState } from "../types/game";
import { HORDE_UPGRADES, calculateUpgradeCost } from "../data/horde";
import { GiGoblinHead } from "react-icons/gi";

interface HordeTabProps {
  gameState: GameState;
  purchaseHordeUpgrade: (upgradeId: string) => void;
}

const HordeTab: React.FC<HordeTabProps> = ({ gameState, purchaseHordeUpgrade }) => {
  const { hordeState } = gameState;

  if (!hordeState.unlocked) {
    return (
      <div className="text-center p-8 bg-slate-800/50 rounded-xl border border-slate-700">
        <GiGoblinHead className="mx-auto h-16 w-16 text-red-400 mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">The Horde</h3>
        <p className="text-slate-400">
          Defeat the Goblin King 5 or more times to unlock the Horde system.
        </p>
        <p className="text-slate-300 mt-4">
          Goblin King Defeats:{" "}
          <span className="font-bold text-red-300">
            {gameState.bossProgress["GoblinKing"]?.defeated || 0}
          </span>{" "}
          / 5
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
        <GiGoblinHead className="text-red-400" /> The Horde
      </h2>
      <p className="text-slate-400">
        Spend goblins to increase stat gains for jobs with specific traits. Each upgrade level
        increases stat gains by 25%. Cost increases exponentially as you purchase more upgrades.
      </p>

      {/* Goblin Counter */}
      <div className="bg-gradient-to-r from-red-800/40 to-slate-800/40 p-6 rounded-xl border border-red-700/50 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GiGoblinHead className="h-10 w-10 text-red-400" />
            <div>
              <h3 className="text-xl font-bold text-white">Available Goblins</h3>
              <p className="text-sm text-slate-400">
                Generating {hordeState.goblinGeneration.toFixed(1)} goblins/second
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-red-300">{Math.floor(hordeState.goblins)}</p>
          </div>
        </div>
      </div>

      {/* Upgrade Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.values(HORDE_UPGRADES).map((upgrade) => {
          const upgradeState = hordeState.upgrades[upgrade.id];
          const currentLevel = upgradeState?.level || 0;
          const cost = calculateUpgradeCost(upgrade.baseCost, hordeState.totalLevels);
          const canAfford = hordeState.goblins >= cost;
          const currentMultiplier = 1 + currentLevel * upgrade.statMultiplierPerLevel;
          const nextMultiplier = 1 + (currentLevel + 1) * upgrade.statMultiplierPerLevel;

          return (
            <div
              key={upgrade.id}
              className="relative p-6 rounded-xl border shadow-md bg-slate-800/50 border-slate-700 hover:border-red-600 hover:bg-slate-700/50 transition-all duration-200"
            >
              <div className="flex items-center gap-4 mb-3">
                <upgrade.icon className="h-8 w-8 text-slate-400" />
                <div>
                  <h3 className="text-xl font-bold text-white">{upgrade.name}</h3>
                  <p className="text-sm text-slate-400">Level {currentLevel}</p>
                </div>
              </div>
              
              <p className="text-slate-400 text-sm mb-4">{upgrade.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Current Multiplier:</span>
                  <span className="font-semibold text-teal-300">
                    {currentMultiplier.toFixed(2)}x
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Next Level:</span>
                  <span className="font-semibold text-green-300">
                    {nextMultiplier.toFixed(2)}x
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Affects Traits:</span>
                  <span className="font-semibold text-white">
                    {upgrade.traits.join(", ")}
                  </span>
                </div>
              </div>

              <button
                onClick={() => purchaseHordeUpgrade(upgrade.id)}
                disabled={!canAfford}
                className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                  canAfford
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-slate-700 text-slate-500 cursor-not-allowed"
                }`}
              >
                <GiGoblinHead className="h-5 w-5" />
                <span>
                  {canAfford ? "Purchase" : "Cannot Afford"} ({cost} goblins)
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
        <h4 className="text-sm font-semibold text-white mb-2">Cost Scaling</h4>
        <p className="text-xs text-slate-400">
          The cost for the next upgrade is: <span className="font-mono text-teal-300">base cost × 3^(total levels)</span>
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Total levels purchased: <span className="font-bold text-white">{hordeState.totalLevels}</span>
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Next upgrade cost: <span className="font-bold text-red-300">{calculateUpgradeCost(100, hordeState.totalLevels)} goblins</span>
        </p>
        <p className="text-xs text-red-400 mt-3">
          ⚠️ All Horde upgrades and goblins reset on ascension!
        </p>
      </div>
    </div>
  );
};

export default HordeTab;

