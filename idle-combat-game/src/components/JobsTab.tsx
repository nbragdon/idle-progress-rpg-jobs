// src/components/JobsTab.tsx - REFACTORED WITH MODAL

import React, { useState } from "react";
import type { GameState, PlayerStats } from "../types/game";
import { JOB_DATA, STAT_MAP } from "../core/data";
import { calculateLevelFromExp, isJobAvailable } from "../core/utils";
import type { JobDefinition } from "../types/data";
import Modal from "./Modal";
import { calculateJobExpPerSecond } from "../core/expCalculations";

// Define the required props for the JobsTab component
interface JobsTabProps {
  jobs: GameState["jobs"];
  gameState: GameState;
  playerStats: PlayerStats;
  maxActiveJobs: number;
  toggleJobActive: (jobId: string) => void;
  toggleAutoTrainingJobs: () => void;
}

const JobsTab: React.FC<JobsTabProps> = ({
  jobs,
  gameState,
  playerStats,
  maxActiveJobs,
  toggleJobActive,
  toggleAutoTrainingJobs,
}) => {
  // Modal state
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Retrieve all job IDs and filter by availability
  const allJobIds = Object.keys(JOB_DATA);
  const availableJobIds = allJobIds.filter((jobId) => 
    isJobAvailable(jobId, gameState)
  );
  
  // Get upcoming milestones (main path unlocks only)
  const mainPathUnlocks = [
    { jobId: "Guardian", requirement: "Warrior Level 10" },
    { jobId: "Wizard", requirement: "Mage Level 10" },
    { jobId: "Shadow", requirement: "Rogue Level 10" },
  ];
  
  const upcomingMilestones = mainPathUnlocks
    .filter(unlock => !isJobAvailable(unlock.jobId, gameState))
    .slice(0, 3);

  // Get selected job data for modal
  const selectedJob = selectedJobId ? jobs[selectedJobId] : null;
  const selectedJobData = selectedJobId ? JOB_DATA[selectedJobId] as JobDefinition : null;
  const selectedJobLevel = selectedJob ? calculateLevelFromExp(selectedJob.exp) : null;

  // Check if auto-training is enabled
  const hasAutoTraining = (gameState.permanentUpgrades.autoTrainAllJobs || 0) > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-teal-500 to-charcoal-500"></div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Active Jobs</h2>
          <p className="text-sm sm:text-base text-white/70 mt-2">
            {maxActiveJobs} max active • Click for details
          </p>
        </div>
      </div>
      
      {/* Auto-Training Banner */}
      {(gameState.permanentUpgrades.autoTrainAllJobs || 0) > 0 && (
        <div className="rounded-xl bg-gradient-to-r from-purple-500/20 to-teal-500/20 border border-purple-500/30 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">✨</div>
              <div>
                <h3 className="text-lg font-semibold text-white">Omnipresent Training</h3>
                <p className="text-sm text-slate-300">
                  {gameState.settings.autoTrainingEnabled.jobs 
                    ? "All unlocked jobs are automatically training" 
                    : "Auto-training disabled - toggle to re-enable"}
                </p>
              </div>
            </div>
            <button
              onClick={toggleAutoTrainingJobs}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                gameState.settings.autoTrainingEnabled.jobs
                  ? "bg-teal-500 text-white hover:brightness-110"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {gameState.settings.autoTrainingEnabled.jobs ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      )}

      {/* Compact Job Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {availableJobIds.map((jobId) => {
          const job = jobs[jobId];
          const data = JOB_DATA[jobId] as JobDefinition;
          const { level, currentLevelExp, expNeeded } = calculateLevelFromExp(job.exp);
          const progressPercent = (currentLevelExp / expNeeded) * 100;
          const expPerSecond = calculateJobExpPerSecond(jobId, gameState);

          return (
            <div
              key={jobId}
              className={`group relative overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                job.isActive
                  ? "border-teal-500/60 bg-gradient-to-br from-teal-500/20 via-teal-500/10 to-transparent shadow-lg"
                  : "border-slate-700/50 bg-slate-800/50 hover:border-slate-600/50"
              }`}
            >
              {/* Active indicator */}
              {job.isActive && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
                  </span>
                </div>
              )}

              {/* Clickable area for details */}
              <button
                onClick={() => setSelectedJobId(jobId)}
                className="w-full p-5 text-left transition-all hover:bg-slate-800/30"
              >
                <div className="flex items-start gap-3 mb-3">
                  {/* Icon */}
                  <div
                    className={`rounded-xl p-2.5 transition-all ${
                      job.isActive
                        ? "bg-teal-500/20 text-teal-400"
                        : "bg-slate-700/30 text-slate-400"
                    }`}
                  >
                    <data.icon className="h-5 w-5" />
                  </div>

                  {/* Name & Level */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-base font-semibold text-white truncate">
                        {data.name}
                      </h3>
                      <span className="rounded-full border border-slate-600/50 bg-slate-700/50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300 shrink-0">
                        {level}
                      </span>
                      {/* Traits */}
                      {data.traits?.map((trait, idx) => (
                        <span
                          key={idx}
                          className="rounded px-1.5 py-0.5 text-[9px] font-medium bg-teal-900/30 text-teal-300 border border-teal-700/30 shrink-0"
                          title={`${trait} trait`}
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                    
                    {/* Stat Gains - compact */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {data.statBonuses.map((bonus, idx) => {
                        const StatIcon = STAT_MAP[bonus.stat].icon;
                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-1 text-[10px] text-slate-400"
                            title={`+${bonus.value} ${STAT_MAP[bonus.stat].name} per level`}
                          >
                            <StatIcon className="h-3 w-3" />
                            <span className="font-medium">{bonus.value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-medium text-center mb-0.5">
                    <span className={job.isActive ? "text-teal-400" : "text-slate-500"}>
                      +{expPerSecond.toFixed(1)} XP/s
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-medium text-white/60">
                    <span>{progressPercent.toFixed(0)}%</span>
                    <span>{currentLevelExp.toFixed(0)} / {expNeeded}</span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-700/50">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        job.isActive
                          ? "bg-gradient-to-r from-teal-500 to-teal-600"
                          : "bg-slate-600/60"
                      }`}
                      style={{ width: `${Math.min(100, progressPercent)}%` }}
                    />
                  </div>
                </div>
              </button>

              {/* Action Button */}
              <div className="px-5 pb-4">
                <button
                  onClick={() => toggleJobActive(jobId)}
                  className={`w-full rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                    job.isActive
                      ? "bg-gradient-to-r from-rose-400 to-rose-600 text-white hover:brightness-110"
                      : "bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:brightness-110"
                  }`}
                >
                  {job.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Milestones */}
      {upcomingMilestones.length > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-slate-800/30 backdrop-blur-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-amber-400">⭐</span>
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wide">
              Upcoming Unlocks
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {upcomingMilestones.map((milestone, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600/50 text-xs text-slate-300"
              >
                <span className="text-slate-500">🔒</span>
                <span>{milestone.requirement}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={selectedJobId !== null}
        onClose={() => setSelectedJobId(null)}
        title={selectedJobData?.name}
      >
        {selectedJob && selectedJobData && selectedJobLevel && (
          <div className="space-y-6">
            {/* Header with icon and level */}
            <div className="flex items-start gap-4">
              <div className="rounded-2xl p-4 bg-teal-500/20 text-teal-400">
                <selectedJobData.icon className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="rounded-full border border-slate-600/50 bg-slate-700/50 px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-slate-300">
                    Level {selectedJobLevel.level}
                  </span>
                  {selectedJob.isActive && (
                    <span className="rounded-full px-3 py-1 text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      ● Active
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-slate-300">
                  {selectedJobData.description}
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
              <div className="flex items-center justify-between text-sm font-medium text-white/70 mb-2">
                <span>Experience Progress</span>
                <span className="text-white">{((selectedJobLevel.currentLevelExp / selectedJobLevel.expNeeded) * 100).toFixed(1)}%</span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-700/50 mb-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-600"
                  style={{ width: `${Math.min(100, (selectedJobLevel.currentLevelExp / selectedJobLevel.expNeeded) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-400">
                {selectedJobLevel.currentLevelExp.toFixed(1)} / {selectedJobLevel.expNeeded} XP
              </p>
            </div>

            {/* Stat Bonuses */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Stat Gains per Level</h4>
              <div className="grid grid-cols-2 gap-3">
                {selectedJobData.statBonuses.map((bonus, idx) => {
                  const StatIcon = STAT_MAP[bonus.stat].icon;
                  const statName = STAT_MAP[bonus.stat].name;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-800/50 p-3"
                    >
                      <div className="rounded-lg p-2 bg-teal-500/20 text-teal-400">
                        <StatIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-400 truncate">{statName}</p>
                        <p className="text-sm font-semibold text-white">+{bonus.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Traits */}
            {selectedJobData.traits && selectedJobData.traits.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Job Traits</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJobData.traits.map((trait) => (
                    <span
                      key={trait}
                      className="rounded-full px-4 py-1.5 text-sm font-medium border border-teal-400/40 bg-teal-500/20 text-teal-300"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Unlock Requirements */}
            {selectedJobData.unlockConditions && selectedJobData.unlockConditions.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Unlock Requirements</h4>
                <div className="space-y-2">
                  {selectedJobData.unlockConditions.map((condition, idx) => {
                    let requirementText = "";
                    let isMet = false;
                    
                    if (condition.type === "jobLevel") {
                      const jobName = JOB_DATA[condition.jobId]?.name || condition.jobId;
                      requirementText = `${jobName} Level ${condition.level}`;
                      const currentLevel = calculateLevelFromExp(jobs[condition.jobId].exp).level;
                      isMet = currentLevel >= condition.level;
                    } else if (condition.type === "stat") {
                      const statName = STAT_MAP[condition.stat]?.name || condition.stat;
                      requirementText = `${statName} ${condition.value}`;
                      isMet = playerStats[condition.stat] >= condition.value;
                    }
                    
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                          isMet
                            ? "bg-teal-500/10 border-teal-500/30 text-teal-300"
                            : "bg-slate-700/30 border-slate-600/30 text-slate-400"
                        }`}
                      >
                        <span>{isMet ? "✓" : "○"}</span>
                        <span className="text-sm">{requirementText}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default JobsTab;
