#!/usr/bin/env node
import {
	existsSync,
	mkdirSync,
	readdirSync,
	copyFileSync
} from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

/**
 * Where the scaffoldable partials live.
 *
 * These ARE the published stylesheet — `svelte-package` copies
 * src/lib/styles into dist/styles, so `init` hands over the same files the
 * package imports. There is deliberately no separate templates/ copy to
 * drift out of sync.
 *
 * Resolves for both layouts: dist/cli.js -> dist/styles, and the in-repo
 * src/lib/cli.ts -> src/lib/styles.
 */
function getStylesDir(): string {
	const HERE = dirname(fileURLToPath(import.meta.url));
	const candidates = [
		join(HERE, 'styles'),
		join(HERE, '..', 'styles'),
		join(HERE, '..', 'lib', 'styles')
	];
	for (const candidate of candidates) {
		// index.sass is the marker: an empty or unrelated directory is not it.
		if (existsSync(join(candidate, 'index.sass'))) return candidate;
	}
	throw new Error(
		`fractalstyler2 stylesheet source not found. Searched in:\n  ${candidates.join('\n  ')}`
	);
}

/** The compiled CSS distribution, emitted by scripts/build-css.js at pack time. */
function getCssDir(): string {
	const HERE = dirname(fileURLToPath(import.meta.url));
	const candidates = [join(HERE, 'css'), join(HERE, '..', 'css'), join(HERE, '..', 'dist', 'css')];
	for (const candidate of candidates) {
		if (existsSync(join(candidate, 'fractalstyler.css'))) return candidate;
	}
	throw new Error(
		`fractalstyler2 CSS distribution not found. Searched in:\n  ${candidates.join('\n  ')}\n` +
			`If you are working from a clone, run \`npm run css\` first.`
	);
}

function printUsage(): void {
	console.log(`
fractalstyler2 — composition styling system scaffolder & MCP server

Usage:
  npx fractalstyler2 init [dest] [options]
  npx fractalstyler2 mcp
  npx fractalstyler2 mcp:install
  npx fractalstyler2 mcp:export [dest]

Commands:
  init [dest]         Scaffold the design system into a target directory
                      (default: src/lib/styles)
  mcp                 Start the Model Context Protocol (MCP) server for OpenDesign, Claude, etc.
  mcp:install         Automatically install MCP schemas & config into Antigravity & OpenCode
  mcp:export [dest]   Export static MCP tool schema JSON files to target directory (default: .mcp)

Options:
      --css           Scaffold the compiled stylesheet (no toolchain needed)
      --sass          Scaffold the editable SASS partials (the default)
  -f, --force         Overwrite files if they already exist
  -h, --help          Show this help message

Examples:
  npx fractalstyler2 init
  npx fractalstyler2 init --css
  npx fractalstyler2 init src/styles --css
  npx fractalstyler2 mcp
  npx fractalstyler2 mcp:install
  npx fractalstyler2 mcp:export ~/.gemini/antigravity/mcp/fractalstyler2
`);
}

