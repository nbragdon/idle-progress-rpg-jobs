// src/components/SettingsTab.tsx

import React, { useState } from "react";

interface SettingsTabProps {
  onReset: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ onReset }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    setShowConfirm(true);
  };

  const confirmReset = () => {
    onReset();
    setShowConfirm(false);
  };

  const cancelReset = () => {
    setShowConfirm(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-slate-500 to-slate-600"></div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Settings</h2>
          <p className="text-sm sm:text-base text-white/70 mt-1">
            Manage your game preferences
          </p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6 sm:p-7">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-rose-400 text-2xl">⚠️</span>
          <h3 className="text-lg font-semibold text-rose-400 uppercase tracking-wide">
            Danger Zone
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-white font-semibold mb-2">Reset Game Progress</h4>
            <p className="text-sm text-slate-400 mb-4">
              This will permanently delete all your progress, including jobs, skills, abilities, and stats. 
              This action cannot be undone.
            </p>

            {!showConfirm ? (
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/50 font-semibold hover:bg-rose-500/30 transition-all duration-200"
              >
                Reset All Progress
              </button>
            ) : (
              <div className="rounded-xl border border-rose-500/50 bg-rose-500/10 p-4">
                <p className="text-rose-300 font-semibold mb-4">
                  Are you absolutely sure? This cannot be undone!
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={confirmReset}
                    className="px-6 py-2.5 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-all duration-200"
                  >
                    Yes, Reset Everything
                  </button>
                  <button
                    onClick={cancelReset}
                    className="px-6 py-2.5 rounded-lg bg-slate-700 text-white font-semibold hover:bg-slate-600 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Game Info */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 sm:p-7">
        <h3 className="text-lg font-semibold text-white mb-4">Game Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Version</span>
            <span className="text-white font-mono">0.1.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Save System</span>
            <span className="text-white">LocalStorage (Auto-save)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;

