// src/components/AscensionTab.tsx - CLEAN REDESIGN

import React from 'react';
import type { GameState } from '../types/game';
import type { AscensionUpgradeDefinition } from '../types/data';
import { ASCENSION_UPGRADES } from '../core/data';
import { FaBolt, FaSyncAlt } from 'react-icons/fa';

interface AscensionTabProps {
  gameState: GameState;
  buyAscensionUpgrade: (upgradeId: string, cost: number) => void;
  ascend: () => void;
}

const AscensionTab: React.FC<AscensionTabProps> = ({ gameState, buyAscensionUpgrade, ascend }) => {
  // Get potential points that will be gained on ascension
  const potentialPoints = gameState.potentialAscensionPoints || 0;
  const currentPoints = gameState.ascensionPoints || 0;
  const totalPointsAfterAscension = currentPoints + potentialPoints;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-purple-500 to-rose-500"></div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Ascension</h2>
          <p className="text-sm sm:text-base text-white/70 mt-2">
            Reset for permanent power upgrades
          </p>
        </div>
      </div>

      {/* Ascension Summary Card */}
      <div className="rounded-2xl bg-slate-800/50 backdrop-blur-sm p-7 sm:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-purple-500/20">
            <FaSyncAlt className="w-7 h-7 text-purple-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-400">Current Balance</p>
            <p className="text-3xl font-bold text-white">{currentPoints} AP</p>
          </div>
        </div>

        {potentialPoints > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-teal-500/10 border border-teal-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-teal-400 font-semibold">Ready to Claim</p>
                <p className="text-2xl font-bold text-white mt-1">+{potentialPoints} AP</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Total After Ascend</p>
                <p className="text-xl font-bold text-amber-400">{totalPointsAfterAscension} AP</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={ascend}
          disabled={potentialPoints === 0}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
            potentialPoints > 0
              ? "bg-gradient-to-r from-purple-500 to-rose-500 text-white hover:brightness-110 shadow-lg"
              : "bg-slate-700/30 text-slate-600 cursor-not-allowed"
          }`}
        >
          {potentialPoints > 0
            ? `✨ Ascend & Claim ${potentialPoints} AP`
            : "⏳ Defeat Bosses to Earn AP"}
        </button>

        {potentialPoints > 0 && (
          <p className="text-xs text-slate-500 text-center mt-3">
            Warning: This will reset all progress except permanent upgrades
          </p>
        )}
      </div>

      {/* Permanent Upgrades Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Permanent Upgrades</h3>
        <p className="text-sm text-slate-400 mb-4">
          Each upgrade multiplies EXP gain by 5x. Click to view details.
        </p>
        <div className="grid grid-cols-1 gap-3">
          {ASCENSION_UPGRADES.map(upgrade => {
            const currentLevel = gameState.permanentUpgrades[upgrade.id] || 0;
            const cost = upgrade.cost(currentLevel);
            const isMaxLevel = currentLevel >= upgrade.maxLevel;
            const canAfford = currentPoints >= cost;
            const currentEffect = currentLevel > 0 ? upgrade.effect(currentLevel) : 0;
            const nextEffect = upgrade.effect(currentLevel + 1);

            return (
              <div
                key={upgrade.id}
                className={`rounded-xl p-5 transition-all ${
                  isMaxLevel
                    ? "bg-amber-500/10 border border-amber-500/30"
                    : "bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FaBolt className={`h-5 w-5 ${isMaxLevel ? "text-amber-400" : "text-purple-400"}`} />
                      <h4 className="text-base font-semibold text-white">{upgrade.name}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        isMaxLevel
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-slate-700/50 text-slate-400"
                      }`}>
                        Level {currentLevel} / {upgrade.maxLevel}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{upgrade.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      {currentLevel > 0 && (
                        <div>
                          <span className="text-slate-500">Current: </span>
                          <span className="text-teal-400 font-semibold">+{currentEffect}x</span>
                        </div>
                      )}
                      {!isMaxLevel && (
                        <div>
                          <span className="text-slate-500">Next: </span>
                          <span className="text-white font-semibold">+{nextEffect}x</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    {!isMaxLevel ? (
                      <button
                        onClick={() => buyAscensionUpgrade(upgrade.id, cost)}
                        disabled={!canAfford}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                          canAfford
                            ? "bg-purple-500 text-white hover:brightness-110"
                            : "bg-slate-700/30 text-slate-600 cursor-not-allowed"
                        }`}
                      >
                        {cost} AP
                      </button>
                    ) : (
                      <div className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 font-semibold text-sm">
                        MAX
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AscensionTab;
