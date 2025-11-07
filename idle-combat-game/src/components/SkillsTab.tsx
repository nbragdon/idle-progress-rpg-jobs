// src/components/SkillsTab.tsx - REFACTORED

import React from "react";
import type { GameState } from "../types/game";
import { SKILL_DATA } from "../core/data";
import { calculateLevelFromExp } from "../core/utils";
import type { SkillDefinition } from "../types/data";

interface SkillsTabProps {
  skills: GameState["skills"];
  maxActiveSkills: number;
  toggleSkillActive: (skillId: string) => void;
}

const SkillsTab: React.FC<SkillsTabProps> = ({
  skills,
  maxActiveSkills,
  toggleSkillActive,
}) => {
  const skillIds = Object.keys(SKILL_DATA);
  const activeCount = Object.values(skills).filter((s) => s.isActive).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-amber-500 to-orange-500"></div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Active Skills</h2>
          <p className="text-sm sm:text-base text-white/70 mt-1">
            Train skills for passive bonuses • {activeCount} / {maxActiveSkills} active
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 sm:p-7 backdrop-blur-sm">
        <p className="text-white/80 text-sm sm:text-base leading-relaxed">
          Skills provide <span className="font-semibold text-amber-400">passive global multipliers</span>.
          You can train up to{" "}
          <span className="font-semibold text-amber-400">{maxActiveSkills}</span> skill
          {maxActiveSkills !== 1 ? "s" : ""} at a time.
        </p>
      </div>

      <div className="grid gap-5 sm:gap-6 md:grid-cols-1 lg:grid-cols-2">
        {skillIds.map((skillId) => {
          const skill = skills[skillId];
          const data = SKILL_DATA[skillId] as SkillDefinition;
          const { level, currentLevelExp, expNeeded } = calculateLevelFromExp(skill.exp);
          const isUnlocked = level > 0;
          const progressPercent = (currentLevelExp / expNeeded) * 100;
          const effectValue = data.effects[0].value * level * 100;

          return (
            <div
              key={skillId}
              className={`group relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
                skill.isActive
                  ? "border-amber-400/60 bg-gradient-to-br from-amber-400/20 via-amber-400/10 to-transparent shadow-[0_35px_70px_-40px_rgba(233,196,106,0.55)]"
                  : "border-slate-700/50 bg-slate-800/50 hover:border-slate-600/50 hover:bg-slate-800/70"
              } ${!isUnlocked ? "opacity-60" : ""}`}
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-amber-400/20 blur-2xl transition-transform duration-500 group-hover:scale-125" />
              {/* Active indicator */}
              {skill.isActive && (
                <div className="absolute top-3 right-3">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                  </span>
                </div>
              )}

              <div className="relative z-10 flex items-start gap-4">
                <div
                  className={`rounded-2xl p-3.5 transition-all duration-300 ${
                    skill.isActive
                      ? "bg-amber-400/20 text-amber-700 shadow-[0_15px_35px_-25px_rgba(233,196,106,0.45)]"
                      : "bg-charcoal-200/20 text-white/70"
                  }`}
                >
                  <data.icon className="h-7 w-7" />
                </div>

                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold tracking-tight text-white">
                      {data.name}
                    </h3>
                    <span className="rounded-full border border-charcoal-300/50 bg-charcoal-200/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/70">
                      Lvl {level}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-white/70">
                    {data.description}
                  </p>
                  <div className="inline-flex items-center gap-3 rounded-full border border-teal-500/40 bg-teal-500/15 px-3 py-1 text-xs font-semibold text-teal-600">
                    <span>+{effectValue.toFixed(1)}%</span>
                    <span className="text-white/70">
                      {data.effects[0].type === "jobExp" ? "Job" : "Skill"} EXP
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-6 space-y-3">
                <div className="flex items-center justify-between text-xs font-medium text-white/70">
                  <span>EXP: {currentLevelExp.toFixed(1)} / {expNeeded}</span>
                  <span className="text-white">{progressPercent.toFixed(1)}%</span>
                </div>
                <div className="relative h-2.5 w-full overflow-hidden rounded-full border border-charcoal-300/40 bg-charcoal-200/30">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      skill.isActive
                        ? "bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500"
                        : "bg-gradient-to-r from-charcoal-500/60 to-charcoal-400/40"
                    }`}
                    style={{ width: `${Math.min(100, progressPercent)}%` }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => toggleSkillActive(skillId)}
                disabled={!isUnlocked}
                className={`relative z-10 mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  !isUnlocked
                    ? "cursor-not-allowed border border-charcoal-200/30 bg-charcoal-200/20 text-charcoal-700/40"
                    : skill.isActive
                    ? "bg-gradient-to-r from-rose-400 to-rose-600 text-white shadow-[0_18px_35px_-20px_rgba(231,111,81,0.55)] hover:brightness-110"
                    : "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-[0_18px_35px_-20px_rgba(244,162,97,0.55)] hover:brightness-110"
                }`}
              >
                {skill.isActive ? "Stop Training" : "Train"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillsTab;
