import type { FigureKind, FigureRenderer, Graphic, Seed } from './types.js'

/**
 * Figure registry.
 *
 * Each renderer is (level, seed) => SVG markup. Any group carrying a
 * data-spin attribute rotates at that multiple of the component's clock.
 * Add a kind here, then reference it from a slide's graphic.kind.
 */

export const CENTRE = 310
export const VIEWBOX = '0 0 620 620'

const R_OUT = 250
const RINGS = 5

type Point = [number, number]

const mandala: FigureRenderer = (level, { sides, ratio }: Seed) => {
	const rad = (i: number): number => R_OUT / Math.pow(ratio, RINGS - 1 - i)

	const verts = (cx: number, cy: number, r: number, n: number, rot = 0): Point[] =>
		Array.from({ length: n }, (_, k): Point => {
			const a = rot + (k * 2 * Math.PI) / n - Math.PI / 2
			return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
		})

	const pts = (p: Point[]): string => p.map((q) => q.join(',')).join(' ')

	// recursive: the unit drawn at each of its own vertices
	const unit = (
		cx: number,
		cy: number,
		r: number,
		depth: number,
		rot: number,
		stroke: string,
		op: number
	): string => {
		if (depth <= 0 || r < 3) return ''
		const p = verts(cx, cy, r, sides, rot)
		let out = `<polygon points="${pts(p)}" fill="none" stroke="${stroke}" stroke-width="1" opacity="${op}"/>`
		if (depth > 1)
			for (const [x, y] of p)
				out += unit(x, y, r / (ratio * 1.55), depth - 1, rot + Math.PI / sides, stroke, op * 0.72)
		return out
	}

	const C = CENTRE
	const lit = level >= 5
	const ink = lit ? 'url(#lum)' : '#5A6086'
	let g = ''

	// the enclosure — drawn first so it sits behind
	if (level >= 4)
		g += `<g data-spin="-0.9" opacity=".85">
			<circle cx="${C}" cy="${C}" r="286" fill="none" stroke="${lit ? '#7E76B8' : '#3B4066'}" stroke-width="1"/>
			<circle cx="${C}" cy="${C}" r="272" fill="none" stroke="${lit ? '#7E76B8' : '#3B4066'}" stroke-width="1" stroke-dasharray="1 13" opacity=".8"/>
			${verts(C, C, 286, sides * 2)
				.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="${lit ? '#E8BC85' : '#4A5075'}"/>`)
				.join('')}
		</g>`

	// the spreading — concentric repetitions plus spokes
	if (level >= 1) {
		for (let i = 0; i < RINGS; i++)
			g += `<g data-spin="${(i % 2 ? 1 : -1) * (0.6 + i * 0.22)}">
				<polygon points="${pts(verts(C, C, rad(i), sides, (i * Math.PI) / sides))}" fill="none" stroke="${ink}" stroke-width="1" opacity="${0.24 + i * 0.11}"/>
			</g>`
		g += `<g opacity="${lit ? 0.3 : 0.18}">${verts(C, C, R_OUT, sides)
			.map(([x, y]) => `<line x1="${C}" y1="${C}" x2="${x}" y2="${y}" stroke="${ink}" stroke-width="1"/>`)
			.join('')}</g>`
	}

	// self-similarity — the whole, smaller, at every vertex
	if (level >= 2)
		g += `<g data-spin="1.5">${verts(C, C, rad(2), sides, Math.PI / sides)
			.map(([x, y]) => unit(x, y, rad(0) * 0.62, 2, 0, ink, 0.62))
			.join('')}</g>`

	// the cluster — motifs orbiting motifs
	if (level >= 3)
		g += `<g data-spin="-0.55">${verts(C, C, rad(4), sides)
			.map(([x, y]) => unit(x, y, rad(1) * 0.42, 2, Math.PI / sides, ink, 0.5))
			.join('')}</g>`

	// the seed — always present, always at the centre
	g += `<g data-spin="2.2">${unit(C, C, rad(0), 1, 0, lit ? 'url(#lum)' : '#8890B8', 0.95)}</g>`
	g += `<circle cx="${C}" cy="${C}" r="${lit ? 4.5 : 3}" fill="#E8BC85"/>`
	if (lit)
		g += `<circle cx="${C}" cy="${C}" r="13" fill="none" stroke="#E8BC85" stroke-width="1" opacity=".45"/>`

	return `<defs>
		<linearGradient id="lum" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0%" stop-color="#E8BC85"/><stop offset="55%" stop-color="#B49CE4"/><stop offset="100%" stop-color="#7FA9E0"/>
		</linearGradient>
		<filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
			<feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
		</filter>
	</defs><g ${lit ? 'filter="url(#glow)"' : ''}>${g}</g>`
}

export const figures: Record<FigureKind, FigureRenderer> = { mandala }

export function renderFigure(graphic: Graphic, seed: Seed): string {
	const draw = figures[graphic.kind] ?? figures.mandala
	return draw(graphic.level, seed)
}
