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
export const MODE_KEY = 'fs2.mode';

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
		const savedMode = localStorage.getItem(MODE_KEY);
		if (savedMode === 'dark' || savedMode === 'light') setMode(savedMode);
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
	return `(function(){try{var v=${axes};var d=${defs};var r=document.documentElement;var s=JSON.parse(localStorage.getItem('${STORAGE_KEY}')||'{}');for(var k in v){var val=s[k];if(val&&val!==d[k])r.setAttribute('data-'+k,val);}var t=localStorage.getItem('${THEME_KEY}');if(t){r.classList.add(t);r.setAttribute('data-mode',t.indexOf('-dark')>-1?'dark':'light');}var m=localStorage.getItem('${MODE_KEY}');if(m==='dark'||m==='light')r.setAttribute('data-mode',m);}catch(e){}})();`;
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
		try {
			localStorage.removeItem(THEME_KEY);
		} catch {
			/* storage unavailable */
		}
		setMode(null);
		return;
	}

	const theme = themes.find((t) => t.id === id);
	if (!theme) return;
	root.classList.add(theme.id);
	try {
		localStorage.setItem(THEME_KEY, theme.id);
	} catch {
		/* storage unavailable — the theme stays session-local */
	}
	// A palette carries its own mode; route through setMode so it persists and
	// notifies like any other mode change.
	setMode(theme.mode);
}

/** The active palette, or null when none is applied. */
export function getTheme(): string | null {
	if (typeof document === 'undefined') return null;
	const root = document.documentElement;
	return themes.find((t) => root.classList.contains(t.id))?.id ?? null;
}

/**
 * The same palette in the opposite mode — `theme-sun-light` <-> `theme-sun-dark`.
 * Pairing is declared in `_00_themes.sass`, so it works for palettes whose
 * names do not rhyme: `theme-catppuccin-mocha` <-> `theme-catppuccin-latte`.
 * Null only when a palette genuinely has no counterpart.
 */
export function twinTheme(id: string): string | null {
	return themes.find((t) => t.id === id)?.twin ?? null;
}

/**
 * Swap to the light/dark counterpart of the active theme.
 *
 * With no theme applied this is just toggleMode(). With a theme that has a twin
 * it swaps palettes. With a theme that has no twin it still flips the mode, but
 * the palette's own colours outrank `[data-mode]` in the cascade, so nothing
 * visibly changes — see docs/14-api.md.
 *
 * Returns the theme id that is active afterwards, or null when none is.
 */
export function toggleThemeMode(): string | null {
	const active = getTheme();
	if (!active) {
		toggleMode();
		return null;
	}
	const twin = twinTheme(active);
	if (twin) {
		setTheme(twin);
		return twin;
	}
	toggleMode();
	return active;
}

export type Mode = 'light' | 'dark';

/**
 * Set the colour mode. Persists, so it survives reload — light/dark is the most
 * basic thing a user toggles and it has no business forgetting itself.
 *
 * Pass null to clear the choice and fall back to the OS preference.
 */
export function setMode(mode: Mode | null): void {
	if (typeof document === 'undefined') return;
	const root = document.documentElement;
	if (mode === null) {
		root.removeAttribute('data-mode');
		try {
			localStorage.removeItem(MODE_KEY);
		} catch {
			/* storage unavailable */
		}
	} else {
		root.setAttribute('data-mode', mode);
		try {
			localStorage.setItem(MODE_KEY, mode);
		} catch {
			/* storage unavailable — the choice stays session-local */
		}
	}
	for (const fn of modeListeners) fn(getMode());
}

/** The active mode. Falls back to the OS preference when nothing is chosen. */
export function getMode(): Mode {
	if (typeof document === 'undefined') return 'light';
	const attr = document.documentElement.getAttribute('data-mode');
	if (attr === 'dark' || attr === 'light') return attr;
	return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light';
}

/** True when the page is currently rendering dark. */
export function isDark(): boolean {
	return getMode() === 'dark';
}

export function toggleMode(): Mode {
	const next: Mode = getMode() === 'dark' ? 'light' : 'dark';
	setMode(next);
	return next;
}

type ModeListener = (mode: Mode) => void;
const modeListeners = new Set<ModeListener>();

/** Subscribe to mode changes — however they were made. Returns an unsubscribe. */
export function onModeChange(fn: ModeListener): () => void {
	modeListeners.add(fn);
	return () => modeListeners.delete(fn);
}
