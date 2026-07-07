---
name: Chore Quest
colors:
  surface: '#19120a'
  surface-dim: '#19120a'
  surface-bright: '#41382e'
  surface-container-lowest: '#140d06'
  surface-container-low: '#221a12'
  surface-container: '#261e15'
  surface-container-high: '#31281f'
  surface-container-highest: '#3c3329'
  on-surface: '#f0e0d1'
  on-surface-variant: '#d8c3ad'
  inverse-surface: '#f0e0d1'
  inverse-on-surface: '#382f25'
  outline: '#a08e7a'
  outline-variant: '#534434'
  surface-tint: '#ffb95f'
  primary: '#ffc174'
  on-primary: '#472a00'
  primary-container: '#f59e0b'
  on-primary-container: '#613b00'
  inverse-primary: '#855300'
  secondary: '#bcc7de'
  on-secondary: '#263143'
  secondary-container: '#3e495d'
  on-secondary-container: '#aeb9d0'
  tertiary: '#8fd5ff'
  on-tertiary: '#00344a'
  tertiary-container: '#1abdff'
  on-tertiary-container: '#004966'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffddb8'
  primary-fixed-dim: '#ffb95f'
  on-primary-fixed: '#2a1700'
  on-primary-fixed-variant: '#653e00'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#c5e7ff'
  tertiary-fixed-dim: '#7fd0ff'
  on-tertiary-fixed: '#001e2d'
  on-tertiary-fixed-variant: '#004c6a'
  background: '#19120a'
  on-background: '#f0e0d1'
  surface-variant: '#3c3329'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Sora
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Sora
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Sora
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Sora
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Sora
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The design system for Chore Quest targets an audience that values productivity through gamification. The brand personality is **rewarding, precise, and adventurous**. It blends the high-stakes feel of a premium fintech dashboard with the dopamine-inducing feedback of a modern RPG.

The style is **High-Contrast Modern with subtle Glowmorphism**. It utilizes a deep, dark canvas to allow vibrant primary accents and success states to "pop," simulating the glow of legendary loot or completed quests. Interfaces remain professional and structured, avoiding "kiddie" aesthetics in favor of a sophisticated, high-fidelity experience that treats household tasks as valuable currency.

## Colors
This design system uses a curated dark palette to establish depth and hierarchy:
- **Surface (#0F172A):** The foundation. A deep navy that provides a more premium feel than pure black.
- **Secondary/Container (#1E293B):** Used for cards, panels, and elevated surfaces to create clear containment.
- **Primary/Gold (#F59E0B):** Reserved for "Value Moments"—action buttons, reward amounts, and level-up indicators. 
- **Success/Emerald (#10B981):** Specifically for "Task Complete" states and positive growth metrics.

Accent colors should be used sparingly against the dark backgrounds to maintain high legibility and a focused user experience.

## Typography
**Sora** is the sole typeface for this design system. Its geometric construction and wide stance give the UI a tech-forward, high-fidelity appearance. 

- **Headlines:** Use Bold or Semi-Bold weights with tighter letter spacing to create an impactful, "quest-title" feel.
- **Body:** Regular weight is used for task descriptions and instructions, ensuring readability against dark backgrounds.
- **Data/Labels:** Use Semi-Bold weights for numerical values (currency, timers, points) to emphasize the fintech-inspired dashboard aspect.

## Layout & Spacing
The layout follows a **fluid grid** model with a 12-column structure for desktop and a single column for mobile. 

- **Rhythm:** A 4px baseline grid ensures consistent vertical rhythm.
- **Safe Zones:** Use 16px margins on mobile to prevent content from hitting the screen edge.
- **Containers:** Content should be grouped in cards with 24px internal padding (`lg`) to maintain a breathable, premium feel. 
- **Grouping:** Use `sm` (8px) for related elements (e.g., an icon and its label) and `md` (16px) for separate functional blocks.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Subtle Glows** rather than traditional heavy shadows.

- **Level 0 (Surface):** The #0F172A background.
- **Level 1 (Card):** #1E293B with a 1px solid border of #334155 (Slate 700). 
- **Level 2 (Interactive):** When hovered or active, elements gain a subtle outer glow using the Primary Amber color at 15% opacity.
- **Overlays:** Modals use a backdrop blur (12px) to maintain the "Glassmorphism" effect, keeping the user grounded in the dashboard context.

## Shapes
This design system utilizes a **Rounded** shape language to balance the "serious" fintech layout with a "friendly" gaming vibe.

- **Standard Containers:** Cards and large buttons use a 16px (`rounded-lg`) corner radius.
- **Small Elements:** Chips and checkboxes use an 8px (`rounded-md`) radius.
- **Progress Bars:** Use fully pill-shaped (rounded-full) ends to signify fluid movement and completion.

## Components

### Buttons
- **Primary:** Solid Primary Amber (#F59E0B) with dark text. On hover, add a 10px amber glow.
- **Secondary:** Transparent background with a 2px Slate border.
- **Ghost:** No border, primary color text; for low-priority actions.

### Task Cards
Cards are the heart of the "Quest" experience. They should feature a 1px Slate border and a subtle gradient from #1E293B to #0F172A. Completion icons should trigger a Success Emerald (#10B981) glow.

### Progress & Stats
- **Quest Bars:** Use a thick (12px height) track. The fill should be a gradient of the Primary color.
- **Stat Badges:** Small chips with #1E293B backgrounds and Semi-Bold Sora labels to track "Gold" or "XP."

### Inputs
Fields should use the Surface color for the background with a 1px border. On focus, the border transitions to Primary Amber with a 4px soft outer glow.

### Feedback Elements
- **Toast Notifications:** Floating cards with a heavy backdrop blur and a colored left-accent bar (Success, Info, or Warning).