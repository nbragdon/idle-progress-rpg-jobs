// src/hooks/useGameUI.ts
// UI-specific state management (tabs, alerts, etc.)

import { useState, useCallback } from "react";

export type TabId = "Jobs" | "Stats" | "Skills" | "Abilities" | "Boss" | "Ascension" | "Settings";

interface AlertState {
  message: string;
  visible: boolean;
}

export const useGameUI = () => {
  const [activeTab, setActiveTab] = useState<TabId>("Jobs");
  const [alert, setAlert] = useState<AlertState>({
    message: "",
    visible: false,
  });

  const setTab = useCallback((tabId: TabId) => {
    setActiveTab(tabId);
  }, []);

  const showAlert = useCallback((message: string, duration: number = 3000) => {
    setAlert({ message, visible: true });
    setTimeout(() => {
      setAlert({ message: "", visible: false });
    }, duration);
  }, []);

  const hideAlert = useCallback(() => {
    setAlert({ message: "", visible: false });
  }, []);

  return {
    activeTab,
    setTab,
    alert,
    showAlert,
    hideAlert,
  };
};

