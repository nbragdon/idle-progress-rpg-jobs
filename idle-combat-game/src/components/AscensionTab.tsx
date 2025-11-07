// src/components/AscensionTab.tsx - REFACTORED

import React from 'react';
// Corrected import: AscensionUpgradeDefinition is the correct type for upgrade definitions
// Note: Removed StatId import as it was unused in this file.
import type { GameState } from '../types/game';
import type { AscensionUpgradeDefinition } from '../types/data';
import { ASCENSION_UPGRADES, BOSS_DATA } from '../core/data';

// Replacing lucide-react with react-icons (using Font Awesome)
// FaSyncAlt: For the main AP counter (was RefreshCw)
// FaBolt: For jobExp (was Zap)
// FaExpandAlt: For maxSkills/maxAbilities (was Maximize)
// NOTE: I changed FaCogs (from previous response) to FaGears for consistency with data.ts
import { FaSyncAlt, FaBolt, FaExpandAlt } from 'react-icons/fa';

interface AscensionTabProps {
  gameState: GameState;
  // Use the correct imported type for the parameter
  buyAscensionUpgrade: (upgradeId: AscensionUpgradeDefinition['id']) => void;
  ascend: () => void;
}

// *** CRITICAL CORRECTION ***
// The icon for 'skillExp' must be mapped correctly.
// 'skillExp' is NOT a defined upgrade in ASCENSION_UPGRADES from data.ts.
// The upgrades defined are 'jobExp', 'maxSkills', and 'maxAbilities'.
// The 'IconMap' must only include keys present in ASCENSION_UPGRADES.
const IconMap: Record<AscensionUpgradeDefinition['id'], React.FC<React.SVGProps<SVGSVGElement>>> = {
  jobExp: FaBolt,
  skillExp: FaBolt,
  maxSkills: FaExpandAlt,
  maxAbilities: FaExpandAlt,
  maxActiveJobs: FaExpandAlt,
};

