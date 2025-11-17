// src/components/App.tsx

import React from "react";
import { useGame } from "../hooks/useGame";

// Import all required components
import JobsTab from "./JobsTab";
import SkillsTab from "./SkillsTab";
import AbilitiesTab from "./AbilitiesTab";
import BossTab from "./BossTab";
import BattleDisplay from "./BattleDisplay";
import AscensionTab from "./AscensionTab";
import PathsTab from "./PathsTab";
import SettingsTab from "./SettingsTab";
import Modal from "./Modal";
import { STAT_MAP } from "../core/data";

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
    toggleAbilityBattle,
    buyAscensionUpgrade,
    ascend,
    startBossBattle,
    closeBattle,
    resetGame,
    selectPath,
  } = useGame();

  const [showStatsModal, setShowStatsModal] = React.useState(false);

  // Modern tab styling
  const baseTabClass =
    "flex items-center justify-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-semibold rounded-lg transition-all duration-200 min-w-[48px] sm:min-w-0";

  const tabClasses = {
    active: `${baseTabClass} bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg border-b-2 border-teal-400`,
    inactive: `${baseTabClass} text-slate-400 border-b-2 border-transparent hover:text-white hover:bg-slate-800/50`,
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col gap-3">
            {/* Top Row: Title and Ascension Points */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  <span className="text-teal-400">Strongest Hero</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Level {totalLevels} | Active Jobs: {Object.values(gameState.jobs).filter((j) => j.isActive).length}/{maxLimits.maxActiveJobs} | Skills: {Object.values(gameState.skills).filter((s) => s.isActive).length}/{maxLimits.maxActiveSkills}
                </p>
              </div>
              
              {isAscensionVisible && (
                <div className="rounded-lg border border-rose-500/30 bg-slate-800/50 px-4 py-2 backdrop-blur-sm">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-rose-400">Ascension Points</p>
                  <p className="text-lg font-bold text-white">
                    {gameState.ascensionPoints} AP
                    {gameState.potentialAscensionPoints > 0 && (
                      <span className="text-xs font-normal text-teal-400 ml-1">
                        (+{gameState.potentialAscensionPoints})
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Row: Stats */}
            <div className="flex items-center gap-4 mt-2 mb-3">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-medium">STR</span>
                  <span className="text-slate-300 font-semibold">{playerStats.STR}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-medium">DEX</span>
                  <span className="text-slate-300 font-semibold">{playerStats.DEX}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-medium">AGI</span>
                  <span className="text-slate-300 font-semibold">{playerStats.AGI}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-medium">TGH</span>
                  <span className="text-slate-300 font-semibold">{playerStats.TGH}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-medium">CON</span>
                  <span className="text-slate-300 font-semibold">{playerStats.CON}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-medium">INT</span>
                  <span className="text-slate-300 font-semibold">{playerStats.INT}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-medium">FRT</span>
                  <span className="text-slate-300 font-semibold">{playerStats.FRT}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-medium">CONC</span>
                  <span className="text-slate-300 font-semibold">{playerStats.CONC}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-medium">RES</span>
                  <span className="text-slate-300 font-semibold">{playerStats.RES}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-medium">CRIT</span>
                  <span className="text-slate-300 font-semibold">{playerStats.CRIT_C.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-medium">CRIT DMG</span>
                  <span className="text-slate-300 font-semibold">{playerStats.CRIT_D.toFixed(0)}%</span>
                </div>
              </div>
              <button
                onClick={() => setShowStatsModal(true)}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-colors border border-slate-600/50 hover:border-slate-500/50"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation Bar */}
      <nav className="relative border-b border-slate-700/50 bg-slate-900/60 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-4 sm:py-5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                className={
                  activeTab === tab.id
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
          <div className="min-h-[600px] p-7 sm:p-10">
            {/* Show Battle Display if battle is active */}
            {gameState.battleState ? (
              <BattleDisplay
                battleState={gameState.battleState}
                closeBattle={closeBattle}
              />
            ) : activeTab === "Jobs" ? (
              <JobsTab
                jobs={gameState.jobs}
                gameState={gameState}
                playerStats={playerStats}
                maxActiveJobs={maxLimits.maxActiveJobs}
                toggleJobActive={toggleJobActive}
              />
            ) : activeTab === "Skills" ? (
              <SkillsTab
                skills={gameState.skills}
                gameState={gameState}
                maxActiveSkills={maxLimits.maxActiveSkills}
                toggleSkillActive={toggleSkillActive}
              />
            ) : activeTab === "Abilities" ? (
              <AbilitiesTab
                abilities={gameState.abilities}
                maxActiveAbilities={maxLimits.maxActiveAbilities}
                maxBattleAbilities={maxLimits.maxBattleAbilities}
                playerStats={playerStats}
                gameState={gameState}
                toggleAbilityTraining={toggleAbilityTraining}
                toggleAbilityBattle={toggleAbilityBattle}
              />
            ) : activeTab === "Boss" ? (
              <BossTab
                bossData={currentBossData}
                bossProgress={gameState.bossProgress}
                startBattle={startBossBattle}
              />
            ) : activeTab === "Ascension" ? (
              <AscensionTab
                gameState={gameState}
                buyAscensionUpgrade={buyAscensionUpgrade}
                ascend={ascend}
              />
            ) : activeTab === "Paths" ? (
              <PathsTab
                gameState={gameState}
                selectPath={selectPath}
              />
            ) : activeTab === "Settings" ? (
              <SettingsTab
                onReset={resetGame}
              />
            ) : null}
          </div>
        </div>
      </main>

      <AlertToast message={alert.message} visible={alert.visible} />

      {/* Stats Details Modal */}
      <Modal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        title="Character Stats"
      >
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(playerStats).map(([statId, value]) => {
              const statInfo = STAT_MAP[statId as keyof typeof playerStats];
              const StatIcon = statInfo.icon;
              
              // Format display value
              let displayValue = value.toString();
              if (statId === 'CRIT_C') {
                displayValue = value.toFixed(1); // Raw value, no percentage
              } else if (statId === 'CRIT_D') {
                displayValue = `${value.toFixed(0)}%`;
              }
              
              return (
                <div
                  key={statId}
                  className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="rounded-lg p-2 bg-teal-500/20 text-teal-400">
                      <StatIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white">{statInfo.name}</h4>
                      <p className="text-xs text-slate-500">{statId}</p>
                    </div>
                    <div className="text-2xl font-bold text-teal-400">
                      {displayValue}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {statInfo.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Total Level Info */}
          <div className="rounded-xl border border-teal-500/40 bg-teal-500/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-teal-400">Total Level</h4>
                <p className="text-xs text-slate-400 mt-1">Combined levels from all jobs</p>
              </div>
              <div className="text-3xl font-bold text-teal-400">
                {totalLevels}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default App;

