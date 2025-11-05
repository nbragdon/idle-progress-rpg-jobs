// src/components/BossTab.tsx - REFACTORED

import React from "react";
import type { GameState, BossProgress } from "../types/game";
import { GiBossKey, GiCrossedSwords } from "react-icons/gi";
import { FaHeart } from "react-icons/fa";
import type { BossDefinition } from "../types/data";

interface BossTabProps {
  bossData: BossDefinition | undefined;
  bossProgress: GameState["bossProgress"];
  startBattle: () => void;
}

const BossTab: React.FC<BossTabProps> = ({
  bossData,
  bossProgress,
  startBattle,
}) => {
  if (!bossData) {
    return (
      <div className="p-6 text-center bg-gray-700 rounded-xl">
        <GiBossKey className="w-10 h-10 mx-auto mb-4 text-red-500" />       {" "}
        <h2 className="text-2xl font-bold text-red-300">No Boss Available</h2>
        {" "}
        <p className="text-gray-400 mt-2">
          You have defeated the final boss! Consider **Ascending** to start a
          new, more challenging run.
        </p>
        {" "}
      </div>
    );
  }
  const currentProgress: BossProgress = bossProgress[bossData.id] || {
    defeated: 0,
    lastBattleLog: [],
  };

  return (
    <div className="space-y-6">
      {" "}
      <h2 className="text-2xl font-bold text-indigo-300">Current Nemesis 💀</h2>
      {" "}
      <div className="boss-card-container">
        {" "}
        <h3 className="text-3xl font-extrabold text-red-400 flex items-center">
          <GiBossKey className="w-8 h-8 mr-3" /> {bossData.name}       {" "}
        </h3>
        {" "}
        <div className="grid grid-cols-2 gap-4 text-sm font-mono text-gray-300">
          {" "}
          <p className="flex items-center">
            <FaHeart className="w-4 h-4 mr-2 text-red-500" /> HP:{" "}
            {bossData.baseHp}
          </p>
          {" "}
          <p className="flex items-center">
            <GiCrossedSwords className="w-4 h-4 mr-2 text-yellow-500" /> Damage:{" "}
            {bossData.baseDamage}
          </p>
          {" "}
          <p className="col-span-2">
            Boss Ability: **{bossData.bossAbility.name}** (x
            {bossData.bossAbility.effects[0].damageMultiplier} Damage,{" "}
            {bossData.bossAbility.cooldown}s Cooldown)
          </p>
          {" "}
        </div>
        {" "}
        <div className="pt-4 border-t border-gray-600">
          {" "}
          <p className="text-lg font-semibold text-white">
            Defeats:{" "}
            <span className="text-green-400">{currentProgress.defeated}</span>
          </p>
          {" "}
          <p className="text-lg font-semibold text-white">
            Reward:{" "}
            <span className="text-yellow-400">
              {bossData.ascensionPoints} Ascension Point
              {bossData.ascensionPoints !== 1 ? "s" : ""}
            </span>{" "}
            (per defeat)
          </p>
          {" "}
        </div>
        {" "}
        <button onClick={startBattle} className="boss-battle-button">
          START BATTLE        {" "}
        </button>
        {" "}
      </div>
      {/* Battle Log (Simple rendering) */}     {" "}
      <h3 className="text-xl font-bold text-gray-300">Last Battle Log</h3>     {" "}
      <div className="boss-log-box">
        {" "}
        {currentProgress.lastBattleLog.length > 0 ? (
          [...currentProgress.lastBattleLog].reverse().map((entry, index) => (
            <div
              key={index}
              className={
                entry.type === "result"
                  ? entry.value === "Win"
                    ? "text-green-500 font-bold"
                    : "text-red-500 font-bold"
                  : entry.type === "player"
                    ? "text-cyan-400"
                    : "text-yellow-400"
              }
            >
              [{entry.time.toFixed(1)}s] {entry.message}
              {" "}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No battle history yet.</p>
        )}
        {" "}
      </div>
      {" "}
    </div>
  );
};

export default BossTab;
