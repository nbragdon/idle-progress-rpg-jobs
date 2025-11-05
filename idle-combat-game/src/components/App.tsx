// src/components/App.tsx

import React from "react";
import { useGameState } from "../hooks/useGameState";

// Import all required components
import JobsTab from "./JobsTab";
import StatsTab from "./StatsTab";
import SkillsTab from "./SkillsTab";
import AbilitiesTab from "./AbilitiesTab";
import BossTab from "./BossTab";
import AscensionTab from "./AscensionTab";
import { FaBriefcase } from "react-icons/fa";
import { BsLayersFill } from "react-icons/bs";
import { RiSwordFill } from "react-icons/ri";
import { BiRefresh } from "react-icons/bi";

// --- Helper Component (Alert Toast) ---
interface AlertToastProps {
  message: string;
  visible: boolean;
}

const AlertToast: React.FC<AlertToastProps> = ({ message, visible }) => (
  // Assuming the "z-50" class ensures the toast appears over other content
  <div
    className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-xl transition-opacity duration-300 z-50 ${visible
        ? "opacity-100 bg-green-600"
        : "opacity-0 pointer-events-none bg-green-600"
      }`}
  >
    <p className="text-white font-semibold">{message}</p>
  </div>
);

// --- Main App Component ---

const App: React.FC = () => {
  const {
    gameState,
    alert,
    maxLimits,
    isAscensionVisible,
    tabs,
    playerStats,
    currentBossData,
    setTab,
    // All Mutators (Functions to change state)
    toggleJobActive,
    toggleSkillActive,
    toggleAbilityTraining,
    startBossBattle,
    buyAscensionUpgrade,
    ascend,
  } = useGameState();

  const activeTab = gameState.activeTab;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-2xl p-6">
        <h1 className="text-3xl font-extrabold text-indigo-400 mb-6 text-center">
          Idle Progression RPG (TS)
        </h1>

        {/* Character Sheet / Top Bar */}
        <div className="mb-6 flex flex-wrap justify-between items-center p-4 bg-gray-700 rounded-lg shadow-inner text-sm">
          {/* Active Jobs display */}
          <p className="flex items-center text-gray-400">
            <FaBriefcase className="w-4 h-4 mr-1 text-yellow-400" /> Jobs:{" "}
            <span className="font-bold text-white ml-1">
              {Object.values(gameState.jobs).filter((j) => j.isActive).length} /{" "}
              {maxLimits.maxActiveJobs}
            </span>
          </p>
          {/* Active Skills display */}
          <p className="flex items-center text-gray-400">
            <BsLayersFill className="w-4 h-4 mr-1 text-cyan-400" /> Skills:{" "}
            <span className="font-bold text-white ml-1">
              {Object.values(gameState.skills).filter((s) => s.isActive).length}{" "}
              / {maxLimits.maxActiveSkills}
            </span>
          </p>
          {/* Training Abilities display */}
          <p className="flex items-center text-gray-400">
            <RiSwordFill className="w-4 h-4 mr-1 text-pink-400" /> Training:{" "}
            <span className="font-bold text-white ml-1">
              {
                Object.values(gameState.abilities).filter((a) => a.isTraining)
                  .length
              }{" "}
              / {maxLimits.maxActiveAbilities}
            </span>
          </p>
          {/* Ascension Points display */}
          {isAscensionVisible && (
            <p className="flex items-center text-gray-400">
              <BiRefresh className="w-4 h-4 mr-1 text-yellow-400" /> AP:{" "}
              <span className="font-bold text-white ml-1">
                {gameState.ascensionPoints}
              </span>
            </p>
          )}
        </div>

        {/* Tab Navigation (Using refactored classes) */}
        <div className="tab-nav-container">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setTab(tab.id)}
              disabled={tab.disabled}
              className={`tab-button-base ${tab.disabled
                  ? "tab-button-disabled"
                  : activeTab === tab.id
                    ? "tab-button-active"
                    : "tab-button-inactive"
                }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Rendering */}
        <div className="min-h-[400px]">
          {activeTab === "Jobs" && (
            <JobsTab
              jobs={gameState.jobs}
              maxActiveJobs={maxLimits.maxActiveJobs}
              toggleJobActive={toggleJobActive}
            />
          )}
          {activeTab === "Stats" && (
            <StatsTab
              playerStats={playerStats}
              // Note: TotalLevels is guaranteed to be in playerStats by useGameLogic.ts
              totalLevels={playerStats.TotalLevels as number}
            />
          )}
          {activeTab === "Skills" && (
            <SkillsTab
              skills={gameState.skills}
              maxActiveSkills={maxLimits.maxActiveSkills}
              toggleSkillActive={toggleSkillActive}
            />
          )}
          {activeTab === "Abilities" && (
            <AbilitiesTab
              abilities={gameState.abilities}
              maxActiveAbilities={maxLimits.maxActiveAbilities}
              playerStats={playerStats}
              toggleAbilityTraining={toggleAbilityTraining}
            />
          )}
          {activeTab === "Boss" && (
            <BossTab
              bossData={currentBossData}
              bossProgress={gameState.bossProgress}
              startBattle={startBossBattle}
            />
          )}
          {activeTab === "Ascension" && (
            <AscensionTab
              gameState={gameState}
              buyAscensionUpgrade={buyAscensionUpgrade}
              ascend={ascend}
            />
          )}
        </div>

        <AlertToast message={alert.message} visible={alert.visible} />
      </div>
    </div>
  );
};

export default App;
