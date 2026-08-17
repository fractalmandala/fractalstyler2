// fractalstyler2 — a fractal-composition styling system for SvelteKit.
//
// The product is the SASS in ./fractals and ./components, surfaced as:
//   import 'fractalstyler2/styles'          // emit the full stylesheet
//   @use 'fractalstyler2/fractals' as *     // compose your own with the mixins
//
// This entry ships only tiny runtime helpers. There is deliberately no CSS-in-JS
// and no component coupling — the styling layer is framework-agnostic SASS.

export const version = '0.0.1';

export type Mode = 'light' | 'dark';

/** Set the color mode by writing the [data-mode] marker on <html>. */
export function setMode(mode: Mode): void {
	if (typeof document === 'undefined') return;
	document.documentElement.setAttribute('data-mode', mode);
}

/** Toggle between light and dark, returning the new mode. */
export function toggleMode(): Mode {
	const current = typeof document !== 'undefined' ? document.documentElement.getAttribute('data-mode') : null;
	const next: Mode = current === 'dark' ? 'light' : 'dark';
	setMode(next);
	return next;
}
