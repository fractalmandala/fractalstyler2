#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const stylesDir = path.join(rootDir, 'src', 'lib', 'styles');

/**
 * Parser for SASS files to extract classes, variables, and documentation
 */
function extractStylesData() {
	const registry = [];
	const tokens = [];

	const files = [
		{ file: '_00_tokens.sass', layer: 'L0' },
		{ file: '_01_config.sass', layer: 'L0' },
		{ file: '_02_dimensions.sass', layer: 'L1' },
		{ file: '_03_containers.sass', layer: 'L2' },
		{ file: '_04_layouts.sass', layer: 'L3' },
		{ file: '_05_shells.sass', layer: 'L4' },
		{ file: '_06_visuals.sass', layer: 'L5' },
		{ file: '_07_interactions.sass', layer: 'L5' },
		{ file: '_08_own.sass', layer: 'Custom' }
	];

	// Extract tokens from _00_tokens.sass
	const tokensFile = path.join(stylesDir, '_00_tokens.sass');
	if (fs.existsSync(tokensFile)) {
		const content = fs.readFileSync(tokensFile, 'utf8');
		const varRegex = /(--[a-zA-Z0-9_-]+):\s*([^;\n\r]+)/g;
		let match;
		const seenVars = new Set();
		while ((match = varRegex.exec(content)) !== null) {
			const varName = match[1];
			const val = match[2].trim();
			if (!seenVars.has(varName)) {
				seenVars.add(varName);
				tokens.push({ name: varName, value: val });
			}
		}
	}

	// Helper to add registry entry
	const addEntry = (cls, layer, prop, file, desc, example) => {
		registry.push({
			class: cls,
			layer,
			property: prop,
			file,
			description: desc,
			example: example || `<div class="${cls.replace('.', '')}">`
		});
	};

	// Parse dimensions
	addEntry('.gap-*', 'L1', 'gap: calc(var(--space-*) * var(--gap-scale)) | {N}px', '_02_dimensions.sass', 'Flex and grid gap spacing (presets: 3xs..3xl, literals: 1..256)');
	addEntry('.rgap-*', 'L1', 'row-gap: calc(var(--space-*) * var(--gap-scale)) | {N}px', '_02_dimensions.sass', 'Row gap spacing');
	addEntry('.cgap-*', 'L1', 'column-gap: calc(var(--space-*) * var(--gap-scale)) | {N}px', '_02_dimensions.sass', 'Column gap spacing');
	addEntry('.pad-*', 'L1', 'padding: calc(var(--space-*) * var(--pad-scale)) | {N}px', '_02_dimensions.sass', 'Padding on all sides');
	addEntry('.pad-x-*', 'L1', 'padding-inline: calc(var(--space-*) * var(--pad-scale)) | {N}px', '_02_dimensions.sass', 'Horizontal inline padding');
	addEntry('.pad-y-*', 'L1', 'padding-block: calc(var(--space-*) * var(--pad-scale)) | {N}px', '_02_dimensions.sass', 'Vertical block padding');
	addEntry('.pad-top-*', 'L1', 'padding-top: calc(var(--space-*) * var(--pad-scale)) | {N}px', '_02_dimensions.sass', 'Top padding');
	addEntry('.pad-right-*', 'L1', 'padding-right: calc(var(--space-*) * var(--pad-scale)) | {N}px', '_02_dimensions.sass', 'Right padding');
	addEntry('.pad-bottom-*', 'L1', 'padding-bottom: calc(var(--space-*) * var(--pad-scale)) | {N}px', '_02_dimensions.sass', 'Bottom padding');
	addEntry('.pad-left-*', 'L1', 'padding-left: calc(var(--space-*) * var(--pad-scale)) | {N}px', '_02_dimensions.sass', 'Left padding');
	addEntry('.marg-*', 'L1', 'margin: calc(var(--space-*) * var(--gap-scale)) | {N}px', '_02_dimensions.sass', 'Margin on all sides');
	addEntry('.marg--*', 'L1', 'margin: calc(var(--space-*) * var(--gap-scale) * -1) | -{N}px', '_02_dimensions.sass', 'Negative margin on all sides');
	addEntry('.marg-x-*', 'L1', 'margin-inline: calc(var(--space-*) * var(--gap-scale)) | {N}px', '_02_dimensions.sass', 'Horizontal inline margin');
	addEntry('.marg-y-*', 'L1', 'margin-block: calc(var(--space-*) * var(--gap-scale)) | {N}px', '_02_dimensions.sass', 'Vertical block margin');
	addEntry('.marg-top-*', 'L1', 'margin-top: calc(var(--space-*) * var(--gap-scale)) | {N}px', '_02_dimensions.sass', 'Top margin');
	addEntry('.marg-top--*', 'L1', 'margin-top: calc(var(--space-*) * var(--gap-scale) * -1) | -{N}px', '_02_dimensions.sass', 'Negative top margin');
	addEntry('.marg-bottom-*', 'L1', 'margin-bottom: calc(var(--space-*) * var(--gap-scale)) | {N}px', '_02_dimensions.sass', 'Bottom margin');
	addEntry('.marg-bottom--*', 'L1', 'margin-bottom: calc(var(--space-*) * var(--gap-scale) * -1) | -{N}px', '_02_dimensions.sass', 'Negative bottom margin');
	addEntry('.marg-left-*', 'L1', 'margin-left: calc(var(--space-*) * var(--gap-scale)) | {N}px', '_02_dimensions.sass', 'Left margin');
	addEntry('.marg-right-*', 'L1', 'margin-right: calc(var(--space-*) * var(--gap-scale)) | {N}px', '_02_dimensions.sass', 'Right margin');
	addEntry('.radius-*', 'L1', 'border-radius: {N}px', '_02_dimensions.sass', 'Corner border radius (0..256)');
	addEntry('.radius-full', 'L1', 'border-radius: var(--radius-full)', '_02_dimensions.sass', 'Circular border radius (9999px)');
	addEntry('.w-*', 'L1', 'width: {N}px', '_02_dimensions.sass', 'Width in pixels (1..256)');
	addEntry('.h-*', 'L1', 'height: {N}px', '_02_dimensions.sass', 'Height in pixels (1..256)');
	addEntry('.square-*', 'L1', 'width: {N}px; height: {N}px', '_02_dimensions.sass', 'Square dimensions in pixels (1..256)');
	addEntry('.min0', 'L1', 'min-width: 0; min-height: 0', '_02_dimensions.sass', 'Zero min bounds to prevent flex blowouts');
	addEntry('.wfull', 'L1', 'width: 100%', '_02_dimensions.sass', '100% full width');
	addEntry('.hfull', 'L1', 'height: 100%', '_02_dimensions.sass', '100% full height');
	addEntry('.full', 'L1', 'width: 100%; height: 100%', '_02_dimensions.sass', '100% width and height');
	addEntry('.hfull-vh', 'L1', 'min-height: 100vh', '_02_dimensions.sass', 'Full viewport height');
	addEntry('.hfull-vh-fitted', 'L1', 'min-height: calc(100vh - var(--header-height) - var(--footer-height))', '_02_dimensions.sass', 'Viewport height fitted between header and footer');

	// Parse explicit classes from remaining files
	for (const { file, layer } of files.slice(3)) {
		const filePath = path.join(stylesDir, file);
		if (!fs.existsSync(filePath)) continue;

		const content = fs.readFileSync(filePath, 'utf8');
		const lines = content.split('\n');
		let currentParent = null;

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const trimmed = line.trim();

			// Top level class
			if (line.startsWith('.') && !line.startsWith('..')) {
				const match = line.match(/^(\.[a-zA-Z0-9_-]+)/);
				if (match) {
					currentParent = match[1];
					const desc = trimmed.replace(currentParent, '').trim();
					addEntry(currentParent, layer, '', file, desc || `${currentParent} component / container`);
				}
			}
			// Nested selector under parent
			else if (line.startsWith('\t&.') || line.startsWith('  &.')) {
				const match = line.match(/&(\.[a-zA-Z0-9_-]+)/);
				if (match && currentParent) {
					const subClass = `${currentParent}${match[1]}`;
					const desc = trimmed.replace(/^&\.[a-zA-Z0-9_-]+/, '').trim();
					addEntry(subClass, layer, '', file, desc || `Modifier for ${currentParent}`);
				}
			}
		}
	}

	return { registry, tokens };
}

