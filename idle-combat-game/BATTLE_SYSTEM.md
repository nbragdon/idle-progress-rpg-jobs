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
- **Base Crit Chance:** From CRIT_C stat (absolute value, not percentage)
- **Comparative Formula:** `finalCrit = CRIT_C / (10 × avgDefense)`
- **100% Crit:** When CRIT_C = 10× average defense
- **Can exceed 100%** (guaranteed crits)
- **Crit Damage:** Multiplies damage by CRIT_D stat (stored as percentage, e.g., 150 = 150% damage)

**Example:**
```
Attacker: CRIT_C = 200, CRIT_D = 150
Defender: 100 TGH, 100 FRT (avg = 100)

Final Crit Chance = 200 / (10 × 100) = 0.20 (20%)

If crit triggers: damage × (150 / 100) = damage × 1.5
```

### **4. Status Effect Application** (CONC vs RES)
- **Defensive Effects** (Shield, Strong): Always succeed, apply to self
- **Offensive Effects** (Weak, Poison, Stun, Disarm, Silence): Require resistance check
- **Formula:** Favors resistance - requires 2x CONC for guarantee
  - `CONC >= 2x RES`: 100% application (need DOUBLE to guarantee)
  - `CONC = RES`: 50% application (fair coin flip at equal stats)
  - `RES = 2x CONC`: 5% application (minimum - very strong resistance)
  - `RES > 2x CONC`: 5% minimum (floor)

**Example:**
```
Attacker: CONC = 100
Defender: RES = 50 → 100% application (2x concentration = guaranteed)
Defender: RES = 75 → 75% application
Defender: RES = 100 → 50% application (equal stats = fair chance)
Defender: RES = 150 → ~27% application
Defender: RES = 200+ → 5% application (floor)
```

This creates the offensive/defensive stat pair:
- **CONC** (Concentration): Increases status effect application chance
- **RES** (Resistance): Reduces opponent's status effect application chance

**Note:** This formula favors resistance by requiring **double** the defender's RES for guaranteed application, but provides a fair 50/50 chance at equal stats. Status effects are a viable strategy but require significant CONC investment.

### **5. HP Calculation**
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

### **Boss Scaling Philosophy**
Each boss is approximately **10x stronger** than the previous boss:
- All stats are multiplied by ~10
- HP scales by 10x (through CON)
- Damage scales by 10x
- Defenses scale by 10x
- CRIT_C scales by 10x (relative to opponent defenses)

This scaling ensures:
1. Each boss requires strategic progression and ascension
2. Players must optimize builds between boss fights
3. Natural progression gates that feel rewarding to overcome
4. Future bosses can extend this pattern (15x, 20x, etc.)

### **Training Dummy** (Tier 1)
```
HP: 810 (CON 80)
STR: 50  | DEX: 45  | AGI: 45
TGH: 60  | FRT: 60  | CON: 80
INT: 45  | CONC: 50 | RES: 50
CRIT_C: 300 | CRIT_D: 175%

Ability: Wobble (3.5s CD, 25 Physical damage)
Reward: 1 AP
Estimated Clear Time: 30-45 minutes with strategic play
```

### **Goblin King** (Tier 2)
```
HP: 8010 (CON 800) [~10x Training Dummy]
STR: 500  | DEX: 450  | AGI: 450
TGH: 600  | FRT: 600  | CON: 800
INT: 450  | CONC: 500 | RES: 500
CRIT_C: 3000 | CRIT_D: 200%

Ability: Vicious Strike (3s CD, 250 Physical damage)
Reward: 5 AP
Requires: Multiple ascensions, optimized build
```

### **Ancient Dragon** (Tier 3)
```
HP: 80010 (CON 8000) [~10x Goblin King]
STR: 5000 | DEX: 4500 | AGI: 4500
TGH: 6000 | FRT: 6000 | CON: 8000
INT: 4500 | CONC: 5000 | RES: 5000
CRIT_C: 30000 | CRIT_D: 225%

Ability: Inferno Breath (2.5s CD, 2500 Magical damage)
Reward: 50 AP
Requires: Significant ascension investment, multiple job mastery
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
- ✅ Status effects (Shield, Strong, Weak, Poison, Stun, Disarm, Silence)
- ✅ Status effect resistance (CONC vs RES)
- ❌ Multiple active abilities (upgradeable)
- ❌ Real-time battle visualization
- ❌ Ability combos
- ❌ Boss phases
- ❌ Loot drops
- ❌ Battle statistics tracking

### **Status Effects** (Implemented)
```typescript
// Defensive (always succeed)
Shield: Absorbs damage before HP is affected
Strong: Increases damage dealt by percentage

// Offensive (require CONC vs RES check)
Weak: Reduces damage dealt by percentage
Poison: DoT (true damage over time)
Stun: Prevents all actions (cooldowns frozen)
Disarm: Prevents physical abilities
Silence: Prevents magical abilities
```

See `STATUS_EFFECTS.md` for full documentation.

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
- `calculateStatusEffectChance()` - CONC vs RES for status effects
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

### **Status Effect Application Chance**
```
CONC vs RES | Application Chance | Notes
CONC = 2x+  |   100% (guaranteed) | Need double to guarantee
CONC = 1.5x |   75%               | Good advantage
CONC = RES  |   50%               | Fair coin flip at equal
RES = 1.25x |   ~39%              | Defender has edge
RES = 1.5x  |   ~27%              | Steep dropoff
RES = 2x    |    5%               | Minimum reached
RES = 3x+   |    5% (floor)       | Cannot go lower
```

---

**Result:** A deep, stat-based combat system with strategic build choices and meaningful progression! ⚔️🎮

