# Skills System

## Overview
Skills provide permanent bonuses to progression rates. All skills apply their effects regardless of whether they are actively training, meaning you benefit from all unlocked skills simultaneously.

## File Organization

Skills are organized into tiers based on unlock difficulty:
- **`basic.ts`** - Starter skills (no unlock requirements)
- **`tier1.ts`** - Early-mid game skills (20-50 level requirements)
- **`tier2.ts`** - Late game skills (75-100+ level requirements)
- **`index.ts`** - Central registry exporting all skills

---

## Basic Skills (basic.ts)
**No unlock requirements - Available from the start**

### Core Trait Bonuses (20% per level)
- **Physical Training** - Increases Physical job EXP by 20% per level
  - *Always available*
  
- **Arcane Studies** - Increases Magical job EXP by 20% per level
  - *Always available*
  
- **Swift Learning** - Increases Swift job EXP by 20% per level
  - *Always available*

---

## Tier 1 Skills (tier1.ts)
**Early-mid game progression (20-50 job levels, basic stats)**

### Meta Progression
- **Dedication** - Increases ALL skill EXP by 40% per level
  - *Unlock:* 20 total skill levels
  - *Note:* Compounds with itself, creates exponential growth

### Dual-Trait Job EXP Bonuses (20% per level)

- **Combat Mastery** - Increases DPS + Aggressive job EXP by 20% per level
  - *Unlock:* 50 total job levels + STR 40
  - *Best for:* Berserker, Barbarian, Elementalist, Assassin builds

- **Fortified Studies** - Increases Tank + Support job EXP by 20% per level
  - *Unlock:* 50 total job levels + CON 40
  - *Best for:* Guardian, Juggernaut, Battle Priest, Necromancer builds

- **Shadow Techniques** - Increases Stealth + Opportunist job EXP by 20% per level
  - *Unlock:* 50 total job levels + DEX 40
  - *Best for:* Shadow, Thief, Trickster, Assassin builds

---

## Tier 2 Skills (tier2.ts)
**Late game mastery (75-100+ job levels, high stats, boss defeats)**

### Triple-Trait Job EXP Bonuses

- **Strategic Mind** - Increases Tactical + Support + Skirmish job EXP by 17% per level
  - *Unlock:* 75 total job levels + 40 total skill levels + INT 50
  - *Best for:* Commander, Warlord, Battle Priest, Duelist builds
  - *Note:* Lower per-trait bonus but affects 3 traits

- **Versatile Warrior** - Increases DPS + Tank + Aggressive job EXP by 20% per level
  - *Unlock:* 100 total job levels + Any Guardian/Barbarian/Commander at level 15
  - *Best for:* Juggernaut, Grand Master, balanced fighter builds
  - *Note:* Requires mastery of warrior path

### Universal Progression Bonuses

- **Intense Training** - Increases ALL ability EXP by 30% per level
  - *Unlock:* 60 total skill levels + Any ability at level 20
  - *Note:* First skill to boost ability progression

- **Scholarly Pursuit** - Increases ALL skill EXP by 25% per level
  - *Unlock:* 80 total skill levels + Dedication level 10 + 3 Training Dummy defeats
  - *Note:* Second skill EXP bonus, stacks multiplicatively with Dedication

---

## Skill Effect Types

```typescript
traitJobExp   // Bonus to jobs with specific trait(s)
jobExp        // Global bonus to all jobs (not implemented yet)
skillExp      // Global bonus to all skill EXP gain
abilityExp    // Global bonus to all ability EXP gain
```

## Unlock Condition Types

```typescript
stat                 // Specific stat requirement
skillTotalLevels     // Legacy, same as totalSkillLevels
totalJobLevels       // Sum of all job levels
totalSkillLevels     // Sum of all skill levels
skillLevel           // Specific skill must reach level
bossDefeats          // Must defeat boss X times
anyJobFromList       // Any job from list must reach level
anyAbilityLevel      // ANY ability must reach level
```

---

## Progression Guide

### **Early Game (0-30 minutes) - Basic Tier**
- Focus on one core trait skill (Physical/Arcane/Swift)
- Get to level 5-10 for significant boost
- Work toward unlocking Dedication (20 skill levels)

### **Mid Game (30 minutes - 2 hours) - Tier 1**
- Unlock Dedication for skill EXP acceleration
- Push Dedication to level 10+
- Unlock first dual-trait advanced skill based on your build direction
- Start diversifying into secondary skills

### **Late Game (2-4 hours) - Tier 2**
- Unlock multiple Tier 2 skills for build synergy
- Max out Intense Training for ability scaling
- Unlock Scholarly Pursuit for exponential skill growth

### **Endgame (4+ hours)**
- All relevant skills at level 20+
- Dedication + Scholarly Pursuit creating massive compound growth (54× skill EXP!)
- Multiple max-level abilities through Intense Training

---

## Build Synergies

### **Pure Offense Build**
```
Basic: Physical Training → Tier 1: Combat Mastery → Tier 2: Intense Training
Focus: Barbarian → Berserker path with high ability levels
```

### **Tank Build**
```
Basic: Physical Training → Tier 1: Fortified Studies → Tier 2: Versatile Warrior
Focus: Guardian → Juggernaut path with defensive prowess
```

### **Rogue Build**
```
Basic: Swift Learning → Tier 1: Shadow Techniques → Tier 2: Intense Training
Focus: Shadow → Assassin path with crit focus
```

### **Mage Build**
```
Basic: Arcane Studies → Tier 1: Dedication → Tier 2: Strategic Mind
Focus: Wizard → Archmage path with high INT
```

### **Skill Farming Build**
```
Tier 1: Dedication → Tier 2: Scholarly Pursuit (both maxed)
Results: (1 + 0.40×20) × (1 + 0.25×20) = 9× × 6× = 54× skill EXP!
```

### **Ability Farming Build**
```
Tier 1: Dedication → Tier 2: Intense Training (maxed)
Results: (1 + 0.30×20) = 7× ability EXP
```

---

## Design Philosophy

### **Tiered Unlock Difficulty**
- **Basic:** Available immediately, foundation for all builds
- **Tier 1:** Moderate requirements (20-50 levels), early specialization
- **Tier 2:** Significant requirements (75-100+ levels), late-game power

### **Scaling Balance**
- **Basic (single trait):** 20% per level
- **Tier 1 (dual trait):** 20% per level each
- **Tier 2 (triple trait):** 17% per level each
- **Universal effects:** 25-40% per level (highest requirements)

### **Multiplicative Growth**
Skills stack multiplicatively, creating exponential growth:
```
Base: 25 EXP/s
Physical Training (20): 25 × (1 + 0.20×20) = 25 × 5 = 125 EXP/s
+ Combat Mastery (15): 125 × (1 + 0.20×15) = 125 × 4 = 500 EXP/s
+ Dedication (10): Skills now gain (1 + 0.40×10) = 5× faster
= Massive compound scaling!
```

### **Progressive Complexity**
- Basic skills are simple and straightforward
- Tier 1 adds specialization choices
- Tier 2 rewards mastery with powerful universal effects
