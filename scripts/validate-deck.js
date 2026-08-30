#!/usr/bin/env node
/**
 * Surface validator — run by `npm run check`.
 *
 * Two mechanical checks over every surface that describes the system:
 *   1. every class named in copyable markup resolves against registry.json
 *   2. no surface teaches the mixin API that never shipped
 * plus a framing assertion that the system is not described as SASS-only.
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
import { existsSync, readFileSync, readdirSync } from 'node:fs'
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
const walk = (d, exts) => {
	for (const e of readdirSync(d, { withFileTypes: true })) {
		const p = join(d, e.name)
		if (e.isDirectory()) walk(p, exts)
		else if (exts.test(e.name)) files.push(p)
	}
}
walk(join(root, 'skills'), /\.md$/)
walk(join(root, 'docs'), /\.md$/)
walk(join(root, 'src/lib/mcp/schemas'), /\.(json|md)$/)
files.push(join(root, 'src/lib/mcp/server.ts'))
files.push(join(root, 'src/lib/cli.ts'))
files.push(join(root, 'src/lib/index.ts'))
files.push(join(root, 'src/lib/presets.core.ts'))
files.push(join(root, 'README.md'))
files.push(join(root, 'AGENTS.md'))
files.push(join(root, 'src/lib/styles/canonical-markups.md'))

/**
 * The mixin API these surfaces used to teach. It never shipped, and every
 * agent-facing file described it for three releases.
 *
 * The only permitted mentions are the sentences that say it does not exist —
 * there is no migration guide and no legacy to accommodate, so this list is
 * deliberately short. Anything else is a regression.
 */
const PHANTOM_API =
	/(?<![\w\d.])\+(box|row|stack|cluster|surface|gap|pad|px|py|cols|at|frame|reel|cover|with-sidebar|auto-grid|bg|ink|type|weight)\b|(?<![\w.])space\((?:sm?|md?|lg?|xl|[0-9]+)\)|@use\s+['"][^'"]*fractals['"]/
const PHANTOM_OK =
	/do not exist|does not exist|inventing an API|never shipped|earlier versions|without requiring|there is no/

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

files.forEach((file) => {
	const src = readFileSync(file, 'utf8')
	const rel = file.replace(root + '/', '')

	const srcLines = src.split('\n')
	srcLines.forEach((line, i) => {
		// Judge with the neighbouring lines too: the disclaimers wrap.
		const context = [srcLines[i - 1], line, srcLines[i + 1]].filter(Boolean).join(' ')
		if (PHANTOM_API.test(line) && !PHANTOM_OK.test(context)) {
			problems.push(`${rel}:${i + 1}  →  teaches the v1 mixin API: ${line.trim().slice(0, 88)}`)
		}
	})

	// The class check applies to the surfaces that author markup people copy:
	// the cookbook, the canonical shell structures, the skill, the docs. A wrong
	// class there is pasted into a real project. Schemas and server code get the
	// phantom-API check above and nothing more.
	const AUTHORS_MARKUP = /^(docs\/|skills\/|src\/lib\/styles\/canonical-markups\.md)/
	if (!AUTHORS_MARKUP.test(rel)) return

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
})

// ── framing drift ──────────────────────────────────────────────────────────
// The system ships as plain CSS AND as SASS. Surfaces that describe it as a
// SASS system send CSS consumers — most of them — down the wrong path. These
// are the identity strings; if the framing changes again, change them here.
const FRAMING = [
	{ file: 'package.json', key: 'description', mustNot: /\bSASS (styling|design) system\b/i },
	{ file: 'plugin.json', key: 'description', mustNot: /\bSASS (styling|design) system\b/i },
	{ file: 'README.md', key: null, mustNot: /^> \*\*A [^*]*SASS styling system/im },
	{ file: 'AGENTS.md', key: null, mustNot: /Fractalstyler2` — SASS styling system/ }
]

for (const { file, key, mustNot } of FRAMING) {
	const full = join(root, file)
	if (!existsSync(full)) continue
	const raw = readFileSync(full, 'utf8')
	const text = key ? (JSON.parse(raw)[key] ?? '') : raw
	if (mustNot.test(text)) {
		problems.push(`${file}  →  frames the system as SASS-only; it ships as plain CSS too`)
	}
}

const unique = [...new Set(problems)]
if (unique.length) {
	console.error(`\n✕ ${unique.length} problem(s):\n`)
	for (const p of unique) console.error('   ' + p)
	console.error('\nCompose from the registry, or add the class to the system first.\n')
	process.exit(1)
}

console.log(
	`✓ validated ${files.length} files — ${checked} class references, none invented, ` +
		`no phantom API, framing consistent`
)
