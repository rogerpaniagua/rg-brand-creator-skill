---
name: brand-creator-rg
description: Use when the user wants a design system, DESIGN.md, brand style guide or visual direction for a website, product or company; wants the style of a reference site (a URL) adapted to their own brand; mentions Dembrandt, Brandfetch or a brandbook as input; wants to adjust an existing DESIGN.md (for example squarer buttons or another font); or is about to redesign a site that has no design system, even if they never say "DESIGN.md".
---

# Brand creator

Output: one finished `DESIGN.md` for a specific brand, project or company. The reference is starting material, never the answer: the brand's decisions win every conflict. This skill does not build the site; its last phases explain how to build from the file and how to refine it.

Talk to the user in their language. Write `DESIGN.md` in English (LLMs read it best that way). The exact shape of the file is in `references/design-md-template.md`: read it before Phase 3.

## Phase 1: Extract the base

1. **URLs.** If the user already gave them, do not ask again. Ask only which page and which mode to read (default: the mode the page shows by default). If they gave none, ask for one or several, at the level and style the brand wants to reach.
2. **Dembrandt is the core of this skill.** Look for tools named `mcp__dembrandt__*`. If they exist, continue without comment. If not, install it yourself without asking and say afterwards what you did (if the environment shows a permission prompt, tell the user to approve it):
   - Claude Code: `claude mcp add --transport stdio dembrandt -- npx -y --package dembrandt dembrandt-mcp`
   - Claude Desktop (no CLI): add `{"dembrandt": {"command": "npx", "args": ["-y", "--package", "dembrandt", "dembrandt-mcp"]}}` under `mcpServers` and restart.
   If an extraction fails at once with "Browser launch failed" (Dembrandt needs a specific Playwright Chromium version), run the command the error names, normally `npx playwright@<version> install chromium` (about 100 MB, from the official Playwright CDN), tell the user what you downloaded, and retry.
   A new MCP usually appears only after a restart. If the tools are still missing, ask the user to restart and re-run the skill, keeping their URLs. If installing fails (no Node, no network), report the exact error and fix the cause.
3. **Extract each URL with one call:** `get_design_tokens` with `darkMode: true` when the page is dark and `wcag: true` (add `pages: 2` or `3` for a stronger token set). It already returns colours, typography, spacing, surfaces, components and brand identity, so do not also call the per-aspect tools: each one launches its own browser. It returns a `job_id` and takes 20 to 40 seconds. Check progress with `list_jobs`, not `get_job_status` (that returns the entire extraction, thousands of lines), and pass the `job_id` to `get_findings` and `generate_design_md`. Use `check_contrast` on the pairs you plan to use.
4. **Verify the extraction against the real page; the generated summary is not reliable on its own.** In a real run on a dark site, `generate_design_md` returned a white surface and dark text even with `darkMode: true`, and its radius tokens (1.5 to 4 px) did not match the real buttons (pill and 8 px). Run `scripts/probe.js`: open the page in the built-in browser and paste the whole file into its JavaScript tool. It returns the computed truth for the values that decide the style: background and text colour in the mode the page is showing, headings, paragraphs and mono text, the distinct button styles with how many times each is used, surfaces, inputs, shadows, transitions, fonts and common spacing. Where the probe and the extraction disagree, trust the probe. Typography also arrives as dozens of near-duplicate entries: distill it into a small scale (display, heading, body, ui, mono). Probe limits: it samples the visible page, cannot read cross-origin CSS variables, and groups buttons by exact style, so read it with judgment and run it again after toggling dark/light if both matter.
5. **If extraction fails** (site blocks automated browsers, login wall, timeouts): run `check_robots`, try once more with a different page, and if it still fails, run `scripts/probe.js` on the page in the built-in browser and on two or three other pages of the site. It gives accurate values for the real mode but less breadth than Dembrandt (no breakpoints, CSS variables are often unreadable), so sample several pages. If the site blocks that too, ask the user for screenshots or an HTML export. Never invent tokens to fill the gap.
6. **Merge several URLs** with this precedence: what the user has already said, then what fits the product type, then what the sources agree on. Where sources conflict and neither fits, drop both and leave the decision for the interview. Never blend values from two sources (6 px from one and 8 px from the other is not "the best of both"). Drop reference-specific noise (its logo, imagery, copy, tracking colours, one-off values). A reference's brand colour is dropped too: keep only its role (for example "one accent over neutrals") and let the brand supply its own colour.
   The merge is provisional: when the user has not yet said anything beyond the product type, precedence rests on product fit, so redo the merge after Phase 2 with what the user decides.
7. **Show a short summary** of the base (palette, type, shape, motion, tone) with a small table of where each decision came from, and say it is provisional until the brand decisions come in. Provenance lives in this summary, not in the final `DESIGN.md`.

