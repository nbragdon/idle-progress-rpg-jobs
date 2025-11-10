# Skills System

## Overview
Skills provide permanent bonuses to progression rates. All skills apply their effects regardless of whether they are actively training, meaning you benefit from all unlocked skills simultaneously.

## Skill Categories

### **Basic Skills (passive.ts)**
Entry-level skills available from the start with simple unlock requirements.

#### **Core Trait Bonuses (20% per level)**
- **Physical Training** - Increases Physical job EXP by 20% per level
  - *Unlock:* Always available
  
- **Arcane Studies** - Increases Magical job EXP by 20% per level
  - *Unlock:* Always available
  
- **Swift Learning** - Increases Swift job EXP by 20% per level
  - *Unlock:* Always available

#### **Meta Progression**
- **Dedication** - Increases ALL skill EXP by 40% per level
  - *Unlock:* 20 total skill levels
  - *Note:* Compounds with itself, creates exponential growth

---

### **Advanced Skills (advanced.ts)**
Powerful skills with significant unlock requirements targeting specific build types.

#### **Dual-Trait Job EXP Bonuses (15% per level each)**

- **Combat Mastery** - Increases DPS + Aggressive job EXP by 15% per level
  - *Unlock:* 50 total job levels + STR 40
  - *Best for:* Berserker, Barbarian, Elementalist, Assassin builds

- **Fortified Studies** - Increases Tank + Support job EXP by 15% per level
  - *Unlock:* 50 total job levels + CON 40
  - *Best for:* Guardian, Juggernaut, Battle Priest, Necromancer builds

- **Shadow Techniques** - Increases Stealth + Opportunist job EXP by 15% per level
  - *Unlock:* 50 total job levels + DEX 40
  - *Best for:* Shadow, Thief, Trickster, Assassin builds

#### **Triple-Trait Job EXP Bonuses**

- **Strategic Mind** - Increases Tactical + Support + Skirmish job EXP by 12% per level
  - *Unlock:* 75 total job levels + 40 total skill levels + INT 50
  - *Best for:* Commander, Warlord, Battle Priest, Duelist builds
  - *Note:* Lower per-trait bonus but affects 3 traits

- **Versatile Warrior** - Increases DPS + Tank + Aggressive job EXP by 10% per level
  - *Unlock:* 100 total job levels + Any Guardian/Barbarian/Commander at level 15
  - *Best for:* Juggernaut, Grand Master, balanced fighter builds
  - *Note:* Requires mastery of warrior path

#### **Meta Progression**

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

## Progression Guide

### **Early Game (0-30 minutes)**
- Focus on one core trait skill (Physical/Arcane/Swift)
- Get to level 5-10 for significant boost
- Unlock Dedication ASAP for skill EXP acceleration

### **Mid Game (30 minutes - 2 hours)**
- Push Dedication to level 10+
- Unlock first advanced skill based on your build direction
- Start diversifying into secondary skills

### **Late Game (2+ hours)**
- Unlock multiple advanced skills for build synergy
- Max out Intense Training for ability scaling
- Unlock Scholarly Pursuit for exponential skill growth

### **Endgame (10+ hours)**
- All relevant skills at level 20+
- Dedication + Scholarly Pursuit creating massive compound growth
- Multiple max-level abilities through Intense Training

## Synergies

### **Pure Offense Build**
```
Physical Training → Combat Mastery → Intense Training
Barbarian → Berserker path with high ability levels
```

### **Tank Build**
```
Physical Training → Fortified Studies
Guardian → Juggernaut path with defensive focus
```

### **Rogue Build**
```
Swift Learning → Shadow Techniques → Combat Mastery
Shadow → Assassin path with crit focus
```

### **Mage Build**
```
Arcane Studies → Strategic Mind
Wizard → Archmage path with high INT
```

### **Skill Farming Build**
```
Dedication → Scholarly Pursuit (both maxed)
Results in: (1 + 0.40×20) × (1 + 0.25×20) = 9× × 6× = 54× skill EXP!
```

### **Ability Farming Build**
```
Intense Training → High skill levels
Results in: (1 + 0.30×20) = 7× ability EXP
```

## Design Philosophy

### **Scaling Tiers**
- **Basic:** 20% per level, easy unlock
- **Advanced Dual:** 15% per level, moderate unlock
- **Advanced Triple:** 10-12% per level, hard unlock
- **Meta:** 25-40% per level, very hard unlock

### **Unlock Difficulty**
- Basic skills unlock with minimal requirements
- Advanced skills require significant progression (50-100 job levels)
- Meta skills require mastery of other systems (80+ skill levels, boss defeats)

### **Multiplicative Growth**
Skills stack multiplicatively, creating exponential growth:
```
Base: 25 EXP/s
Physical Training (20): 25 × (1 + 0.20×20) = 25 × 5 = 125 EXP/s
+ Combat Mastery (15): 125 × (1 + 0.15×15) = 125 × 3.25 = 406 EXP/s
+ Dedication (10): 406 × (1 + 0.40×10) = 406 × 5 = 2,030 EXP/s
= 81× base rate!
```

