#!/usr/bin/env node
/**
 * Deck validator.
 *
 * Every Fractalstyler class named in the orientation must resolve against
 * registry.json. The first draft of this tutorial invented class names that
 * looked plausible and did not exist; this is the mechanical guard against
 * that happening again.
 *
 * A name is allowed if it is EITHER a registry class OR a chrome class the
 * component defines in its own <style> block. That second rule is what keeps
 * the deck's own scoped CSS out of the way without an ignore list to maintain.
 *
 *   node scripts/validate-deck.js
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const registry = JSON.parse(readFileSync(join(root, 'registry.json'), 'utf8'))

const exact = new Set()
const stems = []
for (const entry of registry) {
	// Compound entries (.box.xcenter) contribute every segment.
	for (const seg of entry.class.split('.').filter(Boolean)) {
		if (seg.endsWith('*')) stems.push(seg.slice(0, -1))
		else exact.add(seg)
	}
}

/** State modifiers the registry documents on their parent rather than alone. */
const MODIFIERS = new Set(['open', 'active', 'checked', 'primary', 'ghost', 'is-icon'])

const inRegistry = (c) =>
	exact.has(c) || MODIFIERS.has(c) || stems.some((s) => c.startsWith(s)) || /-(mob|desk)$/.test(c)

const files = []
const walk = (d) => {
	for (const e of readdirSync(d, { withFileTypes: true })) {
		const p = join(d, e.name)
		if (e.isDirectory()) walk(p)
		else if (/\.(svelte|ts)$/.test(e.name)) files.push(p)
	}
}
walk(join(root, 'src/routes/orient/_deck'))

/** Class selectors this file defines for itself, from its own <style> block. */
function chromeOf(src) {
	const style = src.split('<style')[1] ?? ''
	const own = new Set()
	for (const m of style.matchAll(/\.([a-zA-Z][\w-]*)/g)) own.add(m[1])
	return own
}

const CLASS_ATTR = /class(?:Name)?=["'`]([^"'`]*)["'`]/g
const problems = []
let checked = 0

for (const file of files) {
	const src = readFileSync(file, 'utf8')
	const body = src.split('<style')[0]
	const chrome = chromeOf(src)

	CLASS_ATTR.lastIndex = 0
	let m
	while ((m = CLASS_ATTR.exec(body))) {
		// Drop interpolated segments — their domain is already typed in types.ts.
		const literal = m[1].replace(/\{[^}]*\}/g, ' ').replace(/\$\{[^}]*\}/g, ' ')
		for (const raw of literal.split(/\s+/)) {
			if (!raw || !/^[a-zA-Z][\w-]*$/.test(raw)) continue
			checked++
			if (!inRegistry(raw) && !chrome.has(raw)) {
				problems.push(`${file.replace(root + '/', '')}  →  .${raw}`)
			}
		}
	}
}

const unique = [...new Set(problems)]
if (unique.length) {
	console.error(`\n✕ ${unique.length} class name(s) neither in registry.json nor locally defined:\n`)
	for (const p of unique) console.error('   ' + p)
	console.error('\nCompose from the registry, or add the class to the system first.\n')
	process.exit(1)
}

console.log(`✓ deck validated — ${checked} class references, none invented`)
