// src/core/combatSystem.ts
// Battle system logic

import type { PlayerStats } from "../types/game";
import type { AbilityDefinition, DamageType } from "../types/data";
import { StatValue } from "../types/game";
import { DamageValue } from "../types/data";
import {
  PLAYER_BASE_HP,
  HP_PER_CONSTITUTION,
  MIN_DAMAGE_PERCENT,
  MIN_HIT_CHANCE,
  CRIT_REDUCTION_PER_DEFENSE,
  ABILITY_LEVEL_REDUCTION,
} from "./constants";

export interface BattleLogEntry {
  time: number;
  message: string;
  type: "player" | "boss" | "result";
  value?: string;
}

export interface CombatantState {
  currentHp: number;
  maxHp: number;
  stats: PlayerStats;
  abilities: Array<{ ability: AbilityDefinition; level: number; cooldown: number }>;
}

/**
 * Calculate maximum HP based on Constitution
 */
export function calculateMaxHP(constitution: number): number {
  return PLAYER_BASE_HP + constitution * HP_PER_CONSTITUTION;
}

/**
 * Calculate hit chance based on attacker DEX and defender AGI
 * Uses diminishing returns formula with minimum 10% hit chance
 */
export function calculateHitChance(attackerDex: number, defenderAgi: number): number {
  // Base hit chance with DEX vs AGI
  // Formula: 100 / (100 + (defenderAgi - attackerDex))
  const agiAdvantage = Math.max(0, defenderAgi - attackerDex);
  const hitChance = 100 / (100 + agiAdvantage);
  
  return Math.max(MIN_HIT_CHANCE, hitChance);
}

/**
 * Calculate damage reduction based on damage type and defender stats
 * Uses diminishing returns with minimum 10% damage dealt
 */
export function calculateDamageReduction(
  damageType: DamageType,
  defenderStats: PlayerStats
): number {
  if (damageType === DamageValue.True) {
    return 1.0; // True damage is not reduced
  }

  const defense =
    damageType === DamageValue.Physical
      ? defenderStats[StatValue.TGH]
      : defenderStats[StatValue.FRT];

  // Formula: damage * (100 / (100 + defense))
  const reduction = 100 / (100 + defense);
  
  // Ensure at least 10% damage gets through
  return Math.max(MIN_DAMAGE_PERCENT, reduction);
}

/**
 * Calculate final critical chance after defensive reduction
 * Crit chance can go above 100% (guaranteed crits)
 */
export function calculateCritChance(
  baseCritChance: number,
  defenderStats: PlayerStats
): number {
  const avgDefense = (defenderStats[StatValue.TGH] + defenderStats[StatValue.FRT]) / 2;
  const reduction = avgDefense * CRIT_REDUCTION_PER_DEFENSE;
  
  // Percentage reduction (can still go above 100%)
  const finalCrit = baseCritChance * (1 - reduction);
  
  return Math.max(0, finalCrit); // Can't go below 0%
}

/**
 * Get effective base damage for an ability based on level
 */
export function getEffectiveBaseDamage(ability: AbilityDefinition, level: number): number {
  const baseDamage = ability.effects[0].baseDamage;
  
  // Check if ability has custom damage scaling
  if (ability.damageScaling && ability.damageScaling.type === "percentage") {
    const multiplier = 1 + (ability.damageScaling.value * level);
    return baseDamage * multiplier;
  }
  
  // Default: no scaling, just return base damage
  return baseDamage;
}

/**
 * Calculate final damage for an attack
 */
export function calculateDamage(
  attacker: CombatantState,
  defender: CombatantState,
  ability: AbilityDefinition,
  abilityLevel: number
): { damage: number; isCrit: boolean; didHit: boolean } {
  // Check if attack hits
  const hitChance = calculateHitChance(
    attacker.stats[StatValue.DEX],
    defender.stats[StatValue.AGI]
  );
  const didHit = Math.random() < hitChance;

  if (!didHit) {
    return { damage: 0, isCrit: false, didHit: false };
  }

  // Get base damage from ability (with level scaling)
  const effect = ability.effects[0];
  const abilityBaseDamage = getEffectiveBaseDamage(ability, abilityLevel);
  const damageType = effect.damageType;

  // Get attacker's relevant stat (STR for physical, INT for magical)
  const attackStat =
    damageType === DamageValue.Physical
      ? attacker.stats[StatValue.STR]
      : attacker.stats[StatValue.INT];

  // Base damage = ability base + stat bonus
  let baseDamage = abilityBaseDamage + attackStat;

  // Check for critical hit
  const critChance = calculateCritChance(
    attacker.stats[StatValue.CRIT_C],
    defender.stats
  );
  const isCrit = Math.random() < critChance;

  if (isCrit) {
    baseDamage *= attacker.stats[StatValue.CRIT_D];
  }

  // Apply damage reduction
  const reduction = calculateDamageReduction(damageType, defender.stats);
  const finalDamage = Math.ceil(baseDamage * reduction);

  return { damage: finalDamage, isCrit, didHit: true };
}

