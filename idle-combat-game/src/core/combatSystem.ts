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
 * 
 * Formula breakdown:
 * - DEX >= AGI: 100% hit (no dodge if attacker's DEX matches or exceeds defender's AGI)
 * - AGI = DEX: 75% hit (25% dodge)
 * - AGI = 2x DEX: 20% hit (80% dodge)
 * - AGI > 2x DEX: Logarithmic decay from 20% down to 5% minimum
 * 
 * The logarithmic decay means it takes exponentially more AGI advantage
 * to approach the 5% minimum hit chance (95% dodge cap)
 */
export function calculateHitChance(attackerDex: number, defenderAgi: number): number {
  // Prevent division by zero
  if (attackerDex <= 0) return 0.05; // 5% if attacker has no DEX
  
  // Calculate AGI to DEX ratio
  const ratio = defenderAgi / attackerDex;
  
  let hitChance: number;
  
  if (ratio < 1.0) {
    // Attacker has higher DEX than defender's AGI - guaranteed hit
    hitChance = 1.0; // 100%
  } else if (ratio <= 2.0) {
    // Linear interpolation from 75% (at ratio=1) to 20% (at ratio=2)
    // Formula: 75 - 55 * (ratio - 1)
    // At ratio=1.0: 75 - 55*0 = 75%
    // At ratio=2.0: 75 - 55*1 = 20%
    hitChance = 0.75 - 0.55 * (ratio - 1.0);
  } else {
    // Logarithmic decay from 20% down to 5% as ratio increases beyond 2x
    // Formula: 5 + 15 / (1 + log10(1 + excess))
    // This creates a curve that asymptotically approaches 5%
    const excess = ratio - 2.0;
    hitChance = 0.05 + 0.15 / (1.0 + Math.log10(1.0 + excess));
  }
  
  return hitChance;
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
 * Calculate final critical chance based on attacker crit vs defender defenses
 * Crit chance can go above 100% (guaranteed crits)
 * Formula: When CRIT_C = 10x average defense, attacker has 100% crit chance
 */
export function calculateCritChance(
  baseCritChance: number,
  defenderStats: PlayerStats
): number {
  const avgDefense = (defenderStats[StatValue.TGH] + defenderStats[StatValue.FRT]) / 2;
  
  // Prevent division by zero - if no defense, use crit chance directly
  if (avgDefense === 0) {
    return baseCritChance;
  }
  
  // Linear scaling: CRIT_C / (10 * avgDefense) = crit chance
  // When CRIT_C = 10x avgDefense → 100% crit
  // When CRIT_C = 20x avgDefense → 200% crit (guaranteed)
  const finalCrit = baseCritChance / (10 * avgDefense);
  
  return Math.max(0, finalCrit); // Can't go below 0%
}

/**
 * Calculate status effect application chance based on attacker CONC vs defender RES
 * Favors resistance - requires 2x CONC to guarantee application
 * 
 * Formula breakdown:
 * - CONC >= 2x RES: 100% application (attacker needs DOUBLE to guarantee)
 * - CONC = RES: 50% application (fair coin flip at equal stats)
 * - RES = 2x CONC: 5% application (minimum - very strong resistance)
 * - RES > 2x CONC: 5% minimum (floor)
 */
export function calculateStatusEffectChance(
  attackerConcentration: number,
  defenderResistance: number
): number {
  // Prevent division by zero
  if (attackerConcentration <= 0) return 0.05; // 5% if attacker has no CONC
  
  // Calculate RES to CONC ratio
  const ratio = defenderResistance / attackerConcentration;
  
  let applicationChance: number;
  
  if (ratio <= 0.5) {
    // Attacker has 2x or more CONC than defender's RES - guaranteed application
    applicationChance = 1.0; // 100%
  } else if (ratio <= 1.0) {
    // Interpolation from 100% (at ratio=0.5) to 50% (at ratio=1.0)
    // Formula: 100 - 100 * (ratio - 0.5)
    // At ratio=0.5: 100 - 100*0 = 100%
    // At ratio=1.0: 100 - 100*0.5 = 50%
    applicationChance = 1.0 - 1.0 * (ratio - 0.5);
  } else if (ratio <= 2.0) {
    // Interpolation from 50% (at ratio=1.0) to 5% (at ratio=2.0)
    // Formula: 50 - 45 * (ratio - 1.0)
    // At ratio=1.0: 50 - 45*0 = 50%
    // At ratio=2.0: 50 - 45*1 = 5%
    applicationChance = 0.50 - 0.45 * (ratio - 1.0);
  } else {
    // Floor at 5% for any ratio beyond 2x
    applicationChance = 0.05;
  }
  
  return applicationChance;
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
    // CRIT_D stored as percentage (e.g., 150 = 150% damage)
    baseDamage *= (attacker.stats[StatValue.CRIT_D] / 100);
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

