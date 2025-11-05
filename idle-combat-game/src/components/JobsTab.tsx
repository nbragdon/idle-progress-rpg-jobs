// src/components/JobsTab.tsx - REF ACTORED

import React from "react";
import type { GameState } from "../types/game";
import { JOB_DATA } from "../core/data";
import { calculateExpNeeded } from "../core/utils";
import type { JobDefinition } from "../types/data";

// Define the required props for the JobsTab component
interface JobsTabProps {
  jobs: GameState["jobs"];
  maxActiveJobs: number;
  toggleJobActive: (jobId: string) => void;
}

const JobsTab: React.FC<JobsTabProps> = ({
  jobs,
  maxActiveJobs,
  toggleJobActive,
}) => {
  // Retrieve all job IDs in a defined order (e.g., the order in JOB_DATA)
  const jobIds = Object.keys(JOB_DATA);

  return (
    <div className="space-y-6">
      {" "}
      <h2 className="text-2xl font-bold text-indigo-300">
        Active Jobs 💼      {" "}
      </h2>
      {" "}
      <p className="text-gray-400">
        Choose which Jobs to keep **Active**. Active jobs passively gain
        EXP over time. Only **{maxActiveJobs}** job
        {maxActiveJobs !== 1 ? "s" : ""} can be active simultaneously (The
        current implementation automatically swaps the oldest active job).      {" "}
      </p>
      {" "}
      <div className="space-y-4">
        {" "}
        {jobIds.map((jobId) => {
          const job = jobs[jobId];
          const data = JOB_DATA[jobId] as JobDefinition;

          const isUnlocked = job.level > 0;
          const expNeeded = calculateExpNeeded(job.level);
          const progressPercent = (job.exp / expNeeded) * 100; // Determine the base card class

          const cardClass = job.isActive
            ? "job-card-active"
            : "job-card-inactive"; // Determine the button class

          let buttonClass = "job-button-base";
          if (!isUnlocked) {
            buttonClass += " job-button-disabled";
          } else {
            buttonClass += job.isActive
              ? " job-button-deactivate"
              : " job-button-activate";
          }

          return (
            <div key={jobId} className={`job-card-base ${cardClass}`}>
              {" "}
              <div className="flex justify-between items-center">
                {" "}
                <div className="flex items-center space-x-3">
                  {" "}
                  <data.icon className="w-6 h-6 text-yellow-400" />
                  {" "}
                  <div>
                    {" "}
                    <h3 className="text-xl font-semibold text-white">
                      {data.name} (Lvl {job.level})
                    </h3>
                    {" "}
                    <p className="text-sm text-gray-400">{data.description}</p>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <button
                  onClick={() => toggleJobActive(jobId)}
                  disabled={!isUnlocked}
                  className={buttonClass}
                >
                  {job.isActive ? "Deactivate" : "Activate"}
                  {" "}
                </button>
                {" "}
              </div>
              {/* EXP Bar */}             {" "}
              <div className="mt-3">
                {" "}
                <div className="text-xs text-gray-300 flex justify-between">
                  {" "}
                  <span>
                    EXP: {job.exp.toFixed(2)} / {expNeeded}
                  </span>
                  <span>{progressPercent.toFixed(1)}%</span>
                  {" "}
                </div>
                {" "}
                <div className="w-full bg-gray-600 rounded-full h-2.5 mt-1">
                  {" "}
                  <div
                    className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, progressPercent)}%` }}
                  />
                  {" "}
                </div>
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

export default JobsTab;