## Phase 2: Make it the brand's own

Ask: "Do you have a brandbook, visual ecosystem or any document that explains how your brand looks and works?" Accept anything: PDF, Brandfetch link, Figma, existing site, logo and font files, guidelines, screenshots.

- **If yes:** read it all, map it onto the base, and say what you extracted and what is missing ("I have colours and logo, I am missing typography and motion"). Keep asking until nothing essential is missing.
- **If no:** interview in short rounds. Always cover colour, typography, shape and spacing, motion and tone, and the "never" list; add rounds when the base is complex (states, density, light and dark). Each round shows concrete options and proposes a default so the user can just say yes. Brand decisions override the reference.

Rules for both paths:
- **Typography is always an explicit decision**, even when the reference fonts are open. Say which fonts the reference uses and whether they are open or proprietary, then ask: keep them or propose alternatives? When the user wants alternatives, or has not decided, give two or three options in a small table (heading/body and mono, character, licence), recommend one and say why. Licence is a constraint, not the question: the question is whether the brand wants that voice or its own. A brand's own fonts always win.
- **A single brand colour is not a system.** Derive neutrals, semantic colours (success, warning, danger, info) and an accent-as-text colour and an on-accent colour that pass contrast, for every mode needed, and mark each as an assumption. If the brand colour fails contrast as text or under text, say so and propose the fix.
- **Do not under-ask.** Every value you choose yourself instead of getting it from the user or the brandbook is an assumption and goes into the assumptions table. If most of a round is your own defaults, say so and ask for the one decision that matters most.
- Judge what is "essential" from the complexity of the base; there is no fixed questionnaire.

## Phase 3: Write the final DESIGN.md

Say "I have what I need" and confirm before writing. Save at the project root by default; ask only if the location is unclear. Never overwrite an existing `DESIGN.md` without asking (offer a backup). Copy supplied assets (logo, favicon, fonts) to `assets/` and reference them; if a file was described but not provided, reference the expected path and flag it as missing.

Follow `references/design-md-template.md`. The requirements that matter most:
- **Tokens per component, not one global value:** `radius.button`, `radius.card`, `radius.input`, `radius.tag`, a separate `radius.control-sm` for small controls such as switches and chips, heights, paddings and border widths per component. This is what lets a later tweak change one line without rippling elsewhere.
- **Exact values with units and every state** (hover, focus, active, disabled), and what each token applies to and does not.
- **Exceptions named explicitly** in the `exceptions` list (for example "the hero CTA is a pill").
- **Self-contained:** no leftovers from the reference, no sources named. Proprietary reference fonts are replaced by available equivalents and the choice explained.
- **Sections 11 to 13 always present:** assumptions table, "Building with this file", and an empty change log.
- Check contrast for every text pair; fix or flag anything under 4.5:1.

## Phase 4: How to build from it

Finish with practical guidance, in the chat and in section 12 of `DESIGN.md`:
- Tell Claude Code (or any LLM) to read `DESIGN.md` first and use only its tokens; keep it at the repo root and mention it in `CLAUDE.md` or `AGENTS.md`.
- Use other sites as inspiration for layout and patterns, then translate them into the brand's tokens instead of copying their styles.
- Build one section at a time and review it; define each token once as a variable and use it by name; re-check contrast after changes.
- When the system evolves, update `DESIGN.md` first, then the code (Phase 5).

## Phase 5: Refine (repeatable)

The user will often see the system built and want to adjust it ("buttons squarer", "another font"). For every adjustment:

1. **Pin it down.** Turn the wish into exact values; show two or three options with their effect (for example 0, 2 or 4 px) and recommend one. If the user does not know, choose and say why.
2. **Audit the token's real use before changing it.** List every component that uses it. If the token is shared with things the user did not mention (switches, chips, bubbles, tracks), split those into their own token first, so that only the intended components change.
3. **Check coherence and side effects.** Say what the change touches and what it does not; if it clashes with the rest (square buttons next to very round cards), propose the matching adjustment but do not apply it without the user's yes. Colour changes: re-run contrast. Font changes: re-check the scale and line lengths.
4. **Update `DESIGN.md`:** change the token, bump `version` and `updated`, and add a row to the change log (if the file already has its own change-log format, keep it). Also update any prose that quotes the old value, such as shape and component sections.
5. **Hand over a migration prompt** from `references/migration-prompt-template.md`, filled in, ready to paste into the LLM that develops the project. Show it in the chat and also save it as a file next to `DESIGN.md`. Do not edit the project's code yourself: that LLM knows the code, this skill knows the design.

Repeat as many times as needed and keep the change log honest, so any LLM reading the file understands why the system is the way it is.
