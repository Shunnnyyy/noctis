# Urban Field Instrument Design System

## 01. Reference Direction

This project uses a practical field-instrument style inspired by IBM Carbon Design System, Figma dashboard templates, and monochrome grid editorial layouts. The goal is not to look like a generic SaaS site. It should feel like a personal urban observation tool: measured, quiet, technical, and visual.

Reference links:

- IBM Carbon Design System Figma kits: https://carbondesignsystem.com/designing/kits/figma/
- Figma dashboard templates: https://www.figma.com/templates/dashboard-designs/
- Maps UI kits reference: https://figmaelements.com/ui-kits/maps/

## 02. Palette

- Night: `#050505`
- Ink: `#f4f1ea`
- Muted ink: `rgba(244, 241, 234, 0.64)`
- Rule line: `rgba(244, 241, 234, 0.22)`
- Field accent: `#d8ff6a`
- Signal accent: `#75f0ff`

Use black, off-white, and thin rules as the base. Accent colors should appear only where a state, current, or decision needs attention.

## 03. Typography

- Primary: IBM Plex Sans
- Technical labels: IBM Plex Mono
- Headings: heavy, compact, left-aligned
- Body: 1.55 to 1.75 line-height
- Labels: small uppercase mono, but only for short metadata

Avoid centered paragraphs and long all-caps text.

## 04. Components

- Navigation: thin bordered tabs.
- Buttons: square edges, clear primary/secondary contrast, visible focus ring.
- Map points: clear size and contrast, with restrained motion.
- Panels: use borders and spacing before shadows.
- Cards: only for archive records, details, or tool panels.

## 05. Motion

Motion should explain flow:

- Field current: slow line movement connecting related parts.
- Map pulse: point selection or saved points.
- Panel current: subtle status movement, not decoration.

Do not animate every object. Respect `prefers-reduced-motion`.

## 06. UX Rule

Each page should answer one practical question:

- Home: What is this archive?
- Map: What did I observe?
- Modal: What data and next action belong to this point?
