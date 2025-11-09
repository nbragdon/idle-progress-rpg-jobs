# Abilities System Refactor

## Overview
Refactored the Abilities system with starter abilities and compact card design matching Jobs and Skills.

## New Starter Abilities

### 1. **Smash** (Physical)
- **Icon:** 👊 Punch
- **Description:** A powerful physical attack based on Strength
- **Cooldown:** 6.0 seconds
- **Damage:** 1.0x STR
- **Unlock:** Available from start (STR 0)

### 2. **Beam** (Magical)  
- **Icon:** ⚡ Laser Beam
- **Description:** A focused beam of magical energy based on Intelligence
- **Cooldown:** 6.0 seconds
- **Damage:** 1.0x INT
- **Unlock:** Available from start (INT 0)

## Progression System

### Experience Rates
- **Ability XP/sec:** 0.2 (reduced from 0.5)
- **40% slower** than skill progression
- Makes abilities feel more prestigious/valuable
- Encourages focused training decisions

### Training Limits
- **Max Training:** 1 ability at a time (configurable)
- Future upgrades can increase this limit
- Matches Jobs and Skills pattern

### Level Progression
- **Max Level:** 100
- **Level Effect:** -0.5% cooldown per level
- At level 100: 50% reduced cooldown
- Damage multiplier stays constant per ability

## UI Design

### Compact Card View (3 per row)
Shows:
- Ability icon with training indicator
- Name and level badge
- Damage multiplier (e.g., "×1.0 DMG")
- Current cooldown (e.g., "6.0s CD")
- Progress bar
- Train/Stop button
- 🔒 Locked state for unavailable abilities

### Detail Modal
Shows on click:
- Full description
- Large stat cards:
  - **Damage:** Multiplier and type
  - **Cooldown:** Current (with level reduction formula)
- Progress bar (if not maxed)
- Unlock requirement with checkmark

## Locked vs Unlocked States

### Locked Abilities
- Grayed out icon and text
- Shows unlock requirement
- "🔒 Locked" button (disabled)
- Cannot click for details

### Unlocked Abilities
- Colorful icons
- Shows combat stats
- Clickable for modal
- Can train/stop

### Maxed Abilities
- Golden/amber progress bar
- "✓ Maxed" button
- Cannot train further
- Shows final stats in modal

## Future Abilities

### Already Configured
- **Quick Strike** - Unlocks at STR 10
- **Shield Bash** - Unlocks at TGH 20 (with Stun effect)
- **Fireball** - Unlocks at INT 15

### Easy to Add More
Just add to:
1. `physical.ts` or `magical.ts`
2. Export in `index.ts`
3. Automatically appears in UI!

## Visual Design

### Color Scheme
- **Primary:** Rose/Red (#f43f5e)
- **Training Indicator:** Orange pulsing dot
- **Damage Badge:** Rose background
- **Cooldown Badge:** Teal background
- **Locked:** Slate gray

### Hover States
- Subtle background change (`hover:bg-slate-800/30`)
- No info icon needed (modern UX)
- Entire card is clickable

## Comparison to Jobs/Skills

### Similarities
- Compact 3-column grid
- Click for detail modal
- Training/Active indicators
- Same visual language

### Unique to Abilities
- Damage multiplier display
- Cooldown reduction system
- Max level cap (100)
- Locked/unlocked states more prominent
- Combat-focused stats

## Technical Implementation

### Files Modified
- ✅ `physical.ts` - Added Smash
- ✅ `magical.ts` - Added Beam
- ✅ `index.ts` - Registered new abilities
- ✅ `constants.ts` - Reduced XP rate to 0.2
- ✅ `AbilitiesTab.tsx` - Complete rewrite with modal

### Files Created
- ✅ `Modal.tsx` - Reusable modal component

### Benefits
- Consistent UX across all tabs
- Scalable to 20+ abilities
- Modern, clean interface
- Mobile-friendly
- Performance optimized

## Player Experience

### Early Game (Start)
```
Available:
- Smash (Physical)
- Beam (Magical)

Choose one to train based on your build!
```

### Mid Game (After some progression)
```
Available:
- Smash ✓
- Beam ✓
- Quick Strike 🔒 (Need STR 10)
- Fireball 🔒 (Need INT 15)
```

### Late Game (High stats)
```
All abilities unlocked!
Strategic choice: Which to max out first?
Cooldown reduction is powerful at high levels
```

## Balance Considerations

### XP Rate (0.2/sec)
- Takes ~8.3 minutes to gain 100 XP (level 1)
- Feels significant and valuable
- Not too slow to be frustrating
- Encourages active choice

### Cooldown Reduction
- Level 1: 6.0s base
- Level 10: 5.7s (5% reduction)
- Level 50: 4.5s (25% reduction)  
- Level 100: 3.0s (50% reduction)
- Meaningful but not overpowered

### Damage Scaling
- Damage multiplier stays constant
- Scales naturally with stat growth
- Consistent, predictable progression

---

**Result:** A clean, scalable abilities system that matches the game's overall design! 🎮⚡

