# Design Refactor: Progressive Disclosure Pattern

## Overview
Refactored Jobs and Skills tabs to use a **progressive disclosure** pattern with compact cards and detailed modals.

## Key Changes

### Before
- Large cards with all information visible
- 2 items per row (desktop)
- Heavy visual weight
- Lots of borders and nested containers
- Difficult to scan many items

### After
- Compact cards with essential info only
- 3 items per row (desktop), 2 on tablet, 1 on mobile
- Click any card to see full details in a modal
- Cleaner, faster scanning
- Better scalability

## Card Design: Before vs After

### OLD Card (~280px height)
```
┌─────────────────────────────────┐
│  Icon  Warrior          LVL 11  │
│        Description text here... │
│        [Physical] [Aggressive]  │
│                                 │
│  Required to unlock:            │
│  • Strength 20                  │
│                                 │
│  EXP: 110.1 / 2010    5.5%     │
│  ████░░░░░░░░░░░░░░░░░░░       │
│                                 │
│        [Deactivate]             │
└─────────────────────────────────┘
```

### NEW Card (~160px height)
```
┌───────────────────────────┐
│ Icon  Warrior  [11]  (i)  │
│       [Physical] +1       │
│                           │
│ 5%         110 / 2010     │
│ ████░░░░░░░░░░░░░        │
│                           │
│     [Deactivate]          │
└───────────────────────────┘
```

## Modal Details

When clicking a card, a modal appears with:
- Full description
- All traits
- Unlock requirements (with checkmarks)
- Detailed progress statistics
- Active status indicator

## Benefits

### 1. **Improved Density** ✅
- 50% more items visible per screen
- 3 columns instead of 2
- Reduced card height by ~43%

### 2. **Better Scanning** ✅
- Only essential info visible
- Faster to find what you need
- Less cognitive load

### 3. **Cleaner Visual Design** ✅
- Less visual noise
- Reduced border complexity
- More whitespace
- Modern, clean aesthetic

### 4. **Scalability** ✅
- Handles 10+ jobs easily
- Handles 20+ skills without scrolling overload
- Grows gracefully as content expands

### 5. **Progressive Disclosure** ✅
- Novice users see simple cards
- Advanced users click for details
- Information when you need it

## Technical Implementation

### New Components
- `Modal.tsx` - Reusable modal component
  - Escape key to close
  - Click outside to close
  - Smooth animations
  - Body scroll lock when open

### Updated Components
- `JobsTab.tsx` - Compact cards + modal
- `SkillsTab.tsx` - Compact cards + modal

### Features
- Info icon (ⓘ) indicates clickable cards
- Active indicator (pulsing dot) shows active jobs/skills
- Smooth hover states
- Keyboard accessible (ESC closes modal)

## Future Enhancements

### Easy to Add Later
- Ability cards (same pattern)
- Search/filter functionality
- Sort options (by level, by type, etc.)
- Favorites/pinning
- Quick comparison view

### Scalability Examples
- 5 jobs → Shows all in one screen
- 20 jobs → Comfortable scrolling
- 50 jobs → Would need search/filter (easy to add)

## Design Principles Applied

1. **Progressive Disclosure** - Show less, reveal more on demand
2. **Scannability** - Important info upfront
3. **Information Density** - Balanced, not overwhelming
4. **Click Affordance** - Clear (i) icon indicates more details
5. **Consistent Patterns** - Same design across Jobs and Skills

## Mobile Considerations

- Cards stack to 1 column on mobile
- Larger touch targets
- Modal fills screen on small devices
- Scrollable modal content
- Easy thumb access to buttons

## Accessibility

- Keyboard navigation (Tab, ESC)
- ARIA labels on modal
- Clear focus indicators
- Sufficient color contrast
- Screen reader friendly

## Performance

- No performance impact
- Modals render on-demand
- Smooth animations (GPU accelerated)
- Efficient state management

---

**Result:** A cleaner, more scalable UI that grows with your game's content! 🎮✨

