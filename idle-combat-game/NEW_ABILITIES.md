# New Tier 1 Job Abilities

Three powerful new abilities have been added, each tied to a specific Tier 1 job at level 20.

## 🛡️ Bastion Shield (Guardian)
**Unlock Requirement:** Guardian Level 20

**Description:** The Guardian's ultimate defensive ability. Conjures a magical shield that absorbs damage.

**Stats:**
- **Damage:** 30 Physical
- **Cooldown:** 8 seconds
- **Status Effect:** Shield (Self-Applied)
  - Level 1: 100 shield HP for 4 seconds
  - Level 100: 800 shield HP for 12 seconds

**Playstyle:** Defensive/Survival - Use this to survive extended boss battles. The shield stacks when reapplied, so timing multiple casts can create significant protection.

**Icon:** Shield with magical energy (GiShieldReflect)

---

## 🔮 Curse of Agony (Warlock)
**Unlock Requirement:** Warlock Level 20

**Description:** Channels forbidden dark magic that inflicts a lingering curse. Deals immediate damage and poisons the enemy, dealing true damage over time.

**Stats:**
- **Damage:** 40 Magic (Immediate)
- **Cooldown:** 7 seconds
- **Status Effect:** Poison (Enemy)
  - Level 1: 8 damage/second for 6 seconds (48 total DoT)
  - Level 100: 60 damage/second for 18 seconds (1080 total DoT)
  - Tick Rate: 1 second

**Playstyle:** DoT/Attrition - The poison deals true damage (bypasses all defenses). Perfect for long boss battles where sustained damage adds up. Total damage potential is very high at max level.

**Icon:** Poison cloud (GiPoisonCloud)

---

## ⚡ Shadowstrike (Shadow)
**Unlock Requirement:** Shadow Level 20

**Description:** A lightning-fast strike from the shadows that leaves enemies stunned. Damage and stun duration increase with level.

**Stats:**
- **Damage:** 60 Physical
- **Cooldown:** 6 seconds
- **Status Effect:** Stun (Enemy)
  - Level 1: 1.0 second stun
  - Level 100: 3.5 second stun

**Playstyle:** Burst/Control - High burst damage combined with stun. The stun freezes enemy cooldowns, giving you windows to attack safely. Great for aggressive, fast-paced combat.

**Icon:** Ninja star (GiNinjaStar)

---

## Balance Comparison

| Ability | Damage | Cooldown | Effect Type | Peak Performance |
|---------|--------|----------|-------------|------------------|
| Bastion Shield | 30 | 8s | Shield (Defense) | 800 shield @ Lv100 |
| Curse of Agony | 40 + DoT | 7s | Poison (Sustained) | 1,080 DoT @ Lv100 |
| Shadowstrike | 60 | 6s | Stun (Control) | 3.5s stun @ Lv100 |

## Technical Implementation

### New Systems Added:
1. **Enhanced Ability Unlock System**
   - Added `unlockConditions` array to `AbilityDefinition` interface
   - Supports job level requirements (`jobLevel`), stat requirements, boss defeats, etc.
   - Maintains backward compatibility with legacy `unlockCondition`

2. **Status Effect Integration**
   - All three abilities use the new `statusEffectConfig` system
   - Effects scale with ability level using interpolation
   - Shield stacks, Poison deals true damage, Stun freezes cooldowns

### Files Modified:
- `/src/data/abilities/physical.ts` - Added BastionShield & Shadowstrike
- `/src/data/abilities/magical.ts` - Added CurseOfAgony
- `/src/data/abilities/index.ts` - Exported new abilities
- `/src/types/data.ts` - Added `unlockConditions` to AbilityDefinition
- `/src/core/utils.ts` - Added `isAbilityUnlocked()` & `isAbilityAvailable()`
- `/src/game/GameEngine.ts` - Imported new unlock checking functions

## Usage in Game

Players will see these abilities appear in their Abilities tab once they reach the required job level:
- Train Guardian to level 20 → Unlock **Bastion Shield**
- Train Warlock to level 20 → Unlock **Curse of Agony**
- Train Shadow to level 20 → Unlock **Shadowstrike**

Each ability starts at level 1 and can be trained up to level 100, with all stats scaling proportionally.

## Strategic Considerations

- **Guardian Players:** Use Bastion Shield before big boss attacks or when HP is low
- **Warlock Players:** Stack Curse of Agony early in fights for maximum DoT duration
- **Shadow Players:** Time Shadowstrike to interrupt dangerous boss abilities

These abilities complement the existing starter abilities (Smash, Beam) and create diverse build options for different playstyles!

