// Derive the missing light/dark counterpart for every unpaired palette.
//
// The transform is not invented — it is measured from the three families that
// were already paired by hand (sun, monochrono, dracula). For each of the 20
// structural tokens those pairs agree on a target lightness in OKLCH; the
// palette's own hue and chroma ride along unchanged, so a counterpart still
// reads as the same palette.
//
// The two accent tokens are NOT derived by rule. sun and monochrono flip the
// accent hue ~180deg; dracula keeps it. Two of three disagree, so there is no
// house rule to follow — we keep the hue and lift it into legibility, which is
// what dracula does and what preserves palette identity.

import fs from 'node:fs';

// ---------- colour ----------
const srgb2lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lin2srgb = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);

function hexToRgb(hex) {
	let h = hex.replace('#', '');
	if (h.length === 3) h = [...h].map((c) => c + c).join('');
	return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}
function rgbToHex(rgb) {
	return (
		'#' +
		rgb
			.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0'))
			.join('')
			.toUpperCase()
	);
}
export function toOklab(hex) {
	const [r, g, b] = hexToRgb(hex).map(srgb2lin);
	const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
	const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
	const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
	return [
		0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
		1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
		0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
	];
}
function fromOklab([L, a, b]) {
	const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
	return rgbToHex(
		[
			4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
			-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
			-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
		].map(lin2srgb)
	);
}
export const lightnessOf = (hex) => toOklab(hex)[0];
/** Re-light a colour, keeping its hue and (scaled) chroma. */
function relight(hex, targetL, chromaScale = 1) {
	const [, a, b] = toOklab(hex);
	return fromOklab([targetL, a * chromaScale, b * chromaScale]);
}
/** WCAG contrast, for verification. */
export function contrast(h1, h2) {
	const lum = (h) => {
		const [r, g, b] = hexToRgb(h).map(srgb2lin);
		return 0.2126 * r + 0.7152 * g + 0.0722 * b;
	};
	const [a, b] = [lum(h1), lum(h2)].sort((x, y) => y - x);
	return (a + 0.05) / (b + 0.05);
}

// ---------- the measured ramp ----------
// Target lightness per token, as an offset from the palette's anchor (--bg).
// Values are the mean of sun/monochrono/dracula, expressed relative to bg so a
// palette keeps its own overall darkness rather than being flattened to one.
const RAMP_DARK = {
	'--bg': 0,
	'--bg-surface': +0.045,
	'--bg-raised': +0.085,
	'--bg-panel': -0.025,
	'--bg-footer': -0.075,
	'--bg-popover': +0.115,
	'--bg-dialog': +0.115,
	'--bg-input': -0.005,
	'--bg-canvas': 0,
	'--border': +0.19,
	'--border-subtle': +0.10,
	'--state-hover': +0.135,
	'--state-hover-subtle': +0.06,
	'--state-selected': +0.205
};
const RAMP_LIGHT = {
	'--bg': 0,
	'--bg-surface': -0.03,
	'--bg-raised': +0.02,
	'--bg-panel': -0.07,
	'--bg-footer': -0.11,
	'--bg-popover': +0.015,
	'--bg-dialog': +0.015,
	'--bg-input': +0.02,
	'--bg-canvas': 0,
	'--border': -0.14,
	'--border-subtle': -0.08,
	'--state-hover': -0.10,
	'--state-hover-subtle': -0.04,
	'--state-selected': -0.17
};
// Absolute targets — these do not ride the anchor.
const ABS_DARK = {
	'--text-primary': 0.97,
	'--text-secondary': 0.755,
	'--text-muted': 0.535,
	'--theme-color': 0.80,
	'--theme-color-alt': 0.72,
	'--feedback-error': 0.65
};
const ABS_LIGHT = {
	'--text-primary': 0.23,
	'--text-secondary': 0.44,
	'--text-muted': 0.63,
	'--theme-color': 0.50,
	'--theme-color-alt': 0.51,
	'--feedback-error': 0.55
};
// Anchor: where --bg lands in the opposite mode. Measured spread was
// 0.11-0.29 (dark) and 0.97-1.00 (light); mid-dark keeps palettes distinct
// without any of them going pitch black.
const ANCHOR = { dark: 0.19, light: 0.975 };

// How much tint the surfaces carry, measured as mean OKLCH chroma across
// --bg/-surface/-raised/-panel/-popover on the hand-made palettes. A dark
// palette needs roughly 2.5x the chroma of a light one to read as tinted at
// all, which is why scaling the source by a fixed factor fails in both
// directions: derived darks came out flat, derived lights came out garish.
const TARGET_CHROMA = { dark: 0.030, light: 0.012 };
const CHROMA_KEYS = ['--bg', '--bg-surface', '--bg-raised', '--bg-panel', '--bg-popover'];
const chromaOf = (hex) => { const [, a, b] = toOklab(hex); return Math.hypot(a, b); };

export function counterpart(src, toMode) {
	const ramp = toMode === 'dark' ? RAMP_DARK : RAMP_LIGHT;
	const abs = toMode === 'dark' ? ABS_DARK : ABS_LIGHT;
	const out = {};
	const anchor = ANCHOR[toMode];

	// Pull the palette's tint toward the target rather than onto it, so a
	// deliberately vivid source stays more vivid than a near-neutral one.
	const sourceChroma =
		CHROMA_KEYS.reduce((sum, k) => sum + chromaOf(src[k]), 0) / CHROMA_KEYS.length;
	const surfaceChroma = Math.min(
		6,
		Math.max(0.4, (TARGET_CHROMA[toMode] / Math.max(sourceChroma, 0.002)) ** 0.75)
	);

	for (const [tok, delta] of Object.entries(ramp)) {
		out[tok] = relight(src[tok], clamp(anchor + delta), surfaceChroma);
	}
	for (const [tok, L] of Object.entries(abs)) {
		const isAccent = tok.startsWith('--theme-color') || tok === '--feedback-error';
		out[tok] = relight(src[tok], L, isAccent ? (toMode === 'dark' ? 0.9 : 1.0) : 0.55);
	}
	// Terminal is the one surface that stays dark in both modes.
	out['--bg-terminal'] =
		toMode === 'dark' ? relight(src['--bg-terminal'], clamp(anchor - 0.11), surfaceChroma)
		                  : relight(src['--bg-terminal'], 0.24, surfaceChroma);
	// Invariants the hand-made pairs hold without exception.
	out['--bg-canvas'] = out['--bg'];
	out['--bg-dialog'] = out['--bg-popover'];
	out['--text-inverse'] = toMode === 'dark' ? out['--bg'] : '#FFFFFF';
	return out;
}
const clamp = (v) => Math.min(1, Math.max(0, v));
