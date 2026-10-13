// Style probe: reads the REAL computed style of the page it runs on.
// Run it by pasting this whole file into the browser's javascript tool (one expression, returns an object).
// It never trusts a generated summary: use its output to verify or replace the extraction values.
(() => {
  const cs = (el) => getComputedStyle(el);
  const visible = (el) => { const r = el.getBoundingClientRect(); return r.width > 8 && r.height > 8 && cs(el).visibility !== 'hidden' && cs(el).display !== 'none'; };
  const transparent = (c) => c === 'rgba(0, 0, 0, 0)' || c === 'transparent';
  const count = (arr) => { const m = new Map(); arr.forEach(v => m.set(v, (m.get(v) || 0) + 1)); return [...m].sort((a, b) => b[1] - a[1]); };
  const px = (v) => v.replace(/\.0+px/, 'px');

  const root = cs(document.documentElement), body = cs(document.body);
  const solidBg = !transparent(body.backgroundColor) ? body.backgroundColor : root.backgroundColor;

  // Typography by role
  const type = (sel, n) => [...document.querySelectorAll(sel)].filter(visible).slice(0, n).map(e => { const s = cs(e); return { tag: e.tagName.toLowerCase(), text: e.textContent.trim().slice(0, 28), size: s.fontSize, weight: s.fontWeight, lineHeight: s.lineHeight, tracking: s.letterSpacing, family: s.fontFamily.split(',')[0].replace(/"/g, ''), color: s.color }; });
  const headings = ['h1', 'h2', 'h3', 'h4'].flatMap(t => type(t, 2));
  const paragraphs = type('p', 3);
  const mono = type('code, pre, kbd, [class*="mono"]', 2);

  // Buttons and links that look like buttons: distinct visual styles, with counts
  const clickable = [...document.querySelectorAll('a, button, [role="button"]')].filter(visible).filter(e => { const s = cs(e); return !transparent(s.backgroundColor) || (s.borderTopWidth !== '0px' && !transparent(s.borderTopColor)); });
  const btnKey = (e) => { const s = cs(e); return [s.backgroundColor, s.color, s.borderRadius, s.padding, s.fontSize, s.fontWeight, s.borderTopWidth + ' ' + s.borderTopColor, s.height].join('|'); };
  const btnGroups = new Map();
  clickable.forEach(e => { const k = btnKey(e); if (!btnGroups.has(k)) btnGroups.set(k, { n: 0, example: e.textContent.trim().slice(0, 24) }); btnGroups.get(k).n++; });
  const buttons = [...btnGroups].sort((a, b) => b[1].n - a[1].n).slice(0, 6).map(([k, v]) => { const [bg, color, radius, padding, size, weight, border, height] = k.split('|'); return { example: v.example, uses: v.n, bg, color, radius, padding, size, weight, border, height }; });

  // Cards / surfaces: block elements with their own background or border and a radius
  const surfaces = [...document.querySelectorAll('div, section, article, li')].filter(visible).filter(e => { const s = cs(e), r = e.getBoundingClientRect(); return r.width > 120 && r.height > 60 && r.width < innerWidth * 0.9 && s.borderRadius !== '0px' && (!transparent(s.backgroundColor) || s.borderTopWidth !== '0px') && s.backgroundColor !== solidBg; });
  const surfaceStyles = count(surfaces.map(e => { const s = cs(e); return [s.backgroundColor, s.borderRadius, s.borderTopWidth + ' ' + s.borderTopStyle + ' ' + s.borderTopColor, s.boxShadow === 'none' ? '' : s.boxShadow.slice(0, 80)].join(' | '); })).slice(0, 5).map(([style, uses]) => ({ style, uses }));

  // Inputs
  const inputs = [...document.querySelectorAll('input:not([type=hidden]), textarea, select')].filter(visible).slice(0, 2).map(e => { const s = cs(e); return { type: e.type || e.tagName.toLowerCase(), bg: s.backgroundColor, color: s.color, radius: s.borderRadius, border: s.borderTopWidth + ' ' + s.borderTopColor, padding: s.padding, height: s.height, size: s.fontSize }; });

  // Links, shadows, motion, fonts, variables
  const link = [...document.querySelectorAll('a')].filter(visible).slice(0, 12).map(e => cs(e).color);
  const shadows = count([...document.querySelectorAll('*')].slice(0, 1500).map(e => cs(e).boxShadow).filter(v => v !== 'none')).slice(0, 4).map(([v, n]) => ({ shadow: v.slice(0, 100), uses: n }));
  const motion = count([...document.querySelectorAll('a, button, [role=button]')].slice(0, 200).map(e => cs(e).transition).filter(v => v && !v.startsWith('all 0s'))).slice(0, 3).map(([v, n]) => ({ transition: v.slice(0, 100), uses: n }));
  const fonts = [...new Set([...document.fonts].map(f => f.family.replace(/"/g, '') + ' ' + f.weight))].slice(0, 10);
  const vars = {};
  for (const sheet of document.styleSheets) { try { for (const r of sheet.cssRules) { if (r.style && /^(:root|html|:host|body)/.test(r.selectorText || '')) for (const p of r.style) if (p.startsWith('--') && Object.keys(vars).length < 40) vars[p] = r.style.getPropertyValue(p).trim().slice(0, 60); } } catch (e) { /* cross-origin sheet */ } }

  // Spacing: most common paddings and gaps
  const sp = count([...document.querySelectorAll('section, div, li, a, button')].slice(0, 1200).flatMap(e => { const s = cs(e); return [s.paddingTop, s.paddingLeft, s.rowGap, s.columnGap].filter(v => v && v !== '0px' && v !== 'normal'); })).slice(0, 10).map(([v, n]) => v + ' x' + n);

  return {
    url: location.href,
    prefersDark: matchMedia('(prefers-color-scheme: dark)').matches,
    page: { background: solidBg, text: body.color, bodyFont: body.fontFamily.split(',').slice(0, 2).join(','), bodySize: body.fontSize, lineHeight: body.lineHeight },
    headings, paragraphs, mono, buttons, surfaces: surfaceStyles, inputs,
    linkColors: [...new Set(link)].slice(0, 4), shadows, motion, fonts, spacingMostCommon: sp,
    cssVariables: vars, cssVariableCount: Object.keys(vars).length,
    note: 'Values are computed styles of the live page in the mode it is showing. Re-run after toggling dark/light.'
  };
})()