/**
 * Get effective cooldown for an ability based on level
 */
export function getEffectiveCooldown(ability: AbilityDefinition, level: number): number {
  // Check if ability has custom cooldown scaling
  if (ability.cooldownScaling) {
    const { reductionPerLevels, levelsPerReduction, minCooldown } = ability.cooldownScaling;
    const reductions = Math.floor(level / levelsPerReduction);
    const totalReduction = reductions * reductionPerLevels;
    const effectiveCooldown = ability.cooldown - totalReduction;
    return Math.max(minCooldown, effectiveCooldown);
  }
  
  // Default: percentage-based reduction
  return ability.cooldown * (1 - level * ABILITY_LEVEL_REDUCTION);
}

/**
 * Run a complete battle simulation
 */
export function simulateBattle(
  playerStats: PlayerStats,
  playerAbilities: Array<{ ability: AbilityDefinition; level: number }>,
  bossStats: PlayerStats,
  bossAbility: AbilityDefinition
): { won: boolean; log: BattleLogEntry[] } {
  const log: BattleLogEntry[] = [];
  let battleTime = 0;

  // Initialize combatants
  const player: CombatantState = {
    currentHp: calculateMaxHP(playerStats[StatValue.CON]),
    maxHp: calculateMaxHP(playerStats[StatValue.CON]),
    stats: playerStats,
    abilities: playerAbilities.map((pa) => ({
      ...pa,
      cooldown: 0, // Start with abilities ready
    })),
  };

  const boss: CombatantState = {
    currentHp: calculateMaxHP(bossStats[StatValue.CON]),
    maxHp: calculateMaxHP(bossStats[StatValue.CON]),
    stats: bossStats,
    abilities: [
      {
        ability: bossAbility,
        level: 1,
        cooldown: 0, // Start ready
      },
    ],
  };

  log.push({
    time: battleTime,
    message: `Battle Start! Player HP: ${player.currentHp} | Boss HP: ${boss.currentHp}`,
    type: "result",
  });

  // Battle loop (max 5 minutes to prevent infinite battles)
  const MAX_BATTLE_TIME = 300;
  
  while (player.currentHp > 0 && boss.currentHp > 0 && battleTime < MAX_BATTLE_TIME) {
    battleTime += 0.1;

    // Process player abilities
    for (const pa of player.abilities) {
      if (pa.cooldown <= 0) {
        const { damage, isCrit, didHit } = calculateDamage(player, boss, pa.ability, pa.level);
        
        if (!didHit) {
          log.push({
            time: battleTime,
            message: `Player's ${pa.ability.name} missed!`,
            type: "player",
          });
        } else {
          boss.currentHp -= damage;
          const critText = isCrit ? " CRITICAL!" : "";
          log.push({
            time: battleTime,
            message: `Player uses ${pa.ability.name}: ${damage} damage${critText}`,
            type: "player",
          });

          if (boss.currentHp <= 0) {
            break; // Battle ends, player wins
          }
        }

        // Reset cooldown
        pa.cooldown = getEffectiveCooldown(pa.ability, pa.level);
      } else {
        pa.cooldown -= 0.1;
      }
    }

    // Check if boss is defeated
    if (boss.currentHp <= 0) {
      break;
    }

    // Process boss abilities
    for (const ba of boss.abilities) {
      if (ba.cooldown <= 0) {
        const { damage, isCrit, didHit } = calculateDamage(boss, player, ba.ability, ba.level);
        
        if (!didHit) {
          log.push({
            time: battleTime,
            message: `Boss's ${ba.ability.name} missed!`,
            type: "boss",
          });
        } else {
          player.currentHp -= damage;
          const critText = isCrit ? " CRITICAL!" : "";
          log.push({
            time: battleTime,
            message: `Boss uses ${ba.ability.name}: ${damage} damage${critText}`,
            type: "boss",
          });

          if (player.currentHp <= 0) {
            break; // Battle ends, boss wins
          }
        }

        // Reset cooldown
        ba.cooldown = getEffectiveCooldown(ba.ability, ba.level);
      } else {
        ba.cooldown -= 0.1;
      }
    }
  }

  // Determine winner
  const won = player.currentHp > 0;

  log.push({
    time: battleTime,
    message: won ? "Victory!" : "Defeat!",
    type: "result",
    value: won ? "Win" : "Loss",
  });

  return { won, log };
}

