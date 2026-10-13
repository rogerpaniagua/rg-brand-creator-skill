# brand-creator-rg

Skill de Claude que convierte una referencia visual (URLs) en un `DESIGN.md` propio y listo para construir.

Flujo: extraer estilo con Dembrandt (MCP) → hacerlo de la marca (brandbook o entrevista) → escribir `DESIGN.md` final con tokens por componente → guía de construcción → refinar (con prompt de migración).

## Contenido
- `brand-creator-rg/SKILL.md`: la skill.
- `brand-creator-rg/references/`: plantilla del `DESIGN.md` y plantilla del prompt de migración.
- `brand-creator-rg/scripts/probe.js`: sonda que lee los estilos reales de una página (se pega en el navegador integrado).

## Requisitos
- Dembrandt (MCP). Si falta, la skill lo instala; necesita Node/npx y el Chromium de Playwright que indique su error.
- Navegador integrado de Claude (para la sonda y como plan B de extracción).

## Instalar
Copia la carpeta interna `brand-creator-rg/` a `~/.claude/skills/`:

```bash
cp -R brand-creator-rg ~/.claude/skills/
```

Se activa sola al pedir un design system o un `DESIGN.md`, o con `/brand-creator-rg`.

## Mantenimiento
Edita la copia de este proyecto y vuelve a copiarla a `~/.claude/skills/` (o enlázala con `ln -s`) para que ambas no diverjan.
