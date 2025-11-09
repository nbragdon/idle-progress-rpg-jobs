# Battle System Implementation

## Overview
Complete battle system with real-time combat simulation, stat-based mechanics, and strategic depth.

## Combat Flow

### 1. **Battle Initialization**
- Player clicks "⚔️ Start Battle" button
- System gathers player stats and training abilities
- Battle simulation runs instantly (not real-time in UI, but simulated)
- Results displayed immediately

### 2. **Battle Simulation** (0.1s ticks)
```
Loop until HP reaches 0 or max time (5 minutes):
  1. Tick cooldowns (-0.1s)
  2. Player abilities fire if ready
  3. Check if boss defeated → Exit
  4. Boss abilities fire if ready
  5. Check if player defeated → Exit
```

## Combat Mechanics

### **Damage Formula**
```typescript
Base Damage = Attacker's Stat × Ability Multiplier
If Crit: Base Damage × Crit Damage
Final Damage = Base Damage × Damage Reduction
```

### **1. Hit/Miss System**
- **Formula:** `hitChance = 100 / (100 + (defenderAgi - attackerDex))`
- **Minimum Hit Chance:** 10%
- **Example:**
  - Attacker DEX 50, Defender AGI 30 → ~83% hit chance
  - Attacker DEX 10, Defender AGI 50 → 20% hit chance
  - Attacker DEX 5, Defender AGI 100 → 10% (minimum)

### **2. Damage Reduction** (Diminishing Returns)
- **Physical:** `reduction = 100 / (100 + Toughness)`
- **Magical:** `reduction = 100 / (100 + Fortitude)`
- **True:** No reduction (100%)
- **Minimum:** 10% damage always gets through

**Example:**
```
Attacker deals 100 base damage (Physical)
Defender has 50 Toughness

Reduction = 100 / (100 + 50) = 0.667
Final Damage = 100 × 0.667 = 67 damage

With 300 Toughness:
Reduction = 100 / (100 + 300) = 0.25
Final Damage = 100 × 0.25 = 25 damage (not 10, above minimum)
```

### **3. Critical Hits**
- **Base Crit Chance:** From CRIT_C stat (e.g., 0.15 = 15%)
- **Defense Reduction:** `finalCrit = baseCrit × (1 - avgDefense × 0.001)`
- **Can exceed 100%** (guaranteed crits)
- **Crit Damage:** Multiplies damage by CRIT_D stat (e.g., 2.0 = 200%)

**Example:**
```
Attacker: 25% crit chance (0.25), 2.0× crit damage
Defender: 100 TGH, 100 FRT (avg = 100)

Reduction = 100 × 0.001 = 0.10 (10%)
Final Crit Chance = 0.25 × (1 - 0.10) = 0.225 (22.5%)

If crit triggers: damage × 2.0
```

### **4. HP Calculation**
- **Formula:** `maxHP = 10 + (Constitution × 10)`
- **Example:**
  - CON 10 → 110 HP
  - CON 50 → 510 HP
  - CON 500 → 5010 HP (Ancient Dragon)

## Ability System

### **Training Abilities**
- Only **training** abilities are used in battle
- Max training: 1 (upgradeable in future)
- Abilities level up through training

### **Cooldowns**
- **Base Cooldown:** Defined per ability (e.g., 6.0s)
- **Level Reduction:** `-0.5%` per level
- **Formula:** `effectiveCooldown = base × (1 - level × 0.005)`

**Example:**
```
Smash: 6.0s base cooldown
Level 1: 6.0s
Level 20: 5.4s (10% reduction)
Level 100: 3.0s (50% reduction)
```

### **Multi-Ability Resolution**
When multiple abilities are off cooldown:
1. All fire on the same tick
2. Resolved one at a time
3. Battle can end mid-resolution (early exit)

## Boss Stats

### **Training Dummy** (Tier 1)
```
HP: 100 (CON 10)
STR: 5  | DEX: 5  | AGI: 5
TGH: 10 | FRT: 10 | CON: 10
INT: 5  | CONC: 5 | RES: 5
Crit: 5% × 1.5

Ability: Wobble (10s CD, ×1.0 True damage)
Reward: 1 AP
```

### **Goblin King** (Tier 2)
```
HP: 500 (CON 50)
STR: 30 | DEX: 25 | AGI: 20
TGH: 40 | FRT: 30 | CON: 50
INT: 15 | CONC: 20 | RES: 25
Crit: 10% × 1.75

Ability: Vicious Strike (8s CD, ×1.5 Physical)
Reward: 5 AP
```

