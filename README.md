# brand-creator-rg

Skill de Claude que convierte una referencia visual (URLs) en un `DESIGN.md` propio y listo para construir.

Flujo: extraer estilo con Dembrandt (MCP) → hacerlo de la marca (brandbook o entrevista) → escribir `DESIGN.md` final con tokens por componente → guía de construcción → refinar (con prompt de migración).

## Contenido
- `brand-creator-rg/SKILL.md`: la skill.

## Instalar
Copia la carpeta interna `brand-creator-rg/` a `~/.claude/skills/`:

```bash
cp -R brand-creator-rg ~/.claude/skills/
```

Se activa sola al pedir un design system o un `DESIGN.md`, o con `/brand-creator-rg`.

## Mantenimiento
Edita la copia de este proyecto y vuelve a copiarla a `~/.claude/skills/` (o enlázala con `ln -s`) para que ambas no diverjan.
