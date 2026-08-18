#!/usr/bin/env node
/**
 * fractalstyler2 MCP Server
 * Model Context Protocol server exposing design tokens, SASS mixin compilation,
 * token snapping, component generation, and linting for OpenDesign, Claude Desktop, Cursor, etc.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
	ListResourcesRequestSchema,
	ReadResourceRequestSchema,
	ListPromptsRequestSchema,
	GetPromptRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import * as sass from 'sass';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const VERSION = '0.3.0';

// Resolve styles directory for SASS compiler loadPaths
function getStylesDir(): string {
	const HERE = dirname(fileURLToPath(import.meta.url));
	const candidates = [
		join(HERE, '..', 'styles'),
		join(HERE, '..', '..', 'templates'),
		join(HERE, 'styles'),
		join(process.cwd(), 'src', 'lib', 'styles'),
		join(process.cwd(), 'templates')
	];
	for (const candidate of candidates) {
		if (existsSync(candidate) && existsSync(join(candidate, '_00_tokens.sass'))) {
			return candidate;
		}
	}
	// Fallback to current working directory
	return process.cwd();
}

// Design Token Catalog
const DESIGN_TOKENS = {
	version: VERSION,
	breakpoints: {
		sm: '640px',
		md: '768px',
		lg: '1024px',
		xl: '1240px'
	},
	space: {
		scale: ['3xs', '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', 's-l'],
		clamp: {
			'3xs': 'clamp(0.3125rem, 0.3125rem + 0vw, 0.3125rem)', // ~5px
			'2xs': 'clamp(0.5625rem, 0.5369rem + 0.1136vw, 0.625rem)', // ~9-10px
			xs: 'clamp(0.875rem, 0.8494rem + 0.1136vw, 0.9375rem)', // ~14-15px
			s: 'clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem)', // ~18-20px
			m: 'clamp(1.6875rem, 1.6108rem + 0.3409vw, 1.875rem)', // ~27-30px
			l: 'clamp(2.25rem, 2.1477rem + 0.4545vw, 2.5rem)', // ~36-40px
			xl: 'clamp(3.375rem, 3.2216rem + 0.6818vw, 3.75rem)', // ~54-60px
			'2xl': 'clamp(4.5rem, 4.2955rem + 0.9091vw, 5rem)', // ~72-80px
			'3xl': 'clamp(6.75rem, 6.4432rem + 1.3636vw, 7.5rem)', // ~108-120px
			's-l': 'clamp(1.125rem, 0.5625rem + 2.5vw, 2.5rem)' // fluid s to l
		},
		approxPx: {
			'3xs': 5,
			'2xs': 9,
			xs: 14,
			s: 18,
			m: 27,
			l: 36,
			xl: 54,
			'2xl': 72,
			'3xl': 108
		}
	},
	typography: {
		scale: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'],
		clamp: {
			xs: '0.75rem',
			sm: 'clamp(0.9375rem, 0.9119rem + 0.1136vw, 1rem)',
			md: 'clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem)',
			lg: 'clamp(1.35rem, 1.2631rem + 0.3864vw, 1.5625rem)',
			xl: 'clamp(1.62rem, 1.4837rem + 0.6057vw, 1.9531rem)',
			'2xl': 'clamp(1.944rem, 1.7405rem + 0.9044vw, 2.4414rem)',
			'3xl': 'clamp(2.3328rem, 2.0387rem + 1.3072vw, 3.0518rem)',
			'4xl': 'clamp(2.7994rem, 2.384rem + 1.8461vw, 3.8147rem)'
		},
		approxPx: {
			xs: 12,
			sm: 15,
			md: 18,
			lg: 22,
			xl: 26,
			'2xl': 31,
			'3xl': 38,
			'4xl': 45
		},
		fonts: {
			sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
			mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
		}
	},
	radius: {
		steps: ['0', '2', '3', '4', '6', '8', '12', '16', '24', 'full'],
		values: {
			'0': '0px',
			'2': '2px',
			'3': '3px',
			'4': '4px',
			'6': '6px',
			'8': '8px',
			'12': '12px',
			'16': '16px',
			'24': '24px',
			full: '9999px'
		}
	},
	shadows: {
		sm: '0 1px 2px rgba(15, 23, 42, 0.06)',
		md: '0 4px 12px rgba(15, 23, 42, 0.08)',
		lg: '0 12px 32px rgba(15, 23, 42, 0.12)'
	},
	surfaces: {
		bg: 'var(--bg)',
		surface: 'var(--bg-surface)',
		raised: 'var(--bg-raised)',
		panel: 'var(--bg-panel)',
		footer: 'var(--bg-footer)',
		popover: 'var(--bg-popover)',
		dialog: 'var(--bg-dialog)',
		terminal: 'var(--bg-terminal)',
		input: 'var(--bg-input)',
		canvas: 'var(--bg-canvas)'
	},
	ink: {
		primary: 'var(--text-primary)',
		secondary: 'var(--text-secondary)',
		muted: 'var(--text-muted)',
		inverse: 'var(--text-inverse)',
		themeColor: 'var(--theme-color)',
		themeColorAlt: 'var(--theme-color-alt)'
	},
	brand: {
		theme: 'var(--theme)',
		themeHover: 'var(--theme-hover)',
		themeActive: 'var(--theme-active)',
		ring: 'var(--ring)'
	},
	layering: {
		'--z-base': 0,
		'--z-raised': 10,
		'--z-sticky': 100,
		'--z-modal': 200,
		'--z-toast': 300
	}
};

// Catalog of Fractals (Mixins)
const FRACTAL_CATALOG = {
	atoms: [
		{ name: 'box', signature: '+box($x: null, $y: null)', description: 'Flex column layout with optional cross/main axis alignment.' },
		{ name: 'row', signature: '+row($x: null, $y: null)', description: 'Flex row layout with optional main/cross axis alignment.' },
		{ name: 'wrap', signature: '+wrap', description: 'Enables flex-wrap: wrap on container.' },
		{ name: 'grid', signature: '+grid($cols: 1)', description: 'CSS grid with fixed column count repeat($cols, minmax(0, 1fr)).' },
		{ name: 'auto-grid', signature: '+auto-grid($min: 15rem, $gap: s)', description: 'Intrinsic auto-fit CSS grid without breakpoints.' },
		{ name: 'center', signature: '+center', description: 'Dead-center anything using display: grid; place-items: center.' },
		{ name: 'gap', signature: '+gap($v: s)', description: 'Applies gap from space token or raw px value.' },
		{ name: 'pad', signature: '+pad($v: s)', description: 'Applies padding on all sides from space token or raw px.' },
		{ name: 'px', signature: '+px($v: s)', description: 'Applies inline padding (left/right) from space token or raw px.' },
		{ name: 'py', signature: '+py($v: s)', description: 'Applies block padding (top/bottom) from space token or raw px.' },
		{ name: 'mx-auto', signature: '+mx-auto', description: 'Sets margin-inline: auto for horizontal centering.' },
		{ name: 'my-auto', signature: '+my-auto', description: 'Sets margin-block: auto for vertical centering.' },
		{ name: 'w', signature: '+w($v: 100%)', description: 'Sets width.' },
		{ name: 'h', signature: '+h($v: 100%)', description: 'Sets height.' },
		{ name: 'full', signature: '+full', description: 'Sets width: 100% and height: 100%.' },
		{ name: 'square', signature: '+square($v)', description: 'Sets equal width and height.' },
		{ name: 'grow', signature: '+grow($n: 1)', description: 'Sets flex-grow.' },
		{ name: 'shrink', signature: '+shrink($n: 0)', description: 'Sets flex-shrink.' },
		{ name: 'min0', signature: '+min0', description: 'Sets min-width: 0 and min-height: 0 to prevent overflow.' },
		{ name: 'bg', signature: '+bg($role: surface)', description: 'Sets background-color to any of the 21 surface tokens.' },
		{ name: 'ink', signature: '+ink($role: primary)', description: 'Sets text color to primary, secondary, muted, inverse, theme-color, theme-color-alt.' },
		{ name: 'border', signature: '+border($side: all, $color: var(--border))', description: 'Applies 1px solid border on all sides or a specific side.' },
		{ name: 'radius', signature: '+radius($v: 6)', description: 'Applies border-radius from radius token or raw px.' },
		{ name: 'shadow', signature: '+shadow($v: md)', description: 'Applies box-shadow from shadow scale (sm, md, lg).' },
		{ name: 'type', signature: '+type($v)', description: 'Applies font-size from fluid type scale (xs..4xl).' },
		{ name: 'weight', signature: '+weight($w: 500)', description: 'Sets font-weight.' },
		{ name: 'leading', signature: '+leading($lh: 1.5)', description: 'Sets line-height.' },
		{ name: 'truncate', signature: '+truncate', description: 'Single-line text truncation with ellipsis.' },
		{ name: 'clamp-lines', signature: '+clamp-lines($n: 2)', description: 'Multi-line clamp using -webkit-line-clamp.' },
		{ name: 'transition', signature: '+transition($props: all, $dur: 150ms, $ease: ease)', description: 'Smooth CSS transition.' },
		{ name: 'ring', signature: '+ring($color: var(--ring))', description: 'Focus outline ring with 1px offset.' }
	],
	molecules: [
		{ name: 'stack', signature: '+stack($gap: xs, $x: null)', description: 'Vertical rhythm: flex column + gap.' },
		{ name: 'cluster', signature: '+cluster($gap: xs, $x: start, $y: center)', description: 'Wrapping row for tags/buttons/chips.' },
		{ name: 'center-column', signature: '+center-column($max: var(--measure, 60ch), $pad: s)', description: 'Bounded reading column with max-width measure.' },
		{ name: 'cover', signature: '+cover($min: 100vh, $pad: s)', description: 'Full-height container with vertically centered focal child.' },
		{ name: 'frame', signature: '+frame($ratio: 16 / 9)', description: 'Aspect-ratio container for media (images, video, iframe).' },
		{ name: 'reel', signature: '+reel($gap: xs)', description: 'Horizontal scroll-snap rail.' },
		{ name: 'with-sidebar', signature: '+with-sidebar($rail: 240px, $gap: s, $min: 60%)', description: 'Intrinsic sidebar and fluid main content.' },
		{ name: 'surface', signature: '+surface($bg: surface, $pad: null, $radius: 6, $elevation: none)', description: 'All-in-one material fractal: skin, radius, pad, and elevation.' },
		{ name: 'cols', signature: '+cols($map, $gap: s)', description: 'Responsive column grid mapped across breakpoints, e.g. (base: 1, sm: 2, lg: 3).' }
	],
	recipes: [
		{ name: 'card', signature: '+card($bg: surface, $pad: null, $radius: 6, $elevation: none)', description: 'Vertical card container recipe with optional pad and elevation.' },
		{ name: 'control', signature: '+control($size: md, $radius: 4)', description: 'Universal interactive control recipe (buttons, triggers, inputs).' },
		{ name: 'select', signature: '+select($size: md, $radius: 4)', description: 'Select input recipe with embedded SVG chevron.' },
		{ name: 'badge', signature: '+badge($radius: 4)', description: 'Compact status badge recipe.' }
	],
	layouts: [
		{ name: 'grid-3', class: '.grid-3', description: 'Responsive 1 → 2 → 3 column reflow.' },
		{ name: 'card-grid', class: '.card-grid', description: 'Intrinsic auto-fit grid for cards.' },
		{ name: 'hero', class: '.hero', description: 'Full viewport cover with centered hero message.' },
		{ name: 'holy-grail', class: '.holy-grail', description: 'Responsive header / (nav · main · aside) / footer.' },
		{ name: 'docs', class: '.docs', description: 'Docs template with sidebar nav, center reading column, and right TOC.' },
		{ name: 'app-shell', class: '.app-shell', description: 'Sticky header, fluid body, and footer application frame.' }
	]
};

// Guidelines & Golden Rules
const GUIDELINES = `
# fractalstyler2 Design System Rules

1. Never hardcode a value that a token covers (+gap(m), +radius(6), +bg(surface)).
2. Compose fractals (+surface, +stack, +cluster, +card); write raw CSS only for genuinely unique lines.
3. Express component state on data-* / aria-* attributes, never modifier classes (e.g. &[data-elevated], &[data-variant='ghost']).
4. Markup stays thin and semantic: prefer clean tags (<article class="card">) over utility class soup.
5. Mobile-first: define base styles first, then grow with +at(md/lg/xl) or +cols().
6. No legacy v1 classes (e.g. no gap8, pad16, w100, .stack as markup class).
`.trim();

// Snapping helper: find closest token
function findNearestToken(val: number, scaleMap: Record<string, number>): { token: string; approxPx: number; diff: number } {
	let bestToken = Object.keys(scaleMap)[0];
	let bestDiff = Math.abs(val - scaleMap[bestToken]);

	for (const [token, px] of Object.entries(scaleMap)) {
		const diff = Math.abs(val - px);
		if (diff < bestDiff) {
			bestDiff = diff;
			bestToken = token;
		}
	}
	return { token: bestToken, approxPx: scaleMap[bestToken], diff: bestDiff };
}

// Create MCP Server
const server = new Server(
	{
		name: 'fractalstyler2',
		version: VERSION
	},
	{
		capabilities: {
			tools: {},
			resources: {},
			prompts: {}
		}
	}
);

// -----------------------------------------------------------------------------
// LIST TOOLS
// -----------------------------------------------------------------------------
server.setRequestHandler(ListToolsRequestSchema, async () => {
	return {
		tools: [
			{
				name: 'compile_fractals',
				description: 'Compiles indented SASS fractal mixins into CSS. Useful for live preview in OpenDesign or web apps.',
				inputSchema: {
					type: 'object',
					properties: {
						sassCode: {
							type: 'string',
							description: 'Indented SASS code. Can use any fractal mixin (+surface, +stack, +gap, etc.).'
						},
						className: {
							type: 'string',
							description: 'Optional CSS class name to wrap the mixins under (e.g. "preview-card"). Defaults to "element".'
						}
					},
					required: ['sassCode']
				}
			},
			{
				name: 'get_design_tokens',
				description: 'Returns the complete structured JSON design tokens (space, typography, radius, shadows, colors, breakpoints).',
				inputSchema: {
					type: 'object',
					properties: {
						category: {
							type: 'string',
							enum: ['all', 'space', 'typography', 'radius', 'shadows', 'surfaces', 'ink', 'breakpoints'],
							description: 'Optional category filter. Defaults to "all".'
						}
					}
				}
			},
			{
				name: 'snap_to_tokens',
				description: 'Takes raw pixel values (e.g. from canvas elements in OpenDesign) and snaps them to the nearest fractalstyler2 design tokens.',
				inputSchema: {
					type: 'object',
					properties: {
						gap: { type: 'number', description: 'Gap in pixels (e.g. 16)' },
						padding: { type: 'number', description: 'Padding in pixels (e.g. 24)' },
						radius: { type: 'number', description: 'Border radius in pixels (e.g. 10)' },
						fontSize: { type: 'number', description: 'Font size in pixels (e.g. 18)' }
					}
				}
			},
			{
				name: 'css_to_fractals',
				description: 'Converts raw CSS declarations (from Figma/OpenDesign inspection) into idiomatic fractalstyler2 SASS mixins.',
				inputSchema: {
					type: 'object',
					properties: {
						css: {
							type: 'string',
							description: 'Raw CSS block or declaration lines (e.g. "display: flex; flex-direction: column; gap: 16px; padding: 20px; border-radius: 12px; background: #ffffff;")'
						}
					},
					required: ['css']
				}
			},
			{
				name: 'generate_component',
				description: 'Generates a production-ready Svelte 5 component with runes and scoped SASS fractal mixins.',
				inputSchema: {
					type: 'object',
					properties: {
						name: { type: 'string', description: 'Component name (e.g. PricingCard, UserAvatar, HeroBanner)' },
						type: {
							type: 'string',
							enum: ['card', 'panel', 'button', 'badge', 'modal', 'hero', 'nav', 'custom'],
							description: 'Type of component recipe.'
						},
						elevation: {
							type: 'string',
							enum: ['none', 'sm', 'md', 'lg'],
							description: 'Surface elevation.'
						},
						description: { type: 'string', description: 'Detailed description of component purpose and props.' }
					},
					required: ['name', 'type']
				}
			},
			{
				name: 'validate_recipe',
				description: 'Lints a SASS snippet or Svelte component against fractalstyler2 golden rules (flags legacy classes, unmapped pixels, etc.).',
				inputSchema: {
					type: 'object',
					properties: {
						code: { type: 'string', description: 'The SASS or Svelte code to validate.' }
					},
					required: ['code']
				}
			},
			{
				name: 'list_fractals',
				description: 'Returns the catalog of all available atom & molecule mixins with their signatures and descriptions.',
				inputSchema: {
					type: 'object',
					properties: {
						tier: {
							type: 'string',
							enum: ['all', 'atoms', 'molecules', 'recipes', 'layouts'],
							description: 'Filter by fractal tier.'
						}
					}
				}
			}
		]
	};
});

// -----------------------------------------------------------------------------
// CALL TOOL
// -----------------------------------------------------------------------------
server.setRequestHandler(CallToolRequestSchema, async (request) => {
	const { name, arguments: args = {} } = request.params;

	switch (name) {
		case 'compile_fractals': {
			const rawSass = (args.sassCode as string) || '';
			const className = (args.className as string) || 'element';
			const stylesDir = getStylesDir();

			// Indent code lines under selector
			const indented = rawSass
				.split('\n')
				.map((line) => (line.trim() ? `\t${line}` : ''))
				.join('\n');

			const fullSass = `
@use 'tokens'
@use 'base'
@use 'fractals' as *

.${className}
${indented}
`;

			try {
				const result = sass.compileString(fullSass, {
					syntax: 'indented',
					loadPaths: [stylesDir]
				});

				return {
					content: [
						{
							type: 'text',
							text: result.css
						}
					]
				};
			} catch (err: any) {
				return {
					isError: true,
					content: [
						{
							type: 'text',
							text: `SASS Compilation Error:\n${err?.message || String(err)}`
						}
					]
				};
			}
		}

		case 'get_design_tokens': {
			const category = (args.category as string) || 'all';
			if (category === 'all') {
				return {
					content: [{ type: 'text', text: JSON.stringify(DESIGN_TOKENS, null, 2) }]
				};
			}
			const filtered = (DESIGN_TOKENS as any)[category] || null;
			return {
				content: [{ type: 'text', text: JSON.stringify({ [category]: filtered }, null, 2) }]
			};
		}

		case 'snap_to_tokens': {
			const results: Record<string, any> = {};

			if (typeof args.gap === 'number') {
				const match = findNearestToken(args.gap, DESIGN_TOKENS.space.approxPx);
				results.gap = {
					inputPx: args.gap,
					nearestToken: match.token,
					cssVar: `var(--space-${match.token})`,
					suggestedMixin: `+gap(${match.token})`,
					utilityClass: `.gap-${match.token}`
				};
			}

			if (typeof args.padding === 'number') {
				const match = findNearestToken(args.padding, DESIGN_TOKENS.space.approxPx);
				results.padding = {
					inputPx: args.padding,
					nearestToken: match.token,
					cssVar: `var(--space-${match.token})`,
					suggestedMixin: `+pad(${match.token})`,
					utilityClass: `.pad-${match.token}`
				};
			}

			if (typeof args.radius === 'number') {
				const radiusPxMap: Record<string, number> = { '0': 0, '2': 2, '4': 4, '6': 6, '8': 8, '12': 12, '16': 16, '24': 24, full: 9999 };
				const match = findNearestToken(args.radius, radiusPxMap);
				results.radius = {
					inputPx: args.radius,
					nearestToken: match.token,
					cssVar: `var(--radius-${match.token})`,
					suggestedMixin: `+radius(${match.token})`,
					utilityClass: `.radius-${match.token}`
				};
			}

			if (typeof args.fontSize === 'number') {
				const match = findNearestToken(args.fontSize, DESIGN_TOKENS.typography.approxPx);
				results.fontSize = {
					inputPx: args.fontSize,
					nearestToken: match.token,
					cssVar: `var(--text-${match.token})`,
					suggestedMixin: `+type(${match.token})`,
					utilityClass: `.text-${match.token}`
				};
			}

			return {
				content: [{ type: 'text', text: JSON.stringify(results, null, 2) }]
			};
		}

		case 'css_to_fractals': {
			const rawCss = (args.css as string) || '';
			const lines = rawCss.split(/[;\n]/).map((l) => l.trim()).filter(Boolean);

			const mixins: string[] = [];
			let hasFlexCol = false;
			let hasFlexRow = false;
			let gapVal: string | null = null;
			let padVal: string | null = null;
			let radiusVal: string | null = null;
			let bgVal: string | null = null;
			let elevationVal: string | null = null;

			for (const line of lines) {
				const [prop, val] = line.split(':').map((s) => s?.trim());
				if (!prop || !val) continue;

				if (prop === 'display' && val === 'flex') {
					// wait for flex-direction
				} else if (prop === 'flex-direction' && val === 'column') {
					hasFlexCol = true;
				} else if (prop === 'flex-direction' && val === 'row') {
					hasFlexRow = true;
				} else if (prop === 'gap') {
					const num = parseInt(val, 10);
					if (!isNaN(num)) {
						gapVal = findNearestToken(num, DESIGN_TOKENS.space.approxPx).token;
					}
				} else if (prop === 'padding') {
					const num = parseInt(val, 10);
					if (!isNaN(num)) {
						padVal = findNearestToken(num, DESIGN_TOKENS.space.approxPx).token;
					}
				} else if (prop === 'border-radius') {
					const num = parseInt(val, 10);
					if (!isNaN(num)) {
						radiusVal = String(num);
					}
				} else if (prop === 'background-color' || prop === 'background') {
					if (val.includes('raised')) bgVal = 'raised';
					else if (val.includes('surface') || val === '#ffffff' || val === '#fff') bgVal = 'surface';
					else bgVal = 'bg';
				} else if (prop === 'box-shadow') {
					elevationVal = 'md';
				}
			}

			// If surface combination
			if (bgVal || padVal || radiusVal) {
				mixins.push(`+surface(${bgVal || 'surface'}, ${padVal || 's'}, ${radiusVal || '12'}${elevationVal ? `, ${elevationVal}` : ''})`);
			}

			if (hasFlexCol) {
				mixins.push(`+stack(${gapVal || 's'})`);
			} else if (hasFlexRow) {
				mixins.push(`+cluster(${gapVal || 'xs'})`);
			} else if (gapVal && !hasFlexCol && !hasFlexRow) {
				mixins.push(`+gap(${gapVal})`);
			}

			const output = mixins.length > 0 ? mixins.join('\n') : '// No direct fractal match; use atoms:\n+box\n+gap(s)';

			return {
				content: [
					{
						type: 'text',
						text: `Suggested fractalstyler2 recipe:\n\n${output}`
					}
				]
			};
		}

		case 'generate_component': {
			const compName = (args.name as string) || 'CustomCard';
			const type = (args.type as string) || 'card';
			const elevation = (args.elevation as string) || 'none';
			const desc = (args.description as string) || '';

			let template = '';
			let sassBlock = '';

			switch (type) {
				case 'card':
					template = `<script lang="ts">
	let { title = 'Card Title', description = '${desc || 'Card summary text'}', children } = $props();
</script>

<article class="card"${elevation !== 'none' ? ' data-elevated' : ''}>
	<div class="row ycenter xbetween">
		<h3 class="text-lg">{title}</h3>
		<span class="badge">Active</span>
	</div>
	<p class="body muted">{description}</p>
	{#if children}
		{@render children()}
	{/if}
</article>

<style lang="sass">
	@use '$lib/styles/fractals' as *
</style>`;
					break;

				case 'panel':
					template = `<script lang="ts">
	let { heading = 'Panel Heading', children } = $props();
</script>

<section class="panel">
	<header class="row ycenter xbetween">
		<h2 class="text-xl">{heading}</h2>
	</header>
	<div class="box gap-s">
		{#if children}
			{@render children()}
		{/if}
	</div>
</section>

<style lang="sass">
	@use '$lib/styles/fractals' as *
</style>`;
					break;

				case 'button':
					template = `<script lang="ts">
	let { variant = 'primary', disabled = false, onclick, children } = $props();
</script>

<button class="button" data-variant={variant} {disabled} {onclick}>
	{#if children}
		{@render children()}
	{:else}
		Action
	{/if}
</button>

<style lang="sass">
	@use '$lib/styles/fractals' as *
</style>`;
					break;

				case 'badge':
					template = `<script lang="ts">
	let { label = 'Badge', variant = 'default' } = $props();
</script>

<span class="badge" data-variant={variant}>
	{label}
</span>

<style lang="sass">
	@use '$lib/styles/fractals' as *
</style>`;
					break;

				default:
					template = `<script lang="ts">
	let { children } = $props();
</script>

<div class="custom-container">
	{#if children}
		{@render children()}
	{/if}
</div>

<style lang="sass">
	@use '$lib/styles/fractals' as *

	.custom-container
		+surface(surface, m, 16)
		+stack(s)
</style>`;
					break;
			}

			return {
				content: [
					{
						type: 'text',
						text: `// Component: ${compName}.svelte\n\n${template}`
					}
				]
			};
		}

		case 'validate_recipe': {
			const code = (args.code as string) || '';
			const diagnostics: Array<{ line?: number; severity: 'error' | 'warning' | 'info'; message: string }> = [];

			const legacyClassPatterns = [
				{ regex: /\bgap\d+\b/g, name: 'gapN (e.g. gap8)', replacement: '.gap-xs / .gap-s or +gap(N)' },
				{ regex: /\bpad\d+\b/g, name: 'padN (e.g. pad16)', replacement: '.pad-s or +pad(N)' },
				{ regex: /\bw100\b/g, name: 'w100', replacement: '.wfull or +w(100%)' },
				{ regex: /\bh100\b/g, name: 'h100', replacement: '.hfull or +h(100%)' },
				{ regex: /\bmin-w-0\b/g, name: 'min-w-0', replacement: '.min0' },
				{ regex: /\bclass="[^"]*\bstack\b[^"]*"/g, name: 'class="stack"', replacement: '+stack() in SASS (no markup class)' },
				{ regex: /\bclass="[^"]*\bcluster\b[^"]*"/g, name: 'class="cluster"', replacement: '+cluster() in SASS (no markup class)' },
				{ regex: /\bclass="[^"]*\bappshell\b[^"]*"/g, name: 'class="appshell"', replacement: '.app-shell' }
			];

			for (const p of legacyClassPatterns) {
				if (p.regex.test(code)) {
					diagnostics.push({
						severity: 'error',
						message: `Found legacy v1 pattern "${p.name}". In fractalstyler2 use: ${p.replacement}.`
					});
				}
			}

			if (/padding:\s*\d+px/i.test(code) || /gap:\s*\d+px/i.test(code)) {
				diagnostics.push({
					severity: 'warning',
					message: 'Hardcoded px values detected in CSS. Prefer token resolvers like +gap(s) or +pad(m).'
				});
			}

			if (code.includes('.is-active') || code.includes('--active')) {
				diagnostics.push({
					severity: 'warning',
					message: 'State expressed as modifier class. In fractalstyler2, state should live on data-* or aria-* attributes (e.g. &[data-active]).'
				});
			}

			if (diagnostics.length === 0) {
				diagnostics.push({
					severity: 'info',
					message: 'Code conforms perfectly to fractalstyler2 design system rules.'
				});
			}

			return {
				content: [{ type: 'text', text: JSON.stringify({ diagnostics, valid: !diagnostics.some((d) => d.severity === 'error') }, null, 2) }]
			};
		}

		case 'list_fractals': {
			const tier = (args.tier as string) || 'all';
			if (tier === 'all') {
				return { content: [{ type: 'text', text: JSON.stringify(FRACTAL_CATALOG, null, 2) }] };
			}
			return {
				content: [{ type: 'text', text: JSON.stringify({ [tier]: (FRACTAL_CATALOG as any)[tier] || [] }, null, 2) }]
			};
		}

		default:
			throw new Error(`Unknown tool: ${name}`);
	}
});

// -----------------------------------------------------------------------------
// LIST RESOURCES
// -----------------------------------------------------------------------------
server.setRequestHandler(ListResourcesRequestSchema, async () => {
	return {
		resources: [
			{
				uri: 'fractalstyler2://tokens',
				name: 'Design Tokens',
				description: 'Live JSON map of all Utopia space scales, fluid typography, radii, shadows, and color roles.',
				mimeType: 'application/json'
			},
			{
				uri: 'fractalstyler2://fractals',
				name: 'Fractal Mixin Catalog',
				description: 'Catalog of atom and molecule mixins, signatures, and descriptions.',
				mimeType: 'application/json'
			},
			{
				uri: 'fractalstyler2://guidelines',
				name: 'Design System Guidelines',
				description: 'Golden rules for AI assistants generating UI with fractalstyler2.',
				mimeType: 'text/markdown'
			}
		]
	};
});

// -----------------------------------------------------------------------------
// READ RESOURCE
// -----------------------------------------------------------------------------
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
	const uri = request.params.uri;

	if (uri === 'fractalstyler2://tokens') {
		return {
			contents: [
				{
					uri,
					mimeType: 'application/json',
					text: JSON.stringify(DESIGN_TOKENS, null, 2)
				}
			]
		};
	}

	if (uri === 'fractalstyler2://fractals') {
		return {
			contents: [
				{
					uri,
					mimeType: 'application/json',
					text: JSON.stringify(FRACTAL_CATALOG, null, 2)
				}
			]
		};
	}

	if (uri === 'fractalstyler2://guidelines') {
		return {
			contents: [
				{
					uri,
					mimeType: 'text/markdown',
					text: GUIDELINES
				}
			]
		};
	}

	throw new Error(`Resource not found: ${uri}`);
});

// -----------------------------------------------------------------------------
// LIST PROMPTS
// -----------------------------------------------------------------------------
server.setRequestHandler(ListPromptsRequestSchema, async () => {
	return {
		prompts: [
			{
				name: 'design_system_review',
				description: 'Audit and refactor a component or screen to follow fractalstyler2 SASS mixin rules.'
			},
			{
				name: 'generate_ui',
				description: 'Generate a complete responsive UI page or component using fractalstyler2 and Svelte 5.'
			}
		]
	};
});

// -----------------------------------------------------------------------------
// GET PROMPT
// -----------------------------------------------------------------------------
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
	const { name } = request.params;

	if (name === 'design_system_review') {
		return {
			description: 'Refactor UI code to fractalstyler2',
			messages: [
				{
					role: 'user',
					content: {
						type: 'text',
						text: `Please review the following code and refactor it into idiomatic fractalstyler2 Svelte 5 + indented SASS (.sass):\n\n${GUIDELINES}`
					}
				}
			]
		};
	}

	if (name === 'generate_ui') {
		return {
			description: 'Generate responsive UI with fractalstyler2',
			messages: [
				{
					role: 'user',
					content: {
						type: 'text',
						text: `Generate a responsive UI component using Svelte 5 runes ($props, $state) and scoped indented SASS with fractal mixins (+surface, +stack, +cluster, +cols). Adhere to the golden rules:\n\n${GUIDELINES}`
					}
				}
			]
		};
	}

	throw new Error(`Prompt not found: ${name}`);
});

// -----------------------------------------------------------------------------
// START SERVER
// -----------------------------------------------------------------------------
async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
}

main().catch((error) => {
	console.error('Fatal MCP server error:', error);
	process.exit(1);
});
