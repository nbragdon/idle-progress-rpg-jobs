// src/core/utils.ts

import { EXP_BASE, EXP_GROWTH_RATE } from "./constants";

/** Calculates required experience for the next level. */
export const calculateExpNeeded = (level: number): number => {
  if (level === 0) return EXP_BASE;
  return Math.floor(EXP_BASE * Math.pow(EXP_GROWTH_RATE, level - 1));
};
