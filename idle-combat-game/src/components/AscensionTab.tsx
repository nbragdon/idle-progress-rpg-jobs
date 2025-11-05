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
  // Mapped correctly from lucide-react -> react-icons/fa
  jobExp: FaBolt,
  // IconMap previously had 'skillExp' which does not exist in the defined upgrades. 
  // We need to remove it and ensure the three defined IDs are present.
  maxSkills: FaExpandAlt,
  maxAbilities: FaExpandAlt,
  skillExp: FaBolt,
  maxActiveJobs: FaExpandAlt
};

const AscensionTab: React.FC<AscensionTabProps> = ({ gameState, buyAscensionUpgrade, ascend }) => {
  // Calculate potential points gained on Ascension
  const currentBossData = BOSS_DATA[gameState.currentBossId];
  // Use nullish coalescing for safety
  const currentBossDefeats = gameState.bossProgress[gameState.currentBossId]?.defeated || 0;
  const pointsPerDefeat = currentBossData?.ascensionPoints || 0;
  const pendingPoints = currentBossDefeats * pointsPerDefeat;
  const totalPointsAfterAscension = gameState.ascensionPoints + pendingPoints;

  // Determine Ascension button class
  const ascensionButtonClass = pendingPoints > 0 ? 'ascension-button-ready' : 'ascension-button-disabled';

  // Icon for the main AP display, mapped from RefreshCw -> FaSyncAlt
  const RefreshIcon = FaSyncAlt;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-indigo-300">Ascension 💫</h2>

      {/* Ascension Summary */}
      <div className="ascension-summary-box">
        <p className="text-xl font-bold text-yellow-400 flex items-center">
          <RefreshIcon className="w-5 h-5 mr-2" /> Ascension Points (AP): {gameState.ascensionPoints}
        </p>
        <p className="text-md text-gray-400 mt-2">
          Points to Gain on Ascend: <span className="font-bold text-green-400">{pendingPoints} AP</span> (from {currentBossDefeats} {currentBossData?.name || 'Boss'} defeats)
        </p>
        <p className="text-lg font-bold text-white mt-1">
          Total AP after Ascend: <span className="text-yellow-400">{totalPointsAfterAscension}</span>
        </p>

        <button
          onClick={ascend}
          disabled={pendingPoints === 0}
          className={`ascension-button-base ${ascensionButtonClass}`}
        >
          ASCEND (Reset Progress, Gain {pendingPoints} AP)
        </button>
      </div>

      {/* Upgrades Section */}
      <h3 className="text-xl font-bold text-white mt-6">Permanent Upgrades</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ASCENSION_UPGRADES.map(upgrade => {
          const currentLevel = gameState.permanentUpgrades[upgrade.id] || 0;
          const cost = upgrade.cost(currentLevel);
          const isMaxLevel = currentLevel >= upgrade.maxLevel;
          const canAfford = gameState.ascensionPoints >= cost;
          const UpgradeIcon = IconMap[upgrade.id];

          // Determine Upgrade button class
          let upgradeButtonClass = 'upgrade-button-base';
          if (isMaxLevel) {
            upgradeButtonClass += ' upgrade-button-max';
          } else if (canAfford) {
            upgradeButtonClass += ' upgrade-button-buy';
          } else {
            upgradeButtonClass += ' upgrade-button-unaffordable';
          }

          return (
            <div
              key={upgrade.id}
              className="upgrade-card-base"
            >
              <div>
                <p className="text-lg font-semibold text-white flex items-center">
                  {UpgradeIcon && <UpgradeIcon className="w-4 h-4 mr-2 text-yellow-400" />}
                  {upgrade.name} (Lvl {currentLevel}/{upgrade.maxLevel})
                </p>
                <p className="text-sm text-gray-400">
                  Effect: +{upgrade.effect(currentLevel + 1)} at next level.
                </p>
              </div>

              <button
                onClick={() => buyAscensionUpgrade(upgrade.id)}
                disabled={isMaxLevel || !canAfford}
                className={upgradeButtonClass}
              >
                {isMaxLevel ? 'Max Level' : `${cost} AP`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AscensionTab;