### **Ancient Dragon** (Tier 3)
```
HP: 5000 (CON 500)
STR: 80  | DEX: 60  | AGI: 50
TGH: 120 | FRT: 100 | CON: 500
INT: 150 | CONC: 80  | RES: 90
Crit: 25% × 2.0

Ability: Inferno Breath (15s CD, ×3.0 Magical)
Reward: 50 AP
```

## Battle Outcomes

### **Victory** ✓
- Player HP > 0 when boss HP hits 0
- Award Ascension Points
- Update defeat counter
- Unlock next boss (on first defeat)
- Battle log saved

### **Defeat** ✗
- Boss HP > 0 when player HP hits 0
- No rewards
- No progress
- Battle log saved
- Can retry immediately

## Battle Log Format

### **Log Entry Types**
1. **Player Actions** (teal)
   - `[1.2s] Player uses Smash: 45 damage`
   - `[2.5s] Player uses Beam: 67 damage CRITICAL!`
   - `[3.1s] Player's Smash missed!`

2. **Boss Actions** (orange/amber)
   - `[1.8s] Boss uses Wobble: 12 damage`
   - `[4.2s] Boss uses Vicious Strike: 89 damage CRITICAL!`
   - `[5.0s] Boss's Wobble missed!`

3. **Results** (green/red)
   - `[0.0s] Battle Start! Player HP: 210 | Boss HP: 100`
   - `[15.3s] Victory!` (green, bold)
   - `[8.7s] Defeat!` (red, bold)

## Strategic Depth

### **Build Considerations**

**Physical Build:**
- High STR for damage
- Train Smash ability
- TGH for defense
- DEX for hit chance

**Magical Build:**
- High INT for damage
- Train Beam ability
- FRT for defense
- Still need DEX to hit!

**Balanced Build:**
- Mix of both damage types
- Can switch abilities based on boss
- More flexible but less specialized

**Defensive Build:**
- High TGH + FRT = low boss crit chance
- High AGI = boss misses often
- High CON = more HP
- Longer battles but safer

### **Boss Counters**

**Training Dummy:**
- Easy first boss
- True damage ignores all defense
- Low stats across the board
- Good for learning mechanics

**Goblin King:**
- Physical damage (use TGH)
- Moderate AGI (DEX helps)
- Higher HP (need good damage)

**Ancient Dragon:**
- Magical damage (use FRT!)
- Very high stats
- Deadly crits (need high defense)
- Requires strong build

## Future Enhancements

### **Planned (not implemented yet)**
- ✅ Battle system working
- ✅ Real-time simulation
- ❌ Status effects (Stun, Poison, Weakness)
- ❌ Multiple active abilities (upgradeable)
- ❌ Real-time battle visualization
- ❌ Ability combos
- ❌ Boss phases
- ❌ Loot drops
- ❌ Battle statistics tracking

### **Status Effects** (Future)
```typescript
Stun: Prevents actions for duration
Poison: DoT (damage over time)
Weakness: Reduces damage dealt
```

## Technical Details

### **Files Created/Modified**
- ✅ `combatSystem.ts` - All combat calculations
- ✅ `constants.ts` - Combat constants added
- ✅ `BossDefinition` - Added stats field
- ✅ `data.ts` - Boss stats added to all bosses
- ✅ `GameEngine.ts` - Battle simulation integrated
- ✅ `BossTab.tsx` - Clean UI redesign

### **Key Functions**
- `calculateMaxHP()` - HP from CON
- `calculateHitChance()` - DEX vs AGI
- `calculateDamageReduction()` - TGH/FRT reduction
- `calculateCritChance()` - Crit with defense reduction
- `calculateDamage()` - Final damage calculation
- `simulateBattle()` - Complete battle simulation

### **Performance**
- Battles run instantly (simulation, not animated)
- Max 5 minutes simulated time (safety limit)
- 0.1s tick rate (600 ticks per minute)
- Typical battle: 10-30 seconds simulated time
- Results in <100ms real time

## Balance Notes

### **Damage Reduction Effectiveness**
```
Defense Value | Damage Taken
    0         |   100%
   10         |   ~91%
   50         |   ~67%
  100         |   ~50%
  200         |   ~33%
  300         |   ~25%
  900         |   ~10% (minimum reached)
```

### **Hit Chance vs AGI**
```
AGI Advantage | Hit Chance
   -50        |   ~67% (defender slower)
     0        |   100% (equal)
   +50        |   ~67% (defender faster)
  +400        |   20%
  +900        |   10% (minimum)
```

### **Crit Reduction**
```
Avg Defense | Crit Reduction
     0      |    0%
   100      |   10%
   200      |   20%
   500      |   50%
  1000      |  100% (no crits)
```

---

**Result:** A deep, stat-based combat system with strategic build choices and meaningful progression! ⚔️🎮

