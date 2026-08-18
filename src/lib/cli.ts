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

function getTemplatesDir(): string {
	const HERE = dirname(fileURLToPath(import.meta.url));
	const candidates = [
		join(HERE, '..', 'templates'),
		join(HERE, '..', '..', 'templates'),
		join(HERE, 'templates')
	];
	for (const candidate of candidates) {
		if (existsSync(candidate)) return candidate;
	}
	throw new Error(`Templates directory not found. Searched in: ${candidates.join(', ')}`);
}

function printUsage(): void {
	console.log(`
fractalstyler2 — SASS fractal design system scaffolder & MCP server

Usage:
  npx fractalstyler2 init [dest] [options]
  npx fractalstyler2 mcp
  npx fractalstyler2 mcp:install
  npx fractalstyler2 mcp:export [dest]

Commands:
  init [dest]         Scaffold SASS partials into target directory (default: src/lib/styles)
  mcp                 Start the Model Context Protocol (MCP) server for OpenDesign, Claude, etc.
  mcp:install         Automatically install MCP schemas & config into Antigravity & OpenCode
  mcp:export [dest]   Export static MCP tool schema JSON files to target directory (default: .mcp)

Options:
  -f, --force         Overwrite files if they already exist
  -h, --help          Show this help message

Examples:
  npx fractalstyler2 init
  npx fractalstyler2 mcp
  npx fractalstyler2 mcp:install
  npx fractalstyler2 mcp:export ~/.gemini/antigravity/mcp/fractalstyler2
`);
}

function init(destArg: string | undefined, force: boolean): void {
	const dest = destArg ?? 'src/lib/styles';
	const cwd = process.cwd();
	const targetDir = resolve(cwd, dest);

	console.log(`\n▲ fractalstyler2 init\n`);
	console.log(`Scaffolding SASS design system into: ${dest}\n`);

	mkdirSync(targetDir, { recursive: true });

	const templatesDir = getTemplatesDir();
	const files = readdirSync(templatesDir).filter((f: string) => f.endsWith('.sass'));

	let created = 0;
	let overwritten = 0;
	let skipped = 0;

	for (const file of files) {
		const targetFile = join(targetDir, file);
		const relPath = relative(cwd, targetFile);

		if (existsSync(targetFile)) {
			if (force) {
				copyFileSync(join(templatesDir, file), targetFile);
				console.log(`  \x1b[33moverwrite\x1b[0m ${relPath}`);
				overwritten++;
			} else {
				console.log(`  \x1b[90mskip\x1b[0m      ${relPath} (already exists, use --force to overwrite)`);
				skipped++;
			}
		} else {
			copyFileSync(join(templatesDir, file), targetFile);
			console.log(`  \x1b[32mcreate\x1b[0m    ${relPath}`);
			created++;
		}
	}

	console.log(`\nDone: ${created} created, ${overwritten} overwritten, ${skipped} skipped.\n`);

	const importPath = dest === 'src/lib/styles' ? '$lib/styles/index.sass' : `${dest}/index.sass`;
	const fractalsPath = dest === 'src/lib/styles' ? '$lib/styles/fractals' : `${dest}/fractals`;

	console.log(`Next steps:
  1. Import the stylesheet once globally (e.g. in src/routes/+layout.svelte):
       <script>
         import '${importPath}';
       </script>

  2. Compose your components with fractal mixins:
       <style lang="sass">
         @use '${fractalsPath}' as *

         .card
           +surface(surface, s, 6)
           +stack(s)
       </style>
`);
}

const args = process.argv.slice(2);
const showHelp = args.includes('-h') || args.includes('--help');
const force = args.includes('-f') || args.includes('--force');
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
	init(positional[1], force);
} else {
	// Default to init if no subcommand given (e.g., `npx fractalstyler2`)
	init(positional[0], force);
}
