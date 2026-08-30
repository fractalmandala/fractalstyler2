// fractalstyler2 — a composition styling system.
//
// The product is the class registry, emitted as a stylesheet:
//   import 'fractalstyler2/css'      // compiled CSS — the default path
//   import 'fractalstyler2/styles'   // SASS source, if you want to retune it
//
// There are no authoring mixins and no SASS functions: compose in markup.
// This entry ships runtime helpers and token metadata for Svelte consumers;
// framework-free equivalents live at 'fractalstyler2/presets'.

import { version } from './version.js';
export { version };

export type Mode = 'light' | 'dark';

/** Set the color mode by writing the [data-mode] marker on <html>. */
export function setMode(mode: Mode): void {
	if (typeof document === 'undefined') return;
	document.documentElement.setAttribute('data-mode', mode);
}

/** Toggle between light and dark, returning the new mode. */
export function toggleMode(): Mode {
	const current =
		typeof document !== 'undefined' ? document.documentElement.getAttribute('data-mode') : null;
	const next: Mode = current === 'dark' ? 'light' : 'dark';
	setMode(next);
	return next;
}

// Design Token Metadata
export const breakpoints = {
	sm: '640px',
	md: '768px',
	lg: '1024px',
	xl: '1280px'
} as const;

export const spaceScale = [
	'3xs',
	'2xs',
	'xs',
	'sm',
	'md',
	'lg',
	'xl',
	'2xl',
	'3xl'
] as const;

export const typographyScale = [
	'xs',
	'sm',
	'md',
	'lg',
	'xl',
	'2xl',
	'3xl',
	'4xl'
] as const;

export const radiusSteps = [
	'0',
	'2',
	'3',
	'4',
	'6',
	'8',
	'12',
	'16',
	'24',
	'full'
] as const;

export const surfaceRoles = [
	'bg',
	'surface',
	'raised',
	'panel',
	'footer',
	'popover',
	'dialog',
	'terminal',
	'input',
	'canvas'
] as const;

export const inkRoles = [
	'primary',
	'secondary',
	'muted',
	'inverse',
	'theme-color',
	'theme-color-alt'
] as const;

export const tokens = {
	version,
	breakpoints,
	spaceScale,
	typographyScale,
	radiusSteps,
	surfaceRoles,
	inkRoles
} as const;

export type Breakpoint = keyof typeof breakpoints;
export type SpaceStep = (typeof spaceScale)[number];
export type TypographyStep = (typeof typographyScale)[number];
export type RadiusStep = (typeof radiusSteps)[number];
export type SurfaceRole = (typeof surfaceRoles)[number];
export type InkRole = (typeof inkRoles)[number];

// Preset runtime — fs2 owns application, persistence, and anti-flicker for
// the four preset languages (layout / shape / color / motion).
export {
	presets,
	presetAxes,
	initPresets,
	setPreset,
	getPresetScript,
	setTheme,
	getTheme,
	toggleThemeMode,
	themes,
	themeIds,
	type ThemeMeta,
	type PresetAxis
} from './presets.svelte.js';
// Shell components — the canonical markups, executable. Optional convenience
// over the class contract, never a replacement for it: a CSS consumer copying
// canonical-markups.md by hand gets identical output.
export { default as AppShell } from './components/AppShell.svelte';
export { default as PageShell } from './components/PageShell.svelte';
export { default as PageSplit } from './components/PageSplit.svelte';
export { default as Hero } from './components/Hero.svelte';
export { default as Accordion } from './components/Accordion.svelte';
export { default as AccordionItem } from './components/AccordionItem.svelte';

export { default as ShapePicker } from './components/ShapePicker.svelte';
export { default as LayoutPicker } from './components/LayoutPicker.svelte';
export { default as ColorPicker } from './components/ColorPicker.svelte';
export { default as MotionPicker } from './components/MotionPicker.svelte';
