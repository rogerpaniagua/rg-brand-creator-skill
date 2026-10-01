---
name: brand-creator-rg
description: Turns a reference website's design into a brand's own, finished DESIGN.md that Claude Code or any LLM can build projects from. Starts by extracting style from one or more reference URLs with the Dembrandt MCP, then makes it the brand's own using their brandbook, visual assets or a short interview, and ends with guidance for building from the resulting DESIGN.md. Use whenever the user wants a design system, DESIGN.md, brand style guide or visual direction for a website, product or company, wants to "extract the style" of a site and adapt it to their brand, mentions Dembrandt, Brandfetch or a brandbook as input, or is about to start a redesign and has no design system yet, even if they never say "DESIGN.md".
---

# Brand creator

Output: one finished `DESIGN.md` for a specific brand, project or company. Not a copy of the reference: the reference is the starting material, the brand's decisions win every conflict. This skill does not build the site; its last phase teaches how to build from the file.

Talk to the user in their language. Write the `DESIGN.md` in English (LLMs read it best that way).

## Phase 1: Extract the base

1. Ask for the reference URL(s) first. Explain the point: pick sites at the level and style the brand wants to reach. Several URLs are welcome; the best of each will be combined. Also ask which page and, if relevant, which mode (dark/light).
2. Dembrandt is the core of this skill, so make sure it is there without asking. Check for tools named `mcp__dembrandt__*`. If they are missing, install it yourself and tell the user afterwards what you did:
   - Claude Code: `claude mcp add --transport stdio dembrandt -- npx -y --package dembrandt dembrandt-mcp` (registers it for all projects).
   - Claude Desktop (no CLI available): add `{"dembrandt": {"command": "npx", "args": ["-y", "--package", "dembrandt", "dembrandt-mcp"]}}` under `mcpServers` in its config.
   A freshly added MCP usually appears only after a restart or reload. If the tools are still not available, tell the user to restart and re-run the skill, and keep the URLs they gave so nothing is lost. If the install fails (no Node/npx, no network), report the exact error and fix the cause; do not skip the extraction or invent tokens by hand.
3. Extract each URL: `get_design_tokens`, `get_color_palette`, `get_typography`, `get_spacing`, `get_surfaces`, `get_component_styles`, `get_brand_identity`; then `generate_design_md` and `get_findings`. Extraction launches a real browser and can take a while: follow `get_job_status` instead of relaunching. Use `check_contrast` for the text/background pairs that matter.
4. With several URLs, merge: keep what they agree on, pick the best of each where they differ, and note where each decision came from. Drop reference-specific noise (its logo, product imagery, tracking colours, one-off values).
5. Show the user a short summary of the base style (palette, type, shape, tone) before moving on.

## Phase 2: Make it the brand's own

Ask: "Do you have a brandbook, visual ecosystem or any document or artifact that explains how your brand looks and works?" Accept anything: PDF, Brandfetch link, Figma, existing site, logo and font files, guidelines, screenshots.

- **If yes:** read all of it, map it onto the base, and tell the user what you could extract and what is still missing ("I have colours and logo, I am missing typography and tone"). Keep asking until nothing essential is missing.
- **If no:** interview in short rounds (colour, typography, shape and spacing, motion and tone, the "never" list). Each round shows concrete options (for example three font pairings with the reason for each) and proposes a default so the user can just say yes. Brand decisions override the reference.

What counts as "essential" is for you to judge from how complex the extracted base is: a rich system needs more answers (states, density, dark/light, motion) than a simple one. Do not use a fixed questionnaire; ask what is needed to build this specific system. Anything the user truly does not know, propose a sensible choice and mark it as an assumption.

## Phase 3: Write the final DESIGN.md

Say "I have what I need" and confirm before writing. Then write `DESIGN.md` at the project root (never overwrite an existing one without asking; offer a backup). It must be self-contained, with no leftovers from the reference:
- YAML front matter with tokens (colours with roles, typography scale, spacing, radii, borders/shadows). Define tokens per component, not only globally: `radius.button`, `radius.card`, `radius.input`, `radius.tag`, button height and padding, border width per component, and so on. Components reference these tokens and each exception is named explicitly (for example "the hero CTA is a pill"). This is what makes a later tweak a one-line change that cannot ripple into the rest. Be as specific as possible: exact values, units, states (hover, focus, disabled), and what each token applies to and does not.
- Sections: overview and tone, colour, typography, layout and spacing, shape, components, motion, accessibility (contrast ratios checked), Do and Don't, assumptions to confirm.
- Fonts that are proprietary in the reference are replaced by available equivalents, and the choice is explained.

Check contrast before finishing; fix or flag any text pair below 4.5:1.

## Phase 4: How to build from it

Finish with practical guidance, in the chat and as a short "Building with this file" section at the end of `DESIGN.md`:
- Tell Claude Code (or any LLM) to read `DESIGN.md` first and use only its tokens; put it at the repo root and mention it in `CLAUDE.md`/`AGENTS.md`.
- Use visual references as inspiration for layout and pattern, then translate them into the brand's tokens instead of copying their styles.
- Build one section at a time, review, then continue; keep styles in one place with tokens as variables; re-check contrast after changes.
- When the system evolves, update `DESIGN.md` first, then the code (Phase 5 describes how, including the prompt to migrate what is already built).

## Phase 5: Refine (repeatable)

The user will often see the system built and want to adjust it ("buttons less rounded, more rectangular"). Handle every adjustment like this:

1. **Pin it down.** Turn the vague wish into exact values and show two or three concrete options with their effect (for example 0, 2 or 4 px radius), recommending one. If the user does not know, pick the best and say why.
2. **Check scope and coherence.** Say which components the token touches and which it does not. Warn if the change breaks the system's consistency (square buttons next to very round cards) and propose the matching adjustment.
3. **Check side effects.** Colour changes: re-run contrast. Font changes: re-check the type scale and line lengths.
4. **Update `DESIGN.md`:** change the specific token, and add a line to a "Change log" section at the end (date, token, old value, new value, reason). The file is the source of truth, so it is edited first.
5. **Hand over a migration prompt**, ready to paste into Claude Code or the LLM that develops the project, to apply the same change to what is already built. Make it concrete: the token, old and new value, where to look (components and files by name when known), the explicit exceptions, and what to verify afterwards (no hard-coded values left, contrast, responsive). Do not edit the project's code yourself: the developer LLM knows the code, this skill knows the design, and the prompt is the bridge.

Repeat as many times as needed. Keep the change log honest so any LLM reading `DESIGN.md` understands why the system is the way it is.
