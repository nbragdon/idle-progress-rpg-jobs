// src/components/StatusEffectDisplay.tsx
// Components for displaying and interacting with status effects during battle

import React, { useState } from "react";
import type { ActiveStatusEffect } from "../types/data";
import { StatusEffectValue } from "../types/data";
import { FaShieldAlt, FaBolt } from "react-icons/fa";
import { GiPoisonBottle, GiStunGrenade, GiSwordBreak, GiSilenced, GiMuscleUp, GiBrokenShield } from "react-icons/gi";

// Status Effect Icon Component
const StatusEffectIcon: React.FC<{ 
  effect: ActiveStatusEffect; 
  onClick: () => void;
}> = ({ effect, onClick }) => {
  const getStatusEffectInfo = (type: string) => {
    switch (type) {
      case StatusEffectValue.Stun:
        return { icon: GiStunGrenade, color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/50", name: "Stunned" };
      case StatusEffectValue.Poison:
        return { icon: GiPoisonBottle, color: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/50", name: "Poisoned" };
      case StatusEffectValue.Disarm:
        return { icon: GiSwordBreak, color: "text-orange-400", bg: "bg-orange-500/20", border: "border-orange-500/50", name: "Disarmed" };
      case StatusEffectValue.Silence:
        return { icon: GiSilenced, color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500/50", name: "Silenced" };
      case StatusEffectValue.Shield:
        return { icon: FaShieldAlt, color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/50", name: "Shielded" };
      case StatusEffectValue.Weak:
        return { icon: GiBrokenShield, color: "text-rose-400", bg: "bg-rose-500/20", border: "border-rose-500/50", name: "Weakened" };
      case StatusEffectValue.Strong:
        return { icon: GiMuscleUp, color: "text-cyan-400", bg: "bg-cyan-500/20", border: "border-cyan-500/50", name: "Strengthened" };
      default:
        return { icon: FaBolt, color: "text-slate-400", bg: "bg-slate-500/20", border: "border-slate-500/50", name: "Effect" };
    }
  };

  const info = getStatusEffectInfo(effect.type);
  const Icon = info.icon;

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col items-center gap-1 p-2 rounded-lg ${info.bg} ${info.border} border cursor-pointer hover:brightness-125 transition-all`}
      title={`${info.name}: ${effect.duration.toFixed(1)}s`}
    >
      <Icon className={`h-4 w-4 ${info.color}`} />
      <span className="text-xs font-mono font-bold text-white">
        {effect.duration.toFixed(1)}s
      </span>
    </div>
  );
};

// Status Effect Details Modal
const StatusEffectModal: React.FC<{
  effect: ActiveStatusEffect;
  onClose: () => void;
}> = ({ effect, onClose }) => {
  const getStatusEffectDetails = (effect: ActiveStatusEffect) => {
    const base = {
      icon: FaBolt,
      color: "text-slate-400",
      name: "Effect",
      description: "Status effect active.",
    };

    switch (effect.type) {
      case StatusEffectValue.Stun:
        return {
          icon: GiStunGrenade,
          color: "text-amber-400",
          name: "Stunned",
          description: "Cooldowns are frozen. Cannot use abilities.",
        };
      case StatusEffectValue.Poison:
        return {
          icon: GiPoisonBottle,
          color: "text-green-400",
          name: "Poisoned",
          description: `Taking ${effect.value} true damage per second.`,
        };
      case StatusEffectValue.Disarm:
        return {
          icon: GiSwordBreak,
          color: "text-orange-400",
          name: "Disarmed",
          description: "Cannot use physical abilities.",
        };
      case StatusEffectValue.Silence:
        return {
          icon: GiSilenced,
          color: "text-purple-400",
          name: "Silenced",
          description: "Cannot use magical abilities.",
        };
      case StatusEffectValue.Shield:
        return {
          icon: FaShieldAlt,
          color: "text-blue-400",
          name: "Shielded",
          description: `Absorbing up to ${Math.ceil(effect.value)} damage before HP is affected.`,
        };
      case StatusEffectValue.Weak:
        return {
          icon: GiBrokenShield,
          color: "text-rose-400",
          name: "Weakened",
          description: `Damage dealt reduced by ${effect.value}%.`,
        };
      case StatusEffectValue.Strong:
        return {
          icon: GiMuscleUp,
          color: "text-cyan-400",
          name: "Strengthened",
          description: `Damage dealt increased by ${effect.value}%.`,
        };
      default:
        return base;
    }
  };

  const details = getStatusEffectDetails(effect);
  const Icon = details.icon;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-lg bg-slate-700/50`}>
            <Icon className={`h-6 w-6 ${details.color}`} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${details.color}`}>{details.name}</h3>
            <p className="text-xs text-slate-400">Status Effect</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-sm text-slate-300">{details.description}</p>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Duration:</span>
            <span className="font-mono font-bold text-white">{effect.duration.toFixed(1)}s</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Source:</span>
            <span className={`font-semibold ${effect.source === "player" ? "text-teal-400" : "text-rose-400"}`}>
              {effect.source === "player" ? "Player" : "Boss"}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Main Status Effect Display Component
interface StatusEffectDisplayProps {
  effects: ActiveStatusEffect[];
  label?: string;
}

const StatusEffectDisplay: React.FC<StatusEffectDisplayProps> = ({ effects, label = "Active Effects" }) => {
  const [selectedEffect, setSelectedEffect] = useState<ActiveStatusEffect | null>(null);

  if (effects.length === 0) {
    return null;
  }

  return (
    <>
      <div className="mt-3">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">{label}</p>
        <div className="flex flex-wrap gap-2">
          {effects.map((effect, index) => (
            <StatusEffectIcon
              key={index}
              effect={effect}
              onClick={() => setSelectedEffect(effect)}
            />
          ))}
        </div>
      </div>

      {selectedEffect && (
        <StatusEffectModal
          effect={selectedEffect}
          onClose={() => setSelectedEffect(null)}
        />
      )}
    </>
  );
};

export default StatusEffectDisplay;

