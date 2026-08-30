// fs2 preset runtime — framework-free.
//
// The four preset languages are the styling system's own physics, so fs2 owns
// their application, persistence and anti-flicker. Nothing here imports Svelte:
// this is the module a vanilla CSS consumer gets, and it is also the single
// implementation the Svelte wrapper (presets.svelte.ts) delegates to.
//
// Attribute contract: data-layout / data-shape / data-color / data-motion on
// <html>. An absent attribute means that axis's default. A palette is a class
// on the same element, paired with data-mode.

import { themes } from './themes.js';
export { themes, themeIds, type ThemeMeta } from './themes.js';

// Axis arrays are the canonical value order — monotonic (shape: roundest →
// sharpest) — and are what pickers render. Default-ness is declared separately
// in presetDefaults; it does not dictate array position.
export const presetAxes = {
	layout: ['tight', 'comfortable', 'sprawling'],
	shape: ['round', 'curved', 'pro', 'sharp'],
	color: ['clean', 'general', 'vibrant'],
	motion: ['reduced', 'heavy', 'active', 'springy']
} as const;

export const presetDefaults = {
	layout: 'comfortable',
	shape: 'curved',
	color: 'general',
	motion: 'active'
} as const;

export type PresetAxis = keyof typeof presetAxes;

export const STORAGE_KEY = 'fs2.presets';
export const THEME_KEY = 'fs2.theme';

/** Current value of every axis. Read it; mutate through setPreset. */
export const presetState: Record<PresetAxis, string> = { ...presetDefaults };

type Listener = (axis: PresetAxis, value: string) => void;
const listeners = new Set<Listener>();

/** Subscribe to preset changes — for hand-rolled pickers. Returns an unsubscribe. */
export function onPresetChange(fn: Listener): () => void {
	listeners.add(fn);
	return () => listeners.delete(fn);
}

export function isDefault(axis: PresetAxis, value: string): boolean {
	return value === presetDefaults[axis];
}

function isValid(axis: PresetAxis, value: string): boolean {
	return (presetAxes[axis] as readonly string[]).includes(value);
}

/** Default values remove the attribute — absent IS the default. */
function applyAttr(axis: PresetAxis, value: string): void {
	const root = document.documentElement;
	if (isDefault(axis, value)) root.removeAttribute(`data-${axis}`);
	else root.setAttribute(`data-${axis}`, value);
}

function persist(): void {
	const nonDefaults: Record<string, string> = {};
	for (const axis of Object.keys(presetAxes) as PresetAxis[]) {
		if (!isDefault(axis, presetState[axis])) nonDefaults[axis] = presetState[axis];
	}
	try {
		if (Object.keys(nonDefaults).length)
			localStorage.setItem(STORAGE_KEY, JSON.stringify(nonDefaults));
		else localStorage.removeItem(STORAGE_KEY);
	} catch {
		/* storage unavailable — presets stay session-local */
	}
}

/** Read the saved blob and apply it. Call once, on load. */
export function initPresets(): void {
	if (typeof document === 'undefined') return;
	try {
		const savedTheme = localStorage.getItem(THEME_KEY);
		if (savedTheme) setTheme(savedTheme);
	} catch {
		/* storage unavailable — defaults stand */
	}
	try {
		const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
		for (const axis of Object.keys(presetAxes) as PresetAxis[]) {
			const v = saved[axis];
			if (v && isValid(axis, v)) {
				presetState[axis] = v;
				applyAttr(axis, v);
				for (const fn of listeners) fn(axis, v);
			}
		}
	} catch {
		/* corrupt blob — defaults stand */
	}
}

/** Set one axis. Ignores values outside the axis. */
export function setPreset(axis: PresetAxis, value: string): void {
	if (typeof document === 'undefined') return;
	if (!isValid(axis, value)) return;
	presetState[axis] = value;
	applyAttr(axis, value);
	persist();
	for (const fn of listeners) fn(axis, value);
}

export function getPreset(axis: PresetAxis): string {
	return presetState[axis];
}

/** Cycle an axis to its next value — what a single toggle button wants. */
export function cyclePreset(axis: PresetAxis): string {
	const values = presetAxes[axis] as readonly string[];
	const next = values[(values.indexOf(presetState[axis]) + 1) % values.length];
	setPreset(axis, next);
	return next;
}

/** Inline head script — stamps saved presets before first paint (no flicker).
 *  Axes and defaults are derived from the constants above — one source, no
 *  second hardcoded copy to drift. */
export function getPresetScript(): string {
	const axes = JSON.stringify(presetAxes).replaceAll('"', "'");
	const defs = JSON.stringify(presetDefaults).replaceAll('"', "'");
	return `(function(){try{var v=${axes};var d=${defs};var r=document.documentElement;var s=JSON.parse(localStorage.getItem('${STORAGE_KEY}')||'{}');for(var k in v){var val=s[k];if(val&&val!==d[k])r.setAttribute('data-'+k,val);}var t=localStorage.getItem('${THEME_KEY}');if(t){r.classList.add(t);r.setAttribute('data-mode',t.indexOf('-dark')>-1?'dark':'light');}}catch(e){}})();`;
}

// ─── themes ────────────────────────────────────────────────────────────────
// A theme is one class on <html>, always paired with its data-mode: the colour
// preset's dark variants key off prefers-color-scheme, so an unpaired theme can
// end up tuned against the OS preference rather than against itself.

/** Apply a built-in palette. Pass null to fall back to the mode defaults. */
export function setTheme(id: string | null): void {
	if (typeof document === 'undefined') return;
	const root = document.documentElement;
	for (const t of themes) root.classList.remove(t.id);

	if (!id) {
		root.removeAttribute('data-mode');
		try {
			localStorage.removeItem(THEME_KEY);
		} catch {
			/* storage unavailable */
		}
		return;
	}

	const theme = themes.find((t) => t.id === id);
	if (!theme) return;
	root.classList.add(theme.id);
	root.setAttribute('data-mode', theme.mode);
	try {
		localStorage.setItem(THEME_KEY, theme.id);
	} catch {
		/* storage unavailable — the theme stays session-local */
	}
}

/** The active palette, or null when none is applied. */
export function getTheme(): string | null {
	if (typeof document === 'undefined') return null;
	const root = document.documentElement;
	return themes.find((t) => root.classList.contains(t.id))?.id ?? null;
}

/** Swap to the light/dark counterpart of the active theme, if it has one. */
export function toggleThemeMode(): string | null {
	const active = getTheme();
	if (!active) {
		toggleMode();
		return null;
	}
	const want = themes.find((t) => t.id === active)!.mode === 'dark' ? 'light' : 'dark';
	const twin = themes.find((t) => t.mode === want);
	if (twin) setTheme(twin.id);
	return twin?.id ?? null;
}

/** Set the colour mode marker. Light/dark is a mode, not a preset axis. */
export function setMode(mode: 'light' | 'dark'): void {
	if (typeof document === 'undefined') return;
	document.documentElement.setAttribute('data-mode', mode);
}

export function toggleMode(): 'light' | 'dark' {
	const current =
		typeof document !== 'undefined' ? document.documentElement.getAttribute('data-mode') : null;
	const next = current === 'dark' ? 'light' : 'dark';
	setMode(next);
	return next;
}