/**
 * Generate Markdown Registry
 */
function generateMarkdownRegistry(registry, tokens) {
	let md = `# Fractalstyler2 — Complete Class & Token Registry\n\n`;
	md += `Status: **LOCKED & CANONICAL**  \n`;
	md += `Updated: **${new Date().toISOString().split('T')[0]}**  \n`;
	md += `Architecture: **L0 (Tokens) $\\rightarrow$ L1 (Dimensions) $\\rightarrow$ L2 (Containers) $\\rightarrow$ L3 (Layouts) $\\rightarrow$ L4 (Shells) $\\rightarrow$ L5 (Visuals & Interactions)**\n\n`;
	md += `This document is the **single, definitive, grepable master registry** for all CSS classes, tokens, modifiers, and canonical markup structures in \`fractalstyler2\`.\n\n`;
	md += `---\n\n## Quick Grep Cheatsheet\n\n`;
	md += `Format: \`CLASS_NAME | LAYER | CSS PROPERTY / BEHAVIOR | FILE SOURCE | EXAMPLE\`\n\n\`\`\`\n`;

	for (const item of registry) {
		const clsPad = item.class.padEnd(24, ' ');
		const layerPad = item.layer.padEnd(2, ' ');
		const propPad = (item.property || item.description).padEnd(58, ' ');
		const filePad = item.file.padEnd(22, ' ');
		md += `${clsPad} | ${layerPad} | ${propPad} | ${filePad} | ${item.example}\n`;
	}

	md += `\`\`\`\n\n---\n\n## Semantic Token Variables\n\n\`\`\`css\n:root {\n`;
	for (const token of tokens) {
		md += `  ${token.name}: ${token.value};\n`;
	}
	md += `}\n\`\`\`\n`;

	return md;
}

// Execute Generation
const { registry, tokens } = extractStylesData();
const mdContent = generateMarkdownRegistry(registry, tokens);

fs.writeFileSync(path.join(rootDir, 'REGISTRY.md'), mdContent, 'utf8');
fs.writeFileSync(path.join(rootDir, 'docs', 'REGISTRY.md'), `---\nid: registry-master\ntitle: Master Class & Token Registry\ntype: design\ntags: [registry, classes, tokens, grep, reference, complete]\nsummary: The complete, grepable master registry of all CSS classes, tokens, modifiers, and canonical markup structures in Fractalstyler2.\nupdated: ${new Date().toISOString().split('T')[0]}\n---\n\n# Master Class & Token Registry\n\nThis document is mirrored from [\`REGISTRY.md\`](../REGISTRY.md) at the repository root.\n\nPlease refer to [**\`../REGISTRY.md\`**](../REGISTRY.md) for the single, definitive, grepable master registry.\n`, 'utf8');
fs.writeFileSync(path.join(rootDir, 'registry.json'), JSON.stringify(registry, null, 2), 'utf8');

console.log(`✔ Registry updated successfully: ${registry.length} classes indexed across ${tokens.length} tokens.`);
