#!/usr/bin/env node
/**
 * fractalstyler2 MCP Server
 * Model Context Protocol server exposing design tokens, the class registry,
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

const VERSION: string = (() => {
	// Read from package.json so this can never drift from the published version.
	const HERE = dirname(fileURLToPath(import.meta.url));
	for (const c of [join(HERE, '..', '..', 'package.json'), join(HERE, '..', 'package.json')]) {
		try {
			if (existsSync(c)) return JSON.parse(readFileSync(c, 'utf8')).version as string;
		} catch {
			/* fall through */
		}
	}
	return '0.0.0';
})();

// Resolve styles directory for SASS compiler loadPaths
function getStylesDir(): string {
	const HERE = dirname(fileURLToPath(import.meta.url));
	const candidates = [
		join(HERE, '..', 'styles'), // dist/mcp -> dist/styles
		join(HERE, 'styles'),
		join(process.cwd(), 'src', 'lib', 'styles')
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
		scale: ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
		clamp: {
			'3xs': 'clamp(0.3125rem, 0.3125rem + 0vw, 0.3125rem)', // ~5px
			'2xs': 'clamp(0.5625rem, 0.5369rem + 0.1136vw, 0.625rem)', // ~9-10px
			xs: 'clamp(0.875rem, 0.8494rem + 0.1136vw, 0.9375rem)', // ~14-15px
			sm: 'clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem)', // ~18-20px
			md: 'clamp(1.6875rem, 1.6108rem + 0.3409vw, 1.875rem)', // ~27-30px
			lg: 'clamp(2.25rem, 2.1477rem + 0.4545vw, 2.5rem)', // ~36-40px
			xl: 'clamp(3.375rem, 3.2216rem + 0.6818vw, 3.75rem)', // ~54-60px
			'2xl': 'clamp(4.5rem, 4.2955rem + 0.9091vw, 5rem)', // ~72-80px
			'3xl': 'clamp(6.75rem, 6.4432rem + 1.3636vw, 7.5rem)' // ~108-120px
		},
		approxPx: {
			'3xs': 5,
			'2xs': 9,
			xs: 14,
			sm: 18,
			md: 28,
			lg: 38,
			xl: 56,
			'2xl': 76,
			'3xl': 114
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
	status: {
		success: 'var(--success)',
		successHover: 'var(--success-hover)',
		warning: 'var(--warning)',
		warningHover: 'var(--warning-hover)',
		danger: 'var(--danger)',
		dangerHover: 'var(--danger-hover)',
		info: 'var(--info)',
		infoHover: 'var(--info-hover)',
		feedbackError: 'var(--feedback-error)'
	},
	brand: {
		theme: 'var(--theme-color)',
		themeHover: 'var(--theme-color-alt)',
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
/**
 * The class registry — the public API — read from registry.json.
 *
 * This was previously a hardcoded catalog of authoring mixins (+box, +stack,
 * +surface...). Those never shipped in v2; the registry replaced them. It is
 * loaded from the generated file now so this surface cannot describe an API
 * the stylesheet does not have.
 */
function getRegistryPath(): string | null {
	const HERE = dirname(fileURLToPath(import.meta.url));
	const candidates = [
		join(HERE, '..', '..', 'registry.json'), // dist/mcp -> package root
		join(HERE, '..', 'registry.json'),
		join(process.cwd(), 'registry.json')
	];
	return candidates.find((c) => existsSync(c)) ?? null;
}

interface RegistryEntry {
	class: string;
	layer: string;
	property: string;
	file: string;
	description: string;
	example: string;
}

const REGISTRY: RegistryEntry[] = (() => {
	const p = getRegistryPath();
	if (!p) return [];
	try {
		return JSON.parse(readFileSync(p, 'utf8')) as RegistryEntry[];
	} catch {
		return [];
	}
})();

const LAYER_NAMES: Record<string, string> = {
	L0: 'Tokens',
	L1: 'Dimensions',
	L2: 'Containers',
	L3: 'Layouts',
	L4: 'Shells',
	L5: 'Visuals & Interactions'
};

/** Registry grouped by layer, which is what list_fractals serves. */
const FRACTAL_CATALOG: Record<string, RegistryEntry[]> = REGISTRY.reduce(
	(acc, entry) => {
		(acc[entry.layer] ??= []).push(entry);
		return acc;
	},
	{} as Record<string, RegistryEntry[]>
);

// Guidelines & Golden Rules
const GUIDELINES = `
# fractalstyler2 Design System Rules

1. Never hardcode a value that a token covers: reach for .gap-sm, .radius-md, .surface. Literals like .gap-16 are the sanctioned escape hatch when an exact pixel is load-bearing.
2. Classes are the ONLY public API (.gap-sm, .pad-x-sm, .box.xcenter, .button.primary). The system defines no authoring mixins and no SASS functions; +stack, +surface, space() and the like do not exist.
3. Visual toggles ride classes (.open, .active, .elevated); semantic state stays on native attributes ([disabled], [aria-expanded='true'], :focus-visible).
4. Do NOT invent class names. A composed string like class="row ycenter xbetween gap-sm pad-md surface border" is the finished state, not something to tidy into a semantic class. _08_own.sass is for third-party widget overrides only; check docs/13-cookbook.md before writing any custom declaration.
5. Mobile-first: define base classes first, then bind to a side of the 768px seam with the -mob / -desk suffixes (.pad-xs-mob .pad-lg-desk). Grids step on their own; .grid-6 goes 6 -> 3 -> 2 -> 1 and never strands a row.
6. Literal utilities come from a discrete ladder, not any integer: 0, 1, 2, 4, 6, 8, 12, then every multiple of 8 — to 64px for gap/pad/marg and radius, to 512px for w/h/square (.gap-16, .radius-4, .w-240). Negative margins use the -- infix (.marg--16).
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
				description: 'Compiles indented SASS into CSS to verify output. The system exposes no authoring mixins — compose in markup and use this for the rare custom declaration.',
				inputSchema: {
					type: 'object',
					properties: {
						sassCode: {
							type: 'string',
							description: 'Indented SASS code (plain declarations; the styles directory is on the load path).'
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
				description: 'Converts raw CSS declarations (from Figma/OpenDesign inspection) into fractalstyler2 registry classes, composed in markup.',
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
				description: 'Generates a production-ready Svelte 5 component with runes, composed entirely from registry classes and carrying no style block.',
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
				description: 'Lints markup against the golden rules: flags class names absent from the registry, component <style> blocks, and hardcoded pixel values.',
				inputSchema: {
					type: 'object',
					properties: {
						code: { type: 'string', description: 'The Svelte or HTML markup to validate.' }
					},
					required: ['code']
				}
			},
			{
				name: 'list_fractals',
				description:
					'Returns the class registry — the public API. Every composable class with the CSS it applies and its source file, grouped by layer. Query this before naming any class.',
				inputSchema: {
					type: 'object',
					properties: {
						layer: {
							type: 'string',
							enum: ['all', 'L0', 'L1', 'L2', 'L3', 'L4', 'L5'],
							description:
								'Filter by layer: L0 tokens, L1 dimensions, L2 containers, L3 layouts, L4 shells, L5 visuals & interactions.'
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

			// No @use is injected: the system exposes no mixin module to import.
			// loadPaths is set to the styles directory, so a caller that wants
			// the token layer can `@use '00_tokens'` explicitly.
			const fullSass = `.${className}
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
					utilityClass: `.gap-${match.token}`
				};
			}

			if (typeof args.padding === 'number') {
				const match = findNearestToken(args.padding, DESIGN_TOKENS.space.approxPx);
				results.padding = {
					inputPx: args.padding,
					nearestToken: match.token,
					cssVar: `var(--space-${match.token})`,
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
					utilityClass: `.radius-${match.token}`
				};
			}

			if (typeof args.fontSize === 'number') {
				const match = findNearestToken(args.fontSize, DESIGN_TOKENS.typography.approxPx);
				results.fontSize = {
					inputPx: args.fontSize,
					nearestToken: match.token,
					cssVar: `var(--text-${match.token})`,
					utilityClass: `.text-${match.token}`
				};
			}

			return {
				content: [{ type: 'text', text: JSON.stringify(results, null, 2) }]
			};
		}

		case 'css_to_fractals': {
			// Emits registry CLASSES, not mixins. The system has no authoring
			// mixins; earlier versions of this tool suggested +surface/+stack,
			// which do not compile.
			const rawCss = (args.css as string) || '';
			const decls = rawCss
				.split(/[;\n]/)
				.map((l) => l.trim())
				.filter(Boolean);

			const classes: string[] = [];
			const unmapped: string[] = [];
			let display: string | null = null;
			let direction: string | null = null;

			const spaceStep = (n: number): string => findNearestToken(n, DESIGN_TOKENS.space.approxPx).token;
			const px = (v: string): number | null => {
				const n = parseInt(v, 10);
				return isNaN(n) ? null : n;
			};

			for (const decl of decls) {
				const idx = decl.indexOf(':');
				if (idx < 0) continue;
				const prop = decl.slice(0, idx).trim();
				const val = decl.slice(idx + 1).trim();
				const n = px(val);

				switch (prop) {
					case 'display':
						display = val;
						break;
					case 'flex-direction':
						direction = val;
						break;
					case 'gap':
						if (n !== null) classes.push(`gap-${spaceStep(n)}`);
						break;
					case 'row-gap':
						if (n !== null) classes.push(`rgap-${spaceStep(n)}`);
						break;
					case 'column-gap':
						if (n !== null) classes.push(`cgap-${spaceStep(n)}`);
						break;
					case 'padding':
						if (n !== null) classes.push(`pad-${spaceStep(n)}`);
						break;
					case 'padding-inline':
						if (n !== null) classes.push(`pad-x-${spaceStep(n)}`);
						break;
					case 'padding-block':
						if (n !== null) classes.push(`pad-y-${spaceStep(n)}`);
						break;
					case 'margin':
						if (n !== null) classes.push(`marg-${spaceStep(n)}`);
						break;
					case 'border-radius':
						if (n !== null) classes.push(`radius-${n}`);
						break;
					case 'width':
						if (val === '100%') classes.push('wfull');
						else if (n !== null) classes.push(`w-${n}`);
						break;
					case 'height':
						if (val === '100%') classes.push('hfull');
						else if (n !== null) classes.push(`h-${n}`);
						break;
					case 'background':
					case 'background-color':
						if (val.includes('raised')) classes.push('raised');
						else if (val.includes('panel')) classes.push('panel');
						else if (val.includes('surface') || /^#(fff|ffffff)$/i.test(val)) classes.push('surface');
						else unmapped.push(`${prop}: ${val}`);
						break;
					case 'color':
						if (val.includes('muted')) classes.push('text-muted');
						else if (val.includes('secondary')) classes.push('text-secondary');
						else if (val.includes('primary')) classes.push('text-primary');
						else unmapped.push(`${prop}: ${val}`);
						break;
					case 'border':
						classes.push('border');
						break;
					case 'border-bottom':
						classes.push('border-bottom');
						break;
					case 'border-top':
						classes.push('border-top');
						break;
					case 'box-shadow': {
						// Depth is a three-step scale; pick by the blur radius.
						const blur = parseInt(val.split(/\s+/)[3] ?? '0', 10);
						classes.push(blur >= 24 ? 'shadow-lg' : blur >= 8 ? 'shadow-md' : 'shadow-sm');
						break;
					}
					case 'flex-wrap':
						if (val === 'wrap') classes.push('wrap');
						break;
					case 'flex-grow':
						if (val !== '0') classes.push('grow');
						break;
					case 'flex-shrink':
						if (val === '0') classes.push('shrink-0');
						break;
					case 'min-width':
					case 'min-height':
						if (val === '0') classes.push('min0');
						break;
					case 'position':
						if (['relative', 'absolute', 'fixed', 'sticky'].includes(val)) classes.push(val);
						break;
					case 'text-overflow':
						if (val === 'ellipsis') classes.push('truncate');
						break;
					case 'font-weight':
						if (['400', '500', '600', '700'].includes(val)) classes.push(`weight-${val}`);
						else unmapped.push(`${prop}: ${val}`);
						break;
					case 'justify-content':
					case 'align-items':
						// resolved below, once the container is known
						unmapped.push(`${prop}: ${val}`);
						break;
					default:
						unmapped.push(`${prop}: ${val}`);
				}
			}

			// Container first, so alignment can be named on the physical axis.
			const container =
				display === 'grid' ? 'grid' : display === 'flex' ? (direction === 'row' ? 'row' : 'box') : null;
			if (container) classes.unshift(container);

			const ALIGN: Record<string, string> = {
				'flex-start': 'left',
				start: 'left',
				center: 'center',
				'flex-end': 'right',
				end: 'right',
				'space-between': 'between',
				'space-evenly': 'evenly',
				'space-around': 'around'
			};
			const resolved: string[] = [];
			for (const u of unmapped.slice()) {
				const m = /^(justify-content|align-items):\s*(.+)$/.exec(u);
				if (!m || !container) continue;
				const word = ALIGN[m[2]];
				if (!word) continue;
				// In a row, justify-content is the X axis; in a column it is Y.
				const isX = container === 'row' ? m[1] === 'justify-content' : m[1] === 'align-items';
				resolved.push(`${isX ? 'x' : 'y'}${word === 'left' && !isX ? 'top' : word === 'right' && !isX ? 'bot' : word}`);
				unmapped.splice(unmapped.indexOf(u), 1);
			}
			classes.push(...resolved);

			const attr = classes.length ? `<div class="${classes.join(' ')}">` : '';
			let text = classes.length
				? `Compose in markup:\n\n${attr}`
				: 'No registry class matched. Check list_fractals for the full API.';

			if (unmapped.length) {
				text +=
					`\n\nNot covered by the registry:\n` +
					unmapped.map((u) => `  ${u}`).join('\n') +
					`\n\nThese are candidates for a component <style> block or _08_own.sass — ` +
					`but check docs/13-cookbook.md first; most patterns compose.`;
			}

			return { content: [{ type: 'text', text }] };
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

<article class="card box gap-sm pad-md surface border"${elevation !== 'none' ? ' data-elevated' : ''}>
	<div class="row ycenter xbetween gap-sm">
		<h3 class="text-lg weight-600 m-0">{title}</h3>
		<span class="badge">Active</span>
	</div>
	<p class="text-sm text-secondary">{description}</p>
	{#if children}
		{@render children()}
	{/if}
</article>
`;
					break;

				case 'panel':
					template = `<script lang="ts">
	let { heading = 'Panel Heading', children } = $props();
</script>

<section class="panel box gap-md pad-md">
	<header class="row ycenter xbetween gap-sm">
		<h2 class="text-xl weight-600 m-0">{heading}</h2>
	</header>
	<div class="box gap-sm">
		{#if children}
			{@render children()}
		{/if}
	</div>
</section>
`;
					break;

				case 'button':
					template = `<script lang="ts">
	let { variant = 'primary', disabled = false, onclick, children } = $props();
</script>

<button class="button {variant}" {disabled} {onclick}>
	{#if children}
		{@render children()}
	{:else}
		Action
	{/if}
</button>
`;
					break;

				case 'badge':
					template = `<script lang="ts">
	let { label = 'Badge', variant = 'default' } = $props();
</script>

<span class="badge" data-status={variant}>
	{label}
</span>
`;
					break;

				default:
					template = `<script lang="ts">
	let { children } = $props();
</script>

<div class="box gap-sm pad-md surface border radius-md">
	{#if children}
		{@render children()}
	{/if}
</div>`;
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

			// The failure mode worth catching is an invented class, not a legacy one.
			const INVENTED = /class="([^"]*)"/g
			let m: RegExpExecArray | null
			while ((m = INVENTED.exec(code)) !== null) {
				for (const cls of m[1].split(/\s+/).filter(Boolean)) {
					if (cls.includes('{') || cls.includes('$')) continue;
					const known =
						REGISTRY.some((e) => e.class.split('.').filter(Boolean).includes(cls)) ||
						/^(gap|rgap|cgap|pad|marg|radius|w|h|square|text|weight|clamp|grid|frame)-/.test(cls) ||
						['open', 'active', 'checked', 'primary', 'ghost', 'is-icon'].includes(cls);
					if (!known) {
						diagnostics.push({
							severity: 'error',
							message: `Unknown class ".${cls}". It is not in the registry. Compose from existing classes — call list_fractals — or check docs/13-cookbook.md for the pattern you are building.`
						});
					}
				}
			}

			if (/<style/.test(code)) {
				diagnostics.push({
					severity: 'error',
					message:
						'Component <style> block found. Compose in markup instead; the registry covers nearly every pattern (docs/13-cookbook.md).'
				});
			}

			if (/padding:\s*\d+px/i.test(code) || /gap:\s*\d+px/i.test(code)) {
				diagnostics.push({
					severity: 'warning',
					message: 'Hardcoded px values in CSS. Compose .gap-sm / .pad-md in the markup instead — or a literal .gap-18 if the exact value is load-bearing.'
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
			const layer = (args.layer as string) || 'all';
			if (REGISTRY.length === 0) {
				throw new Error(
					'Class registry not found. registry.json ships with the package; run `npm run registry` if working from source.'
				);
			}
			const payload =
				layer === 'all' ? FRACTAL_CATALOG : { [layer]: FRACTAL_CATALOG[layer] ?? [] };
			return { content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }] };
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
				name: 'Class Registry',
				description: 'The public API: every composable class, grouped by layer L0-L5, with the CSS it applies and its source file.',
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
				description: 'Audit and refactor a component or screen to compose from the fractalstyler2 class registry.'
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
						text: `Review the following code and refactor it to compose from the fractalstyler2 class registry in the markup. Remove stylesheet declarations the registry already covers; do not introduce new class names. Call list_fractals if unsure of a class:\n\n${GUIDELINES}`
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
						text: `Generate a responsive UI component using Svelte 5 runes ($props, $state), composed entirely from fractalstyler2 registry classes in the markup. Do not write a style block and do not invent class names — call list_fractals if unsure. Adhere to the golden rules:\n\n${GUIDELINES}`
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
