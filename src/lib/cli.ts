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
fractalstyler2 — SASS fractal design system scaffolder

Usage:
  npx fractalstyler2 init [dest] [options]

Arguments:
  dest          Target directory for SASS partials (default: src/lib/styles)

Options:
  -f, --force   Overwrite files if they already exist
  -h, --help    Show this help message

Examples:
  npx fractalstyler2 init
  npx fractalstyler2 init src/lib/styles --force
  npx fractalstyler2 init src/styles
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
           +surface(surface, s, 12)
           +stack(s)
       </style>
`);
}

const args = process.argv.slice(2);
const showHelp = args.includes('-h') || args.includes('--help');
const force = args.includes('-f') || args.includes('--force');
const positional = args.filter((a: string) => !a.startsWith('-'));
const command = positional[0];

if (showHelp || (command && command !== 'init')) {
	if (command && command !== 'init') {
		console.error(`Unknown command: ${command}`);
	}
	printUsage();
	process.exit(command && command !== 'init' ? 1 : 0);
} else if (command === 'init') {
	init(positional[1], force);
} else {
	// Default to init if no subcommand given (e.g., `npx fractalstyler2`)
	init(positional[0], force);
}
