// src/components/JobsTab.tsx - REFACTORED

import React from "react";
import type { GameState, PlayerStats } from "../types/game";
import { JOB_DATA, STAT_MAP } from "../core/data";
import { calculateLevelFromExp, isJobUnlocked, isJobAvailable } from "../core/utils";
import type { JobDefinition } from "../types/data";

// Define the required props for the JobsTab component
interface JobsTabProps {
  jobs: GameState["jobs"];
  gameState: GameState;
  playerStats: PlayerStats;
  maxActiveJobs: number;
  toggleJobActive: (jobId: string) => void;
}

const JobsTab: React.FC<JobsTabProps> = ({
  jobs,
  gameState,
  playerStats,
  maxActiveJobs,
  toggleJobActive,
}) => {
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

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-teal-500 to-charcoal-500"></div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Active Jobs</h2>
          <p className="text-sm sm:text-base text-white/70 mt-1">
            Manage your active professions • {maxActiveJobs} max active
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 sm:p-7 backdrop-blur-sm">
        <p className="text-white/80 text-sm sm:text-base leading-relaxed">
          Choose which jobs to keep <span className="font-semibold text-teal-500">Active</span>. 
          Active jobs passively gain EXP over time. Only{" "}
          <span className="font-semibold text-teal-500">{maxActiveJobs}</span> job
          {maxActiveJobs !== 1 ? "s" : ""} can be active simultaneously.
        </p>
      </div>

      {/* Available Jobs */}
      <div className="grid gap-5 sm:gap-6 md:grid-cols-1 lg:grid-cols-2">
        {availableJobIds.map((jobId) => {
          const job = jobs[jobId];
          const data = JOB_DATA[jobId] as JobDefinition;

          const { level, currentLevelExp, expNeeded } = calculateLevelFromExp(job.exp);
          const progressPercent = (currentLevelExp / expNeeded) * 100;

          return (
            <div
              key={jobId}
              className={`group relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-300 p-6 ${
                job.isActive
                  ? "border-teal-500/60 bg-gradient-to-br from-teal-500/20 via-teal-500/10 to-transparent shadow-[0_35px_70px_-40px_rgba(42,157,143,0.55)]"
                  : "border-slate-700/50 bg-slate-800/50 hover:border-slate-600/50 hover:bg-slate-800/70"
              }`}
            >
              <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full bg-teal-500/15 blur-2xl transition-transform duration-500 group-hover:scale-125" />
              {/* Active indicator */}
              {job.isActive && (
                <div className="absolute top-4 right-4">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
                  </span>
                </div>
              )}

              <div className="relative z-10 flex items-start gap-4">
                <div
                  className={`rounded-2xl p-3.5 transition-all duration-300 ${
                    job.isActive
                      ? "bg-teal-500/20 text-teal-400 shadow-[0_15px_35px_-25px_rgba(42,157,143,0.45)]"
                      : "bg-slate-700/30 text-slate-400"
                  }`}
                >
                  <data.icon className="h-7 w-7" />
                </div>

                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold tracking-tight text-white">
                      {data.name}
                    </h3>
                    <span className="rounded-full border border-slate-600/50 bg-slate-700/50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
                      Lvl {level}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {data.description}
                  </p>

                  {/* Traits */}
                  {data.traits && data.traits.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {data.traits.map((trait) => (
                        <span
                          key={trait}
                          className={`rounded-full px-2.5 py-1 text-xs font-medium border transition-colors ${
                            job.isActive
                              ? "border-teal-400/40 bg-teal-500/20 text-teal-300"
                              : "border-slate-600/50 bg-slate-700/40 text-slate-400"
                          }`}
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Unlock Requirements (for advanced jobs) */}
                  {data.unlockConditions && data.unlockConditions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-700/30">
                      <p className="text-xs text-slate-500 mb-2">Required to unlock:</p>
                      <div className="flex flex-wrap gap-2">
                        {data.unlockConditions.map((condition, idx) => {
                          let requirementText = "";
                          if (condition.type === "jobLevel") {
                            const jobName = JOB_DATA[condition.jobId]?.name || condition.jobId;
                            requirementText = `${jobName} Lv${condition.level}`;
                          } else if (condition.type === "stat") {
                            const statName = STAT_MAP[condition.stat]?.name || condition.stat;
                            requirementText = `${statName} ${condition.value}`;
                          }
                          return (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 rounded bg-slate-700/30 text-slate-400 border border-slate-600/30"
                            >
                              {requirementText}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* EXP Progress Bar */}
              <div className="relative z-10 mt-6 space-y-3">
                <div className="flex items-center justify-between text-xs font-medium text-white/70">
                  <span>EXP: {currentLevelExp.toFixed(1)} / {expNeeded}</span>
                  <span className="text-white">{progressPercent.toFixed(1)}%</span>
                </div>
                <div className="relative h-2.5 w-full overflow-hidden rounded-full border border-charcoal-300/40 bg-charcoal-200/30">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      job.isActive
                        ? "bg-gradient-to-r from-teal-500 via-teal-600 to-teal-500"
                        : "bg-gradient-to-r from-charcoal-500/60 to-charcoal-400/40"
                    }`}
                    style={{ width: `${Math.min(100, progressPercent)}%` }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => toggleJobActive(jobId)}
                className={`relative z-10 mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  job.isActive
                    ? "bg-gradient-to-r from-rose-400 to-rose-600 text-white shadow-[0_18px_35px_-20px_rgba(231,111,81,0.55)] hover:brightness-110"
                    : "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-[0_18px_35px_-20px_rgba(42,157,143,0.55)] hover:brightness-110"
                }`}
              >
                {job.isActive ? "Deactivate" : "Activate"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Upcoming Milestones - Small hint bar */}
      {upcomingMilestones.length > 0 && (
        <div className="mt-8 rounded-xl border border-amber-500/20 bg-slate-800/30 backdrop-blur-sm p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-amber-400 text-lg">⭐</span>
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wide">
              Upcoming Milestones
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
          <p className="text-xs text-slate-500 mt-3">
            Something special awaits at these milestones...
          </p>
        </div>
      )}
    </div>
  );
};

export default JobsTab;
