import type { Component } from 'svelte'
import type { RigKind } from '../types.js'

import None from './None.svelte'
import Constants from './Constants.svelte'
import StepWheel from './StepWheel.svelte'
import AxisPad from './AxisPad.svelte'
import Harmony from './Harmony.svelte'
import Shell from './Shell.svelte'
import Dress from './Dress.svelte'
import Presets from './Presets.svelte'
import Compact from './Compact.svelte'

/**
 * Rig registry — the same shape as figures.ts, one level up. Add a kind to
 * RigKind, add a component here, reference it from a slide's rig.kind.
 */
export const rigs: Record<RigKind, Component<any>> = {
	none: None,
	ruler: Constants,
	stepwheel: StepWheel,
	axispad: AxisPad,
	harmony: Harmony,
	shell: Shell,
	dress: Dress,
	presets: Presets,
	compact: Compact
}
