// src/components/SkillsTab.tsx - REFACTORED WITH MODAL

import React, { useState } from "react";
import type { GameState } from "../types/game";
import { SKILL_DATA } from "../core/data";
import { calculateLevelFromExp, isSkillAvailable, calculateTotalSkillLevels } from "../core/utils";
import type { SkillDefinition } from "../types/data";
import Modal from "./Modal";
import { calculateSkillExpPerSecond } from "../core/expCalculations";

interface SkillsTabProps {
  skills: GameState["skills"];
  gameState: GameState;
  maxActiveSkills: number;
  toggleSkillActive: (skillId: string) => void;
}

const SkillsTab: React.FC<SkillsTabProps> = ({
  skills,
  gameState,
  maxActiveSkills,
  toggleSkillActive,
}) => {
  // Modal state
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  const allSkillIds = Object.keys(SKILL_DATA);
  const availableSkillIds = allSkillIds.filter(skillId => isSkillAvailable(skillId, gameState));
  const activeCount = Object.values(skills).filter((s) => s.isActive).length;

  // Find the next locked skill to show as a milestone
  const totalSkillLevels = calculateTotalSkillLevels(gameState);
  const nextLockedSkill = allSkillIds
    .filter(skillId => !isSkillAvailable(skillId, gameState))
    .map(skillId => {
      const skillDef = SKILL_DATA[skillId];
      const condition = skillDef.unlockConditions?.[0];
      if (condition?.type === "skillTotalLevels") {
        return { skillId, requirement: `Total Skill Levels: ${condition.value}`, current: totalSkillLevels, needed: condition.value };
      }
      return null;
    })
    .filter(Boolean)
    .sort((a, b) => (a?.needed || 0) - (b?.needed || 0))[0];

  // Get selected skill data for modal
  const selectedSkill = selectedSkillId ? skills[selectedSkillId] : null;
  const selectedSkillData = selectedSkillId ? SKILL_DATA[selectedSkillId] as SkillDefinition : null;
  const selectedSkillLevel = selectedSkill ? calculateLevelFromExp(selectedSkill.exp) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-amber-500 to-orange-500"></div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Skills</h2>
          <p className="text-sm sm:text-base text-white/70 mt-2">
            {activeCount} / {maxActiveSkills} training • All skills always apply their effects • Click for details
          </p>
        </div>
      </div>

      {/* Compact Skill Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {availableSkillIds.map((skillId) => {
          const skill = skills[skillId];
          const data = SKILL_DATA[skillId] as SkillDefinition;
          const { level, currentLevelExp, expNeeded } = calculateLevelFromExp(skill.exp);
          const progressPercent = (currentLevelExp / expNeeded) * 100;
          const effectValue = data.effects[0].value * level * 100;
          const expPerSecond = calculateSkillExpPerSecond(skillId, gameState);

          return (
            <div
              key={skillId}
              className={`group relative overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                skill.isActive
                  ? "border-amber-400/60 bg-gradient-to-br from-amber-400/20 via-amber-400/10 to-transparent shadow-lg"
                  : "border-slate-700/50 bg-slate-800/50 hover:border-slate-600/50"
              }`}
            >
              {/* Active indicator */}
              {skill.isActive && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                  </span>
                </div>
              )}

              {/* Clickable area for details */}
              <button
                onClick={() => setSelectedSkillId(skillId)}
                className="w-full p-5 text-left transition-all hover:bg-slate-800/30"
              >
                <div className="flex items-start gap-3 mb-3">
                  {/* Icon */}
                  <div
                    className={`rounded-xl p-2.5 transition-all ${
                      skill.isActive
                        ? "bg-amber-400/20 text-amber-700"
                        : "bg-slate-700/30 text-slate-400"
                    }`}
                  >
                    <data.icon className="h-5 w-5" />
                  </div>

                  {/* Name & Level */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-white truncate">
                        {data.name}
                      </h3>
                      <span className="rounded-full border border-slate-600/50 bg-slate-700/50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300 shrink-0">
                        {level}
                      </span>
                    </div>
                    
                    {/* Effect - compact */}
                    <div className="text-[10px] font-semibold text-teal-600 bg-teal-500/15 px-2 py-0.5 rounded inline-block">
                      +{effectValue.toFixed(0)}% {data.effects[0].type === "jobExp" ? "Job" : "Skill"} XP
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-medium text-center mb-0.5">
                    <span className={skill.isActive ? "text-amber-400" : "text-slate-500"}>
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
                        skill.isActive
                          ? "bg-gradient-to-r from-amber-400 to-orange-400"
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
                  onClick={() => toggleSkillActive(skillId)}
                  className={`w-full rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                    skill.isActive
                      ? "bg-gradient-to-r from-rose-400 to-rose-600 text-white hover:brightness-110"
                      : "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:brightness-110"
                  }`}
                >
                  {skill.isActive ? "Stop Training" : "Train to Level"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Unlock */}
      {nextLockedSkill && (
        <div className="rounded-xl border border-amber-500/20 bg-slate-800/30 backdrop-blur-sm p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-amber-400">⭐</span>
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wide">
              Next Unlock
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-xs">🔒</span>
            <span className="text-sm text-slate-300">{nextLockedSkill.requirement}</span>
            <span className="ml-auto text-xs text-slate-500">
              ({nextLockedSkill.current} / {nextLockedSkill.needed})
            </span>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={selectedSkillId !== null}
        onClose={() => setSelectedSkillId(null)}
        title={selectedSkillData?.name}
      >
        {selectedSkill && selectedSkillData && selectedSkillLevel && (
          <div className="space-y-6">
            {/* Header with icon and level */}
            <div className="flex items-start gap-4">
              <div className="rounded-2xl p-4 bg-amber-400/20 text-amber-700">
                <selectedSkillData.icon className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="rounded-full border border-slate-600/50 bg-slate-700/50 px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-slate-300">
                    Level {selectedSkillLevel.level}
                  </span>
                  {selectedSkill.isActive && (
                    <span className="rounded-full px-3 py-1 text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      ● Leveling
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-slate-300">
                  {selectedSkillData.description}
                </p>
              </div>
            </div>

            {/* Effect */}
            <div className="rounded-xl border border-teal-500/40 bg-teal-500/10 p-4">
              <h4 className="text-xs font-semibold text-teal-400 uppercase tracking-wide mb-2">Current Effect</h4>
              <p className="text-2xl font-bold text-teal-300">
                +{(selectedSkillData.effects[0].value * selectedSkillLevel.level * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {selectedSkillData.effects[0].type === "jobExp" ? "Job Experience Gain" : "Skill Experience Gain"}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                +{(selectedSkillData.effects[0].value * 100).toFixed(1)}% per level
              </p>
            </div>

            {/* Progress */}
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
              <div className="flex items-center justify-between text-sm font-medium text-white/70 mb-2">
                <span>Experience Progress</span>
                <span className="text-white">{((selectedSkillLevel.currentLevelExp / selectedSkillLevel.expNeeded) * 100).toFixed(1)}%</span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-700/50 mb-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                  style={{ width: `${Math.min(100, (selectedSkillLevel.currentLevelExp / selectedSkillLevel.expNeeded) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-400">
                {selectedSkillLevel.currentLevelExp.toFixed(1)} / {selectedSkillLevel.expNeeded} XP
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SkillsTab;
