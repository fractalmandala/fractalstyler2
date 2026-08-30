// Svelte wrapper over the framework-free runtime in presets.core.ts.
//
// The logic lives there so the vanilla CSS distribution and the Svelte package
// share one implementation. All this adds is a reactive mirror of the state so
// the bundled pickers re-render.

import {
	presetAxes,
	presetDefaults,
	initPresets as coreInit,
	setPreset as coreSet,
	onPresetChange,
	presetState,
	type PresetAxis
} from './presets.core.js';

export {
	presetAxes,
	presetDefaults,
	getPreset,
	cyclePreset,
	getPresetScript,
	setMode,
	toggleMode,
	setTheme,
	getTheme,
	toggleThemeMode,
	themes,
	themeIds,
	type ThemeMeta,
	onPresetChange,
	type PresetAxis
} from './presets.core.js';

/** Reactive mirror of presetState, for pickers and any $derived reading it. */
export const presets = $state<Record<PresetAxis, string>>({ ...presetDefaults });

// Keep the mirror in step with the core, however the core was driven.
onPresetChange((axis, value) => {
	presets[axis] = value;
});

export function initPresets(): void {
	coreInit();
	for (const axis of Object.keys(presetAxes) as PresetAxis[]) presets[axis] = presetState[axis];
}

export function setPreset(axis: PresetAxis, value: string): void {
	coreSet(axis, value);
}
