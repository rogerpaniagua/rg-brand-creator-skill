# Migration prompt template

Hand this to Claude Code (or the LLM that builds the project) after changing `DESIGN.md`. Fill every slot; if you do not know file names, say "search for" and give the search hint instead of guessing paths.

```text
Read DESIGN.md first. It changed: version <old> -> <new>.

CHANGE
- <token>: <old value> -> <new value>   (reason: <why>)
- <second token if any>

APPLY TO
- <components that use this token, by name>

DO NOT CHANGE
- <components that share the old value but are out of scope, and the token they must keep>
- <explicit exceptions, e.g. "the hero CTA stays a pill">

WHERE TO LOOK
- <files or components by name when known>
- Search hints: <class names, CSS variables, utility classes such as rounded-*>

HOW
1. Update the token definition first (CSS variable or theme), then the components that reference it.
2. Replace hard-coded values for this property with the token. Do not add new hard-coded values.

VERIFY
- No leftover old value for this property outside the exceptions.
- Focus ring, hover and disabled states still look right with the new shape.
- Contrast unchanged (or re-checked if colours changed). Check mobile and desktop.
- Report back: files changed and anything that looked out of scope.
```
