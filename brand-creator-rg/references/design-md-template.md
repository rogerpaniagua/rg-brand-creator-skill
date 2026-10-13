# DESIGN.md template

Use this shape every time so any LLM can read the file the same way. Replace everything in angle brackets. Delete the `light` block when the brand is dark only (and vice versa). Never leave reference-site names, logos or copy in the file.

```markdown
---
name: <Brand>
version: 1.0.0
updated: <YYYY-MM-DD>
modes: [dark]            # or [light] or [dark, light]
colors:
  dark:
    background: "#"
    surface: "#"
    surface-raised: "#"
    ink: "#"             # main text
    muted: "#"           # secondary text, must keep 4.5:1
    line: "rgba(...)"
    accent: "#"          # fills and borders
    accent-text: "#"     # accent used as text, contrast-checked
    on-accent: "#"       # text on accent fills
    success: "#"
    warning: "#"
    danger: "#"
    info: "#"
  light: {}              # same keys, only if modes include light
typography:
  font-sans: "<Family>, <fallbacks>"
  font-mono: "<Family>, <fallbacks>"
  display:   { size: "", weight: , line-height: , tracking: "" }
  heading:   { ... }
  body:      { ... }
  ui:        { ... }
  mono:      { ... }
spacing: { unit: "4px", scale: [4, 8, 12, 16, 24, 32, 48, 64, 96], container: "", gutter: "" }
radius:                  # one token per component family; never one global value
  button: ""
  button-sm: ""
  input: ""
  card: ""
  tag: ""
  control-sm: ""         # switches, chips, small controls: separate from buttons
border: { width: "1px", button: "", card: "", input: "" }
motion: { duration: "150ms", easing: "cubic-bezier(...)", reduced-motion: "respect" }
components:
  button-primary: { radius: "{radius.button}", height: "", padding: "", background: "{colors.accent}", color: "{colors.on-accent}", hover: "", focus: "", disabled: "" }
  button-secondary: { ... }
  input: { ... }
  card: { ... }
exceptions:
  - "<Component> uses <value> because <reason>. Applies to <where>, nowhere else."
---

# <Brand> design system

1. Overview and tone
2. Colour (roles, pairs with contrast ratios, modes)
3. Typography (fonts, scale, usage rules, why these fonts)
4. Layout and spacing
5. Shape (radius per component, borders, elevation)
6. Components (states for each: default, hover, focus, active, disabled)
7. Motion
8. Imagery, icons and logo (clear space, minimum size, assets paths)
9. Accessibility (contrast table, focus, reduced motion, touch targets)
10. Do and Don't
11. Assumptions to confirm
12. Building with this file
13. Change log
```

## Assumptions table (section 11)
| Item | Value used | Why | Confirm with |
|---|---|---|---|
Every value you chose yourself, instead of getting it from the user or the brandbook, goes here.

## Change log table (section 13)
| Date | Version | Token | Old | New | Reason |
|---|---|---|---|---|---|
