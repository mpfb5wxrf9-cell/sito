# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Impasto
**Generated:** 2026-08-13 14:11:17
**Revised:** 2026-08-13 (v2 — flat/warm redesign, superseded the original gradient direction below)
**Category:** SaaS (General)
**Design Dials:** Variance 6/10 (Balanced / Modern) | Motion 5/10 (Standard) | Density 5/10 (Standard)

---

## Revision notes (v2)

La prima versione (palette blu/arancio a gradiente, ombre morbide, font geometrico Space
Grotesk) leggeva troppo come un template SaaS generico. La v2 adotta uno stile **Flat
Design** deliberatamente diverso: colori pieni (nessun gradiente), bordi netti al posto
delle ombre sfumate, raggio degli angoli ridotto, tipografia editoriale (serif per i
titoli). L'app (`app/`) usa già questi valori; questa tabella li documenta come fonte di
verità aggiornata.

### Color Palette (attuale)

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary (tomato) | `#C0392B` | `--color-primary` |
| Primary Foreground | `#FBF6EE` | `--color-primary-foreground` |
| Secondary (mustard) | `#C98A2C` | `--color-secondary` |
| Accent (basil) | `#3F6B42` | `--color-accent` |
| Background (paper) | `#FBF6EE` | `--color-background` |
| Surface | `#FFFDF8` | `--color-surface` |
| Foreground (ink) | `#241C15` | `--color-foreground` |
| Muted | `#7A6F5D` | `--color-muted` |
| Muted Surface | `#F1E9DA` | `--color-muted-surface` |
| Border (crust) | `#E4D9C7` | `--color-border` |
| Destructive | `#8C2F24` | `--color-destructive` |
| Ring | `#C0392B` | `--color-ring` |

**Color Notes:** Nessun gradiente. Le card usano solo `border` per la separazione (niente `box-shadow` morbido).

### Typography (attuale)

- **Heading Font:** Fraunces (serif, evoca menu/insegna da forno)
- **Body Font:** DM Sans
- **Mood:** artigianale, caldo, editoriale, non generico

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
```

### Shape

- Angoli: `rounded` (4px) su input/bottoni, `rounded-md` (6px) su card/badge — mai `rounded-xl`/`rounded-2xl`
- Ombre: nessuna (`shadow-card`/`shadow-card-hover` impostate a `none`); l'hover sulle card cambia `border-color`, non aggiunge glow

---

## Versione originale (v1, superata)

La tabella sotto era la palette generata automaticamente dalla skill `ui-ux-pro-max`
(stile "Aurora UI", gradiente blu/arancio) usata nella prima landing page. Conservata
per riferimento storico.

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#2563EB` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#3B82F6` | `--color-secondary` |
| Accent/CTA | `#EA580C` | `--color-accent` |
| Background | `#EFF6FF` | `--color-background` |
| Foreground | `#1E40AF` | `--color-foreground` |
| Muted | `#E9EFF8` | `--color-muted` |
| Border | `#BFDBFE` | `--color-border` |
| Destructive | `#DC2626` | `--color-destructive` |
| Ring | `#2563EB` | `--color-ring` |

**Color Notes:** Tracking blue + delivery orange [Accent adjusted from #F97316 for WCAG 3:1]

**Heading Font:** Satoshi · **Body Font:** General Sans

### Spacing Variables

*Density: 5/10 — Standard*

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #EA580C;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #2563EB;
  border: 2px solid #2563EB;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #EFF6FF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #2563EB;
  outline: none;
  box-shadow: 0 0 0 3px #2563EB20;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Aurora UI

**Keywords:** Vibrant gradients, smooth blend, Northern Lights effect, mesh gradient, luminous, atmospheric, abstract

**Best For:** Modern SaaS, creative agencies, branding, music platforms, lifestyle, premium products, hero sections

**Key Effects:** Large flowing CSS/SVG gradients, subtle 8-12s animations, depth via color layering, smooth morph

### Page Pattern

**Pattern Name:** Hero + Features + CTA

- **CTA Placement:** Above fold
- **Section Order:** Hero > Features > CTA

---

## Motion

**Stagger List** (Standard) — Trigger: load or scroll | Duration: 300-450ms | Easing: `back.out(1.4)`

```js
gsap.from('.grid-item', { opacity: 0, scale: 0.92, y: 16, duration: 0.4, stagger: { each: 0.06, from: 'start', grid: 'auto' }, ease: 'back.out(1.4)' });
```

**Framework notes:** grid: 'auto' lets GSAP infer rows/columns from a CSS grid layout for a natural wave stagger

- ✅ Combine with from: 'center' for a bento-grid layout to draw the eye inward first
- ❌ Don't use back.out on dense data tables; the overshoot reads as sloppy on informational UI
- ⚡ Group DOM writes; avoid interleaving layout reads (getBoundingClientRect) between staggered tweens

---

## Anti-Patterns (Do NOT Use)

- ❌ Excessive animation
- ❌ Dark mode by default

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
