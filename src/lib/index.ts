// fractalstyler2 — a fractal-composition styling system for SvelteKit.
//
// The product is the SASS in ./fractals and ./styles, surfaced as:
//   import 'fractalstyler2/styles'          // emit the full stylesheet
//   @use 'fractalstyler2/fractals' as *     // compose your own with the mixins
//
// This entry ships runtime helpers and token metadata.

export const version = '0.3.0';

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
	type PresetAxis
} from './presets.svelte.js';
export { default as ShapePicker } from './components/ShapePicker.svelte';
export { default as LayoutPicker } from './components/LayoutPicker.svelte';
export { default as ColorPicker } from './components/ColorPicker.svelte';
export { default as MotionPicker } from './components/MotionPicker.svelte';
