// fs2 preset runtime — the four preset languages are the styling system's own
// physics, so fs2 owns their application, persistence, and anti-flicker.
// Attribute contract: data-layout / data-shape / data-color / data-motion on
// <html>. Absent attribute = the axis's default (presetDefaults).

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

const STORAGE_KEY = 'fs2.presets';

export const presets = $state<Record<PresetAxis, string>>({ ...presetDefaults });

function isDefault(axis: PresetAxis, value: string): boolean {
	return value === presetDefaults[axis];
}

function applyAttr(axis: PresetAxis, value: string): void {
	const root = document.documentElement;
	if (isDefault(axis, value)) root.removeAttribute(`data-${axis}`);
	else root.setAttribute(`data-${axis}`, value);
}

function persist(): void {
	const nonDefaults: Record<string, string> = {};
	for (const axis of Object.keys(presetAxes) as PresetAxis[]) {
		if (!isDefault(axis, presets[axis])) nonDefaults[axis] = presets[axis];
	}
	try {
		if (Object.keys(nonDefaults).length)
			localStorage.setItem(STORAGE_KEY, JSON.stringify(nonDefaults));
		else localStorage.removeItem(STORAGE_KEY);
	} catch {
		/* storage unavailable — presets stay session-local */
	}
}

/** Read the saved blob and apply it. Call once on mount (layout root). */
export function initPresets(): void {
	if (typeof document === 'undefined') return;
	try {
		const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
		for (const axis of Object.keys(presetAxes) as PresetAxis[]) {
			const v = saved[axis];
			if (v && (presetAxes[axis] as readonly string[]).includes(v)) {
				presets[axis] = v;
				applyAttr(axis, v);
			}
		}
	} catch {
		/* corrupt blob — defaults stand */
	}
}

/** Set one axis. Defaults remove the attribute (absent = default). */
export function setPreset(axis: PresetAxis, value: string): void {
	if (typeof document === 'undefined') return;
	if (!(presetAxes[axis] as readonly string[]).includes(value)) return;
	presets[axis] = value;
	applyAttr(axis, value);
	persist();
}

/** Inline head script — stamps saved presets before first paint (no flicker).
 *  Axes and defaults are derived from the constants above — one source, no
 *  second hardcoded copy to drift. */
export function getPresetScript(): string {
	const axes = JSON.stringify(presetAxes).replaceAll('"', "'");
	const defs = JSON.stringify(presetDefaults).replaceAll('"', "'");
	return `(function(){try{var v=${axes};var d=${defs};var s=JSON.parse(localStorage.getItem('${STORAGE_KEY}')||'{}');var r=document.documentElement;for(var k in v){var val=s[k];if(val&&val!==d[k])r.setAttribute('data-'+k,val);}}catch(e){}})();`;
}
