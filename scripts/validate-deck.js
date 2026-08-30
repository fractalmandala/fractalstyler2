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
import * as sass from 'sass'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const registry = JSON.parse(readFileSync(join(root, 'registry.json'), 'utf8'))

// Ground truth is the COMPILED stylesheet, not registry.json. The registry
// carries wildcard families (.radius-*), and matching on those stems accepted
// .radius-md — a class that does not exist — everywhere it appeared. A wildcard
// cannot tell you whether a value is on the ladder; only the output can.
const compiled = sass.compile(join(root, 'src/lib/styles/index.sass'), { style: 'expanded' }).css
const exact = new Set([...compiled.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]))
const stems = []

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
// The shell components emit canonical markup, so every class in them must
// resolve — they are the one place a wrong class ships as code, not prose.
walk(join(root, 'src/lib/components'), /\.svelte$/)
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
	const AUTHORS_MARKUP = /^(docs\/|skills\/|src\/lib\/components\/|src\/lib\/styles\/canonical-markups\.md)/
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

// ── links, anchors and file references ─────────────────────────────────────
// A broken cross-reference sat on line 6 of the first document through two
// sweeps, because nothing here looked at links. Now it does.
const LINK = /\[([^\]]*)\]\(([^)]+)\)/g
// GitHub's slugger: lowercase, strip punctuation, then every remaining space
// becomes a hyphen — runs are NOT collapsed, so "Rules & UI" -> "rules--ui".
const slug = (h) =>
	h
		.toLowerCase()
		.replace(/`/g, '')
		.replace(/[^a-z0-9 -]/g, '')
		.trim()
		.replace(/ /g, '-')

for (const file of files.filter((f) => f.endsWith('.md'))) {
	const rel = file.replace(root + '/', '')
	const dir = file.slice(0, file.lastIndexOf('/'))
	const text = readFileSync(file, 'utf8')
	const lines = text.split('\n')
	const ownHeadings = new Set([...text.matchAll(/^#{1,6}\s+(.*)$/gm)].map((m) => slug(m[1])))

	lines.forEach((line, i) => {
		LINK.lastIndex = 0
		let m
		while ((m = LINK.exec(line))) {
			const href = m[2]
			if (/^(https?:|mailto:)/.test(href)) continue
			const [path, frag] = href.split('#')
			if (path) {
				const target = join(dir, path)
				if (!existsSync(target)) {
					problems.push(`${rel}:${i + 1}  →  broken link: ${href}`)
					continue
				}
				if (frag && target.endsWith('.md')) {
					const heads = new Set(
						[...readFileSync(target, 'utf8').matchAll(/^#{1,6}\s+(.*)$/gm)].map((h) => slug(h[1]))
					)
					if (!heads.has(frag)) problems.push(`${rel}:${i + 1}  →  broken anchor: ${href}`)
				}
			} else if (frag && !ownHeadings.has(frag)) {
				problems.push(`${rel}:${i + 1}  →  broken anchor: #${frag}`)
			}
		}
	})
}

// ── the child combinator ───────────────────────────────────────────────────
// Opinion #1 in docs/01-introduction.md: styling syntax should avoid `> *` and
// friends. The rule has been stated since the beginning and violated
// continuously, because nothing checked it. Now something does.
//
// Exactly one exception, matched literally: the scroll-snap rail, where snap
// targets must be the rail's own children or the rail catches in the wrong
// places. A second exception should be a deliberate edit here, not a drift.
const COMBINATOR_ALLOWED = new Set(['_04_layouts.sass:\t> *'])

for (const file of readdirSync(join(root, 'src/lib/styles')).filter((f) => f.endsWith('.sass'))) {
	const lines = readFileSync(join(root, 'src/lib/styles', file), 'utf8').split('\n')
	lines.forEach((line, i) => {
		const code = line.split('//')[0]
		if (!code.includes('>')) return
		// interpolations and media queries legitimately carry > inside #{...}
		if (/#\{[^}]*>[^}]*\}/.test(code)) return
		if (COMBINATOR_ALLOWED.has(`${file}:${code.replace(/\s+$/, '')}`)) return
		problems.push(
			`src/lib/styles/${file}:${i + 1}  →  child combinator \`>\` — opinion #1 forbids it: ${code.trim()}`
		)
	})
}

// ── stated counts vs reality ───────────────────────────────────────────────
// "30 semantic tokens" was stated in nine places; there are 31 colour tokens.
// Numbers in prose drift silently, so derive the truth and assert it.
const tokensSrc = readFileSync(join(root, 'src/lib/styles/_00_tokens.sass'), 'utf8')
const lightMixin = tokensSrc.split('=light-theme-tokens')[1].split('=dark-theme-tokens')[0]
const colourCount = [...lightMixin.matchAll(/^\s+(--[\w-]+):/gm)].filter(
	(m) => !m[1].startsWith('--shadow')
).length
const themeCount = [...compiled.matchAll(/\.(theme-[\w-]+)\s*\{/g)].length

// Only phrases that mean the CONTRACT. "22 colour tokens" in the generated
// reference is the per-theme count — a different, correct fact.
const COUNTS = [
	{ re: /(\d{1,3})\s+semantic\s+(?:CSS\s+custom\s+properties|tokens?)/gi, actual: colourCount, what: 'colour tokens' },
	{ re: /(\d{1,3})[- ][Tt]oken [Cc]ontract/g, actual: colourCount, what: 'colour tokens' },
	{ re: /[Tt]he (\d{1,3}) [Cc]olors?\b/g, actual: colourCount, what: 'colour tokens' },
	{ re: /(\d{1,3})\s+(?:curated\s+|built-in\s+)?(?:palettes|themes)\b/gi, actual: themeCount, what: 'themes' }
]
for (const file of files.filter((f) => f.endsWith('.md') && !f.includes('/references/'))) {
	const rel = file.replace(root + '/', '')
	readFileSync(file, 'utf8')
		.split('\n')
		.forEach((line, i) => {
			for (const { re, actual, what } of COUNTS) {
				re.lastIndex = 0
				let m
				while ((m = re.exec(line))) {
					if (Number(m[1]) !== actual) {
						problems.push(
							`${rel}:${i + 1}  →  says "${m[0].trim()}" but there are ${actual} ${what}`
						)
					}
				}
			}
		})
}

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
