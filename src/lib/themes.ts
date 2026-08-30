// Generated from _00_themes.sass by scripts/update-registry.js — do not edit.
export interface ThemeMeta {
	id: string;
	mode: 'light' | 'dark';
}

/** The 41 built-in palettes. Apply with setTheme(id).  */
export const themes: readonly ThemeMeta[] = [
	{ id: 'theme-light-default', mode: 'light' },
	{ id: 'theme-himalaya-light', mode: 'light' },
	{ id: 'theme-editorial-light', mode: 'light' },
	{ id: 'theme-space-light', mode: 'light' },
	{ id: 'theme-sun-light', mode: 'light' },
	{ id: 'theme-monochrono-light', mode: 'light' },
	{ id: 'theme-molly-light', mode: 'light' },
	{ id: 'theme-malana-light', mode: 'light' },
	{ id: 'theme-coresync-light', mode: 'light' },
	{ id: 'theme-studio-light', mode: 'light' },
	{ id: 'theme-matcha-light', mode: 'light' },
	{ id: 'theme-sakura-light', mode: 'light' },
	{ id: 'theme-nordic-frost-light', mode: 'light' },
	{ id: 'theme-desert-dune-light', mode: 'light' },
	{ id: 'theme-lavender-mist-light', mode: 'light' },
	{ id: 'theme-botanical-light', mode: 'light' },
	{ id: 'theme-clay-studio-light', mode: 'light' },
	{ id: 'theme-solaris-light', mode: 'light' },
	{ id: 'theme-cyberpunk-day-light', mode: 'light' },
	{ id: 'theme-copper-patina-light', mode: 'light' },
	{ id: 'theme-dracula-light', mode: 'light' },
	{ id: 'theme-lagoona-dark', mode: 'dark' },
	{ id: 'theme-frozen-dark', mode: 'dark' },
	{ id: 'theme-night-dark', mode: 'dark' },
	{ id: 'theme-inkworm-dark', mode: 'dark' },
	{ id: 'theme-monochrono-dark', mode: 'dark' },
	{ id: 'theme-fouram-dark', mode: 'dark' },
	{ id: 'theme-wintercame-dark', mode: 'dark' },
	{ id: 'theme-sun-dark', mode: 'dark' },
	{ id: 'theme-console-dark', mode: 'dark' },
	{ id: 'theme-dracula-dark', mode: 'dark' },
	{ id: 'theme-catppuccin-mocha', mode: 'light' },
	{ id: 'theme-nord-dark', mode: 'dark' },
	{ id: 'theme-gruvbox-dark', mode: 'dark' },
	{ id: 'theme-onedark-pro', mode: 'light' },
	{ id: 'theme-rose-pine-dark', mode: 'dark' },
	{ id: 'theme-midnight-emerald-dark', mode: 'dark' },
	{ id: 'theme-obsidian-crimson-dark', mode: 'dark' },
	{ id: 'theme-synthwave-dark', mode: 'dark' },
	{ id: 'theme-deep-ocean-dark', mode: 'dark' },
	{ id: 'theme-amethyst-void-dark', mode: 'dark' }
] as const;

export const themeIds: readonly string[] = themes.map((t) => t.id);
