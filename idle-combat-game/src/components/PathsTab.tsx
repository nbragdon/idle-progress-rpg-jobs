// src/components/PathsTab.tsx

import React, { useMemo } from "react";
import { PATH_DATA } from "../core/data";
import type { GameState } from "../types/game";
import type { PathDefinition, PathEffect } from "../types/data";

interface PathsTabProps {
  gameState: GameState;
  selectPath: (pathId: string) => void;
}

const PathsTab: React.FC<PathsTabProps> = ({ gameState, selectPath }) => {
  const { pathState } = gameState;
  const selectedPath = pathState.selectedPathId ? PATH_DATA[pathState.selectedPathId] : null;
  
  // Calculate current growth progress (0 to 1)
  const growthProgress = useMemo(() => {
    if (!pathState.selectedPathId || pathState.selectionTime === 0) return 0;
    
    const elapsed = Date.now() - pathState.selectionTime;
    const oneHour = 60 * 60 * 1000;
    return Math.min(1, elapsed / oneHour);
  }, [pathState.selectedPathId, pathState.selectionTime]);
  
  // Calculate current multipliers for the selected path
  const currentMultipliers = useMemo(() => {
    if (!selectedPath) return null;
    
    return selectedPath.effects.map(effect => {
      const current = effect.baseValue + (effect.maxValue - effect.baseValue) * growthProgress;
      return {
        ...effect,
        currentValue: current,
      };
    });
  }, [selectedPath, growthProgress]);
  
  // Format effect description
  const formatEffectDescription = (effect: PathEffect & { currentValue?: number }) => {
    const currentMult = effect.currentValue ? `${effect.currentValue.toFixed(2)}x` : `${effect.baseValue.toFixed(2)}x`;
    const maxMult = `${effect.maxValue.toFixed(2)}x`;
    
    if (effect.type === "traitJobExp" && effect.trait) {
      return `${currentMult} → ${maxMult} EXP for ${effect.trait} trait jobs`;
    } else if (effect.type === "jobExp") {
      return `${currentMult} → ${maxMult} EXP for all jobs`;
    } else if (effect.type === "skillExp") {
      return `${currentMult} → ${maxMult} EXP for all skills`;
    } else if (effect.type === "abilityExp") {
      return `${currentMult} → ${maxMult} EXP for all abilities`;
    }
    return "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Paths</h2>
        <p className="text-slate-400 text-sm">
          Choose a path to gain powerful bonuses. Path bonuses grow over 1 hour. You can only change paths after ascending.
        </p>
        <p className="text-slate-300 text-sm mt-2">
          Total Ascensions: <span className="text-teal-400 font-semibold">{pathState.totalAscensions}</span>
        </p>
      </div>
      
      {/* Selected Path Display */}
      {selectedPath && (
        <div className="rounded-xl border border-teal-500/50 bg-teal-500/10 p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="rounded-lg p-3 bg-teal-500/20 text-teal-400">
              <selectedPath.icon className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">{selectedPath.name}</h3>
              <p className="text-slate-300 text-sm">{selectedPath.description}</p>
            </div>
          </div>
          
          {/* Growth Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">Growth Progress</span>
              <span className="text-sm font-bold text-teal-400">{(growthProgress * 100).toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-teal-400 transition-all duration-300"
                style={{ width: `${growthProgress * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {growthProgress >= 1 ? "Maximum power reached!" : `Time remaining: ${Math.ceil((1 - growthProgress) * 60)} minutes`}
            </p>
          </div>
          
          {/* Current Bonuses */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-300 mb-2">Active Bonuses:</h4>
            {currentMultipliers?.map((effect, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="text-teal-400">▸</span>
                <span className="text-slate-200">{formatEffectDescription(effect)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Available Paths */}
      {!selectedPath && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(PATH_DATA).map((path: PathDefinition) => (
            <div
              key={path.id}
              className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-5 hover:border-teal-500/50 hover:bg-slate-800/60 transition-all cursor-pointer"
              onClick={() => selectPath(path.id)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg p-2 bg-teal-500/20 text-teal-400">
                  <path.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{path.name}</h3>
              </div>
              
              <p className="text-slate-400 text-sm mb-4">{path.description}</p>
              
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Bonuses:</h4>
                {path.effects.map((effect, index) => (
                  <div key={index} className="text-sm text-slate-300">
                    <span className="text-teal-400">▸</span> {formatEffectDescription(effect)}
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => selectPath(path.id)}
                className="w-full mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors"
              >
                Select Path
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Info Box */}
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
        <h4 className="text-sm font-semibold text-amber-400 mb-2">💡 Path Tips</h4>
        <ul className="space-y-1 text-xs text-slate-300">
          <li>• Path bonuses start at their base value and grow linearly over 1 hour</li>
          <li>• After 1 hour, bonuses reach their maximum value and stop growing</li>
          <li>• You can only select one path per ascension</li>
          <li>• Paths are reset when you ascend, allowing you to choose a different one</li>
        </ul>
      </div>
    </div>
  );
};

export default PathsTab;

