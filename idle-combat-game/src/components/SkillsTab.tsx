// src/components/SkillsTab.tsx - REFACTORED

import React from "react";
import type { GameState } from "../types/game";
import { SKILL_DATA } from "../core/data";
import { calculateExpNeeded } from "../core/utils";
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
    <div className="space-y-6">
      {" "}
      <h2 className="text-2xl font-bold text-indigo-300">Active Skills ✨</h2>
      {" "}
      <p className="text-gray-400">
        Skills provide **passive global multipliers**. You can train up
        to <span className="font-bold text-yellow-400">{maxActiveSkills}</span>{" "}
        skill{maxActiveSkills !== 1 ? "s" : ""} at a time. ({activeCount}{" "}
        active)      {" "}
      </p>
      {" "}
      <div className="space-y-4">
        {" "}
        {skillIds.map((skillId) => {
          const skill = skills[skillId];
          const data = SKILL_DATA[skillId] as SkillDefinition;
          const isUnlocked = skill.level > 0;
          const expNeeded = calculateExpNeeded(skill.level);
          const progressPercent = (skill.exp / expNeeded) * 100;
          const effectValue = data.effect.value * skill.level * 100; // Determine the base card class

          const cardClass = skill.isActive
            ? "skill-card-active"
            : "skill-card-inactive"; // Determine the button class

          let buttonClass = "skill-button-base";
          if (!isUnlocked) {
            buttonClass += " skill-button-disabled";
          } else {
            buttonClass += skill.isActive
              ? " skill-button-deactivate"
              : " skill-button-activate";
          }

          return (
            <div key={skillId} className={`skill-card-base ${cardClass}`}>
              {" "}
              <div className="flex justify-between items-center">
                {" "}
                <div className="flex items-center space-x-3">
                  {" "}
                  <data.icon className="w-6 h-6 text-cyan-400" />
                  {" "}
                  <div>
                    {" "}
                    <h3 className="text-xl font-semibold text-white">
                      {data.name} (Lvl {skill.level})
                    </h3>
                    {" "}
                    <p className="text-sm text-gray-400">{data.description}</p>
                    {" "}
                    <p className="text-sm text-yellow-300">
                      Current Effect: +{effectValue.toFixed(1)}%{" "}
                      {data.effect.type === "jobExp" ? "Job" : "Skill"} EXP
                    </p>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <button
                  onClick={() => toggleSkillActive(skillId)}
                  disabled={!isUnlocked}
                  className={buttonClass}
                >
                  {skill.isActive ? "Stop Training" : "Train"}
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
                    EXP: {skill.exp.toFixed(2)} / {expNeeded}
                  </span>
                  <span>{progressPercent.toFixed(1)}%</span>
                  {" "}
                </div>
                {" "}
                <div className="w-full bg-gray-600 rounded-full h-2.5 mt-1">
                  {" "}
                  <div
                    className="bg-cyan-500 h-2.5 rounded-full transition-all duration-300"
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

export default SkillsTab;
