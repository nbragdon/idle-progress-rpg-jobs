// src/components/App.tsx

import React from "react";
import { useGame } from "../hooks/useGame";

// Import all required components
import JobsTab from "./JobsTab";
import StatsTab from "./StatsTab";
import SkillsTab from "./SkillsTab";
import AbilitiesTab from "./AbilitiesTab";
import BossTab from "./BossTab";
import AscensionTab from "./AscensionTab";
import SettingsTab from "./SettingsTab";

// --- Helper Component (Alert Toast) ---
interface AlertToastProps {
  message: string;
  visible: boolean;
}

const AlertToast: React.FC<AlertToastProps> = ({ message, visible }) => (
  <div
    className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-2xl border border-emerald-500/50 backdrop-blur-sm transition-all duration-300 z-50 transform ${
      visible
        ? "opacity-100 translate-y-0 bg-emerald-600"
        : "opacity-0 translate-y-4 pointer-events-none bg-emerald-600"
    }`}
  >
    <p className="text-white font-semibold flex items-center gap-3">
      <span className="text-xl">✓</span>
      {message}
    </p>
  </div>
);

// --- Main App Component ---

const App: React.FC = () => {
  const {
    gameState,
    playerStats,
    totalLevels,
    maxLimits,
    currentBossData,
    isAscensionVisible,
    activeTab,
    setTab,
    alert,
    tabs,
    toggleJobActive,
    toggleSkillActive,
    toggleAbilityTraining,
    buyAscensionUpgrade,
    ascend,
    startBossBattle,
    resetGame,
  } = useGame();

  // Modern tab styling
  const baseTabClass =
    "flex items-center justify-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-semibold rounded-lg transition-all duration-200 min-w-[48px] sm:min-w-0";

  const tabClasses = {
    active: `${baseTabClass} bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg border-b-2 border-teal-400`,
    inactive: `${baseTabClass} text-slate-400 border-b-2 border-transparent hover:text-white hover:bg-slate-800/50`,
    disabled: `${baseTabClass} text-slate-600 cursor-not-allowed border-b-2 border-transparent opacity-50`,
  };


  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Subtle background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute bottom-[-14rem] right-[-10rem] h-[32rem] w-[32rem] rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      {/* Top Info Bar - Character/Game Info */}
      <header className="relative border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Left: Character Info */}
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Idle Loop <span className="text-teal-400">'The Grinder'</span>
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Level {totalLevels} | Active Jobs: {Object.values(gameState.jobs).filter((j) => j.isActive).length} | Skills: {Object.values(gameState.skills).filter((s) => s.isActive).length}
                </p>
              </div>
            </div>

            {/* Right: Key Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="rounded-xl border border-teal-500/30 bg-slate-800/50 px-6 py-4 backdrop-blur-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-teal-400">Active Jobs</p>
                <p className="text-2xl font-bold text-white mt-2">
                  {Object.values(gameState.jobs).filter((j) => j.isActive).length}
                  <span className="text-sm font-normal text-slate-400 ml-2">/ {maxLimits.maxActiveJobs}</span>
                </p>
              </div>
              <div className="rounded-xl border border-amber-500/30 bg-slate-800/50 px-6 py-4 backdrop-blur-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-amber-400">Active Skills</p>
                <p className="text-2xl font-bold text-white mt-2">
                  {Object.values(gameState.skills).filter((s) => s.isActive).length}
                  <span className="text-sm font-normal text-slate-400 ml-2">/ {maxLimits.maxActiveSkills}</span>
                </p>
              </div>
              {isAscensionVisible && (
                <div className="rounded-xl border border-rose-500/30 bg-slate-800/50 px-6 py-4 backdrop-blur-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-rose-400">Ascension</p>
                  <p className="text-2xl font-bold text-white mt-2">{gameState.ascensionPoints} AP</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation Bar */}
      <nav className="relative border-b border-slate-700/50 bg-slate-900/60 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setTab(tab.id)}
                disabled={tab.disabled}
                className={
                  tab.disabled
                    ? tabClasses.disabled
                    : activeTab === tab.id
                    ? tabClasses.active
                    : tabClasses.inactive
                }
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline-block">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-md shadow-2xl">
          <div className="min-h-[600px] p-6 sm:p-8">
            {activeTab === "Jobs" && (
              <JobsTab
                jobs={gameState.jobs}
                gameState={gameState}
                playerStats={playerStats}
                maxActiveJobs={maxLimits.maxActiveJobs}
                toggleJobActive={toggleJobActive}
              />
            )}
            {activeTab === "Stats" && (
              <StatsTab
                playerStats={playerStats}
                totalLevels={totalLevels}
              />
            )}
            {activeTab === "Skills" && (
              <SkillsTab
                skills={gameState.skills}
                gameState={gameState}
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
            {activeTab === "Settings" && (
              <SettingsTab
                onReset={resetGame}
              />
            )}
          </div>
        </div>
      </main>

      <AlertToast message={alert.message} visible={alert.visible} />
    </div>
  );
};

export default App;