const AscensionTab: React.FC<AscensionTabProps> = ({ gameState, buyAscensionUpgrade, ascend }) => {
  // Calculate potential points gained on Ascension
  const currentBossData = BOSS_DATA[gameState.currentBossId];
  // Use nullish coalescing for safety
  const currentBossDefeats = gameState.bossProgress[gameState.currentBossId]?.defeated || 0;
  const pointsPerDefeat = currentBossData?.ascensionPoints || 0;
  const pendingPoints = currentBossDefeats * pointsPerDefeat;
  const totalPointsAfterAscension = gameState.ascensionPoints + pendingPoints;

  // Icon for the main AP display, mapped from RefreshCw -> FaSyncAlt
  const RefreshIcon = FaSyncAlt;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-teal-500 to-amber-500"></div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Ascension</h2>
          <p className="text-sm sm:text-base text-white/70 mt-1">
            Reset for permanent power upgrades
          </p>
        </div>
      </div>

      {/* Ascension Summary Card */}
      <div className="rounded-2xl border border-teal-500/40 bg-gradient-to-br from-teal-500/20 via-transparent to-teal-500/10 p-6 text-white shadow-[0_25px_60px_-35px_rgba(42,157,143,0.45)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-teal-500/20 text-teal-600 shadow-[0_15px_35px_-25px_rgba(42,157,143,0.45)]">
            <RefreshIcon className="w-8 h-8" style={{ animationDuration: '3s' }} />
          </div>
          <div>
            <p className="text-sm text-white/60">Current Balance</p>
            <p className="text-3xl font-bold text-white">
              {gameState.ascensionPoints} <span className="text-xl text-white/60">AP</span>
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center rounded-xl border border-charcoal-200/30 bg-charcoal-200/20 px-3 py-3">
            <span className="text-sm text-white/70">Points to Gain</span>
            <span className="text-lg font-bold text-teal-600">+{pendingPoints} AP</span>
          </div>
          <div className="flex justify-between items-center rounded-xl border border-charcoal-200/30 bg-charcoal-200/20 px-3 py-3">
            <span className="text-sm text-white/70">From {currentBossData?.name || 'Boss'} Defeats</span>
            <span className="text-lg font-bold text-white">{currentBossDefeats}</span>
          </div>
          <div className="flex justify-between items-center rounded-xl border border-amber-400/40 bg-amber-400/20 px-3 py-3">
            <span className="text-sm font-semibold text-amber-500">Total After Ascend</span>
            <span className="text-xl font-bold text-white">{totalPointsAfterAscension} AP</span>
          </div>
        </div>

        <button
          onClick={ascend}
          disabled={pendingPoints === 0}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
            pendingPoints > 0
              ? "bg-gradient-to-r from-teal-500 via-amber-400 to-orange-500 text-white shadow-[0_25px_55px_-30px_rgba(42,157,143,0.5)] hover:brightness-110"
              : "bg-charcoal-200/30 text-charcoal-700/50 cursor-not-allowed"
          }`}
        >
          {pendingPoints > 0
            ? `✨ ASCEND & GAIN ${pendingPoints} AP`
            : "⏳ Defeat Bosses to Ascend"}
        </button>

        {pendingPoints > 0 && (
          <p className="text-xs text-white/60 text-center mt-3">
            Warning: This will reset all progress except permanent upgrades
          </p>
        )}
      </div>

      {/* Permanent Upgrades Section */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Permanent Upgrades</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ASCENSION_UPGRADES.map(upgrade => {
            const currentLevel = gameState.permanentUpgrades[upgrade.id] || 0;
            const cost = upgrade.cost(currentLevel);
            const isMaxLevel = currentLevel >= upgrade.maxLevel;
            const canAfford = gameState.ascensionPoints >= cost;
            const UpgradeIcon = IconMap[upgrade.id];
            const nextLevelEffect = upgrade.effect(currentLevel + 1);

            return (
              <div
                key={upgrade.id}
                className={`group rounded-xl p-5 transition-all duration-300 border ${
                  isMaxLevel
                    ? "bg-gradient-to-br from-amber-400/25 to-orange-400/10 border-amber-400/40"
                    : canAfford
                    ? "bg-gradient-to-br from-teal-500/15 to-charcoal-200/20 border-teal-500/40 hover:border-teal-500/60 hover:shadow-lg hover:shadow-teal-500/20"
                    : "bg-gradient-to-br from-charcoal-200/15 to-charcoal-200/25 border-charcoal-200/30"
                }`}
              >
                {isMaxLevel && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg">
                      MAX
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-3 mb-4">
                  <div className={`p-2.5 rounded-lg ${
                    isMaxLevel
                      ? "bg-amber-400/20"
                      : canAfford
                      ? "bg-teal-500/20"
                      : "bg-charcoal-200/20"
                  }`}>
                    {UpgradeIcon && (
                      <UpgradeIcon className={`w-6 h-6 ${
                        isMaxLevel
                          ? "text-amber-500"
                          : canAfford
                          ? "text-teal-600"
                          : "text-charcoal-700/70"
                      }`} />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-white mb-1">{upgrade.name}</h4>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-white/60">Level</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-teal-600">{currentLevel}</span>
                        <span className="text-xs text-white/40">/</span>
                        <span className="text-sm font-bold text-white/70">{upgrade.maxLevel}</span>
                      </div>
                    </div>
                    {!isMaxLevel && (
                      <p className="text-sm text-teal-600">
                        Next: +{nextLevelEffect}
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full h-2 bg-charcoal-200/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isMaxLevel
                          ? "bg-gradient-to-r from-amber-400 to-orange-400"
                          : "bg-gradient-to-r from-teal-500 to-teal-600"
                      }`}
                      style={{ width: `${(currentLevel / upgrade.maxLevel) * 100}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => buyAscensionUpgrade(upgrade.id)}
                  disabled={isMaxLevel || !canAfford}
                  className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    isMaxLevel
                      ? "bg-amber-400/20 text-amber-500 border border-amber-400/40 cursor-default"
                      : canAfford
                      ? "bg-gradient-to-r from-teal-500 via-amber-400 to-orange-500 text-white shadow-[0_18px_35px_-20px_rgba(233,196,106,0.5)] hover:brightness-110"
                      : "bg-charcoal-200/30 text-charcoal-700/50 cursor-not-allowed"
                  }`}
                >
                  {isMaxLevel ? "⭐ Max Level" : `Upgrade • ${cost} AP`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AscensionTab;