function init(destArg: string | undefined, force: boolean, flavour: 'sass' | 'css'): void {
	const dest = destArg ?? (flavour === 'css' ? 'src/styles' : 'src/lib/styles');
	const cwd = process.cwd();
	const targetDir = resolve(cwd, dest);

	console.log(`\n▲ fractalstyler2 init\n`);
	console.log(`Scaffolding ${flavour === 'css' ? 'compiled CSS' : 'SASS'} into: ${dest}\n`);

	mkdirSync(targetDir, { recursive: true });

	const stylesDir = flavour === 'css' ? getCssDir() : getStylesDir();
	const files =
		flavour === 'css'
			? ['fractalstyler.css', 'fractalstyler.min.css']
			: readdirSync(stylesDir).filter((f: string) => f.endsWith('.sass'));

	// The L4 shells are only half a definition without their markup, so the
	// contract ships alongside the stylesheet in both flavours.
	const markups = join(getStylesDir(), 'canonical-markups.md');

	let created = 0;
	let overwritten = 0;
	let skipped = 0;

	for (const file of files) {
		const targetFile = join(targetDir, file);
		const relPath = relative(cwd, targetFile);

		if (existsSync(targetFile)) {
			if (force) {
				copyFileSync(join(stylesDir, file), targetFile);
				console.log(`  \x1b[33moverwrite\x1b[0m ${relPath}`);
				overwritten++;
			} else {
				console.log(`  \x1b[90mskip\x1b[0m      ${relPath} (already exists, use --force to overwrite)`);
				skipped++;
			}
		} else {
			copyFileSync(join(stylesDir, file), targetFile);
			console.log(`  \x1b[32mcreate\x1b[0m    ${relPath}`);
			created++;
		}
	}

	if (existsSync(markups)) {
		const target = join(targetDir, 'canonical-markups.md');
		if (!existsSync(target) || force) {
			copyFileSync(markups, target);
			console.log(`  \x1b[32mcreate\x1b[0m    ${relative(cwd, target)}`);
			created++;
		}
	}

	console.log(`\nDone: ${created} created, ${overwritten} overwritten, ${skipped} skipped.\n`);

	if (flavour === 'css') {
		const cssPath = `${dest}/fractalstyler.css`;
		console.log(`Next steps:
  1. Link the stylesheet once, in your document head:
       <link rel="stylesheet" href="/${cssPath}" />

     Or import it, if you have a bundler:
       import '${cssPath}';

  2. Compose in markup. The registry is the API — .box, .row and .grid
     carry most layouts, with .gap-* / .pad-* for space and .surface /
     .border for the dress:
       <div class="row ycenter xbetween gap-sm pad-md surface border">
         <span class="text-md weight-600">Title</span>
         <button class="button primary">Continue</button>
       </div>

  3. Themes and presets need no JavaScript to work:
       <html class="theme-night-dark" data-mode="dark" data-shape="sharp">

     To let people change them at runtime, and to avoid a flash of the
     wrong theme on load:
       import { initPresets, setPreset, getPresetScript } from 'fractalstyler2/presets';

  4. For page and application shells, copy the structures in the scaffolded
     canonical-markups.md verbatim. The responsive behaviour — rails that
     retract, drawers that open — follows from the markup, so an
     approximation of it will not behave.

  5. Before writing any custom CSS, check docs/13-cookbook.md. Nearly every
     common pattern is already composable.
`);
		return;
	}

	const importPath = dest === 'src/lib/styles' ? '$lib/styles/index.sass' : `${dest}/index.sass`;
	const ownPath = dest === 'src/lib/styles' ? '$lib/styles/_08_own.sass' : `${dest}/_08_own.sass`;

	console.log(`Next steps:
  1. Import the stylesheet once globally (e.g. in src/routes/+layout.svelte):
       <script>
         import '${importPath}';
       </script>

  2. Compose in markup. The registry is the API — .box, .row and .grid
     carry most layouts, with .gap-* / .pad-* for space and .surface /
     .border for the dress:
       <div class="row ycenter xbetween gap-sm pad-md surface border">
         <span class="text-md weight-600">Title</span>
         <button class="button primary">Continue</button>
       </div>

  3. Before writing any custom class, check docs/13-cookbook.md — nearly
     every common pattern is already composable. Keep
       ${ownPath}
     for what genuinely is not (third-party widget overrides, mostly).
`);
}

const args = process.argv.slice(2);
const showHelp = args.includes('-h') || args.includes('--help');
const force = args.includes('-f') || args.includes('--force');
const flavour: 'sass' | 'css' = args.includes('--css') ? 'css' : 'sass';
const positional = args.filter((a: string) => !a.startsWith('-'));
const command = positional[0];

const VALID_COMMANDS = ['init', 'mcp', 'mcp:export', 'mcp:install'];

if (showHelp || (command && !VALID_COMMANDS.includes(command))) {
	if (command && !VALID_COMMANDS.includes(command)) {
		console.error(`Unknown command: ${command}`);
	}
	printUsage();
	process.exit(command && !VALID_COMMANDS.includes(command) ? 1 : 0);
} else if (command === 'mcp') {
	import('./mcp/server.js');
} else if (command === 'mcp:export') {
	import('./mcp/export.js').then(({ exportSchemas }) => {
		const dest = positional[1] || '.mcp/fractalstyler2';
		const { created, dir } = exportSchemas(dest);
		console.log(`\n▲ Exported ${created} MCP schema files to: ${dir}\n`);
	});
} else if (command === 'mcp:install') {
	import('./mcp/export.js').then(({ installToAntigravity, installToOpenCode }) => {
		console.log(`\n▲ Installing fractalstyler2 MCP schemas & configuration...\n`);
		try {
			const agy = installToAntigravity();
			console.log(`  \x1b[32m✔\x1b[0m Antigravity MCP schemas: ${agy.dir}`);
		} catch (e: any) {
			console.log(`  \x1b[90m-\x1b[0m Antigravity install skipped (${e.message})`);
		}

		try {
			const oc = installToOpenCode();
			if (oc.success) {
				console.log(`  \x1b[32m✔\x1b[0m OpenCode MCP configured: ${oc.configPath}`);
			} else {
				console.log(`  \x1b[90m-\x1b[0m OpenCode config not found (skipped)`);
			}
		} catch (e: any) {
			console.log(`  \x1b[90m-\x1b[0m OpenCode install skipped (${e.message})`);
		}
		console.log(`\nDone! fractalstyler2 MCP is ready.\n`);
	});
} else if (command === 'init') {
	init(positional[1], force, flavour);
} else {
	// Default to init if no subcommand given (e.g., `npx fractalstyler2`)
	init(positional[0], force, flavour);
}
