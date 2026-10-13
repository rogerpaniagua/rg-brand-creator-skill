# brand-creator-rg

A Claude skill that turns the style of a reference website into a finished, brand-specific `DESIGN.md` that Claude Code, or any LLM, can build projects from.

You give it one or more reference URLs. It extracts their design language, helps you make it your own (from a brandbook or a short interview), and writes a self-contained `DESIGN.md` with tokens per component. It then explains how to build from the file and how to refine it later ("squarer buttons", "another font") with a migration prompt for what is already built.

## What it does

1. **Extract.** Reads each reference URL with the [Dembrandt](https://www.dembrandt.com/mcp) MCP, then verifies the values that decide the style against the real page with a bundled probe (`scripts/probe.js`), because generated summaries can be wrong (for example a light palette on a dark site).
2. **Make it yours.** Asks whether you have a brandbook, visual ecosystem or assets (PDF, Brandfetch, Figma, logo and font files). It says what it could extract and what is missing, and keeps asking until it has what it needs. Without them it runs a short interview with concrete options (colour, typography, shape, motion, the "never" list). Typography is always an explicit decision.
3. **Write `DESIGN.md`.** Tokens per component (radius, height, border, states), named exceptions, dual-mode support, contrast checked, assumptions listed. No leftovers from the reference.
4. **Build from it.** Practical guidance for using the file with Claude Code or any LLM.
5. **Refine.** Adjust any token later. The skill audits where the token is used, splits shared tokens when needed, updates the file and its change log, and hands you a ready-to-paste migration prompt.

## Install

**Claude Code.** Copy the inner `brand-creator-rg/` folder into `~/.claude/skills/`:

```bash
cp -R brand-creator-rg ~/.claude/skills/
```

Or link it so edits apply immediately:

```bash
ln -s "$(pwd)/brand-creator-rg" ~/.claude/skills/brand-creator-rg
```

**Claude (web or desktop chat).** Zip the inner `brand-creator-rg/` folder and upload it under Settings, Capabilities, Skills. The chat cannot install Dembrandt by itself; add it to your connectors first.

It activates when you ask for a design system, a `DESIGN.md`, a brand style guide, or the style of a reference site adapted to your brand. You can also call it directly with `/brand-creator-rg`.

## Requirements

- The Dembrandt MCP. In Claude Code the skill installs it for you if it is missing: `claude mcp add --transport stdio dembrandt -- npx -y --package dembrandt dembrandt-mcp`. It needs Node and npx, and the Playwright Chromium version Dembrandt asks for (the skill runs `npx playwright install chromium` when needed).
- Claude's built-in browser, for the probe and as a fallback extractor when Dembrandt cannot read a site.

## Contents

```
brand-creator-rg/
  SKILL.md                              the skill
  references/design-md-template.md      shape of the final DESIGN.md
  references/migration-prompt-template.md   prompt template for refinements
  scripts/probe.js                      reads real computed styles from the page
```

## Known limits

- Tested end to end on real sites (linear.app, vercel.com) and with scripted scenarios for multi-URL merging, incomplete brandbooks and refinements. The first-time Dembrandt install on a clean machine has not been verified.
- The probe samples what is visible on the page; cards or components further down need other pages or scrolling. Sites that block reading their stylesheets leave CSS variables empty.

## License

MIT. See `LICENSE`.
