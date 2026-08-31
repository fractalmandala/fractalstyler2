# Fractalstyler2 — Complete Class & Token Registry

Status: **LOCKED & CANONICAL**  
Updated: **2026-08-31**  
Architecture: **L0 (Tokens) $\rightarrow$ L1 (Dimensions) $\rightarrow$ L2 (Containers) $\rightarrow$ L3 (Layouts) $\rightarrow$ L4 (Shells) $\rightarrow$ L5 (Visuals & Interactions)**

This document is the **single, definitive, grepable master registry** for all CSS classes, tokens, modifiers, and canonical markup structures in `fractalstyler2`.

---

## Quick Grep Cheatsheet

Format: `CLASS_NAME | LAYER | CSS PROPERTY / BEHAVIOR | FILE SOURCE | EXAMPLE`

```
.gap-*                   | L1 | gap: calc(var(--space-*) * var(--gap-scale)) | {N}px       | _02_dimensions.sass    | <div class="gap-*">
.rgap-*                  | L1 | row-gap: calc(var(--space-*) * var(--gap-scale)) | {N}px   | _02_dimensions.sass    | <div class="rgap-*">
.cgap-*                  | L1 | column-gap: calc(var(--space-*) * var(--gap-scale)) | {N}px | _02_dimensions.sass    | <div class="cgap-*">
.pad-*                   | L1 | padding: calc(var(--space-*) * var(--pad-scale)) | {N}px   | _02_dimensions.sass    | <div class="pad-*">
.pad-x-*                 | L1 | padding-inline: calc(var(--space-*) * var(--pad-scale)) | {N}px | _02_dimensions.sass    | <div class="pad-x-*">
.pad-y-*                 | L1 | padding-block: calc(var(--space-*) * var(--pad-scale)) | {N}px | _02_dimensions.sass    | <div class="pad-y-*">
.pad-top-*               | L1 | padding-top: calc(var(--space-*) * var(--pad-scale)) | {N}px | _02_dimensions.sass    | <div class="pad-top-*">
.pad-right-*             | L1 | padding-right: calc(var(--space-*) * var(--pad-scale)) | {N}px | _02_dimensions.sass    | <div class="pad-right-*">
.pad-bottom-*            | L1 | padding-bottom: calc(var(--space-*) * var(--pad-scale)) | {N}px | _02_dimensions.sass    | <div class="pad-bottom-*">
.pad-left-*              | L1 | padding-left: calc(var(--space-*) * var(--pad-scale)) | {N}px | _02_dimensions.sass    | <div class="pad-left-*">
.marg-*                  | L1 | margin: calc(var(--space-*) * var(--gap-scale)) | {N}px    | _02_dimensions.sass    | <div class="marg-*">
.marg--*                 | L1 | margin: calc(var(--space-*) * var(--gap-scale) * -1) | -{N}px | _02_dimensions.sass    | <div class="marg--*">
.marg-x-*                | L1 | margin-inline: calc(var(--space-*) * var(--gap-scale)) | {N}px | _02_dimensions.sass    | <div class="marg-x-*">
.marg-y-*                | L1 | margin-block: calc(var(--space-*) * var(--gap-scale)) | {N}px | _02_dimensions.sass    | <div class="marg-y-*">
.marg-top-*              | L1 | margin-top: calc(var(--space-*) * var(--gap-scale)) | {N}px | _02_dimensions.sass    | <div class="marg-top-*">
.marg-top--*             | L1 | margin-top: calc(var(--space-*) * var(--gap-scale) * -1) | -{N}px | _02_dimensions.sass    | <div class="marg-top--*">
.marg-bottom-*           | L1 | margin-bottom: calc(var(--space-*) * var(--gap-scale)) | {N}px | _02_dimensions.sass    | <div class="marg-bottom-*">
.marg-bottom--*          | L1 | margin-bottom: calc(var(--space-*) * var(--gap-scale) * -1) | -{N}px | _02_dimensions.sass    | <div class="marg-bottom--*">
.marg-left-*             | L1 | margin-left: calc(var(--space-*) * var(--gap-scale)) | {N}px | _02_dimensions.sass    | <div class="marg-left-*">
.marg-right-*            | L1 | margin-right: calc(var(--space-*) * var(--gap-scale)) | {N}px | _02_dimensions.sass    | <div class="marg-right-*">
.radius-*                | L1 | border-radius: {N}px                                       | _02_dimensions.sass    | <div class="radius-*">
.radius-full             | L1 | border-radius: var(--radius-full)                          | _02_dimensions.sass    | <div class="radius-full">
.w-*                     | L1 | width: {N}px                                               | _02_dimensions.sass    | <div class="w-*">
.h-*                     | L1 | height: {N}px                                              | _02_dimensions.sass    | <div class="h-*">
.square-*                | L1 | width: {N}px; height: {N}px                                | _02_dimensions.sass    | <div class="square-*">
.min0                    | L1 | min-width: 0; min-height: 0                                | _02_dimensions.sass    | <div class="min0">
.wfull                   | L1 | width: 100%                                                | _02_dimensions.sass    | <div class="wfull">
.hfull                   | L1 | height: 100%                                               | _02_dimensions.sass    | <div class="hfull">
.full                    | L1 | width: 100%; height: 100%                                  | _02_dimensions.sass    | <div class="full">
.hfull-vh                | L1 | min-height: 100vh                                          | _02_dimensions.sass    | <div class="hfull-vh">
.hfull-vh-fitted         | L1 | min-height: calc(100vh - var(--header-height) - var(--footer-height)) | _02_dimensions.sass    | <div class="hfull-vh-fitted">
.frame-16-9              | L3 | aspect-ratio: 16 / 9                                       | _04_layouts.sass       | <div class="frame-16-9">
.frame-9-16              | L3 | aspect-ratio: 9 / 16                                       | _04_layouts.sass       | <div class="frame-9-16">
.frame-4-3               | L3 | aspect-ratio: 4 / 3                                        | _04_layouts.sass       | <div class="frame-4-3">
.frame-3-4               | L3 | aspect-ratio: 3 / 4                                        | _04_layouts.sass       | <div class="frame-3-4">
.frame-3-2               | L3 | aspect-ratio: 3 / 2                                        | _04_layouts.sass       | <div class="frame-3-2">
.frame-2-3               | L3 | aspect-ratio: 2 / 3                                        | _04_layouts.sass       | <div class="frame-2-3">
.frame-1-1               | L3 | aspect-ratio: 1 / 1                                        | _04_layouts.sass       | <div class="frame-1-1">
.theme-light-default     | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-light-default" data-mode="light">
.theme-himalaya-light    | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-himalaya-light" data-mode="light">
.theme-editorial-light   | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-editorial-light" data-mode="light">
.theme-space-light       | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-space-light" data-mode="light">
.theme-sun-light         | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-sun-light" data-mode="light">
.theme-monochrono-light  | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-monochrono-light" data-mode="light">
.theme-molly-light       | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-molly-light" data-mode="light">
.theme-malana-light      | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-malana-light" data-mode="light">
.theme-coresync-light    | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-coresync-light" data-mode="light">
.theme-studio-light      | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-studio-light" data-mode="light">
.theme-matcha-light      | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-matcha-light" data-mode="light">
.theme-sakura-light      | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-sakura-light" data-mode="light">
.theme-nordic-frost-light | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-nordic-frost-light" data-mode="light">
.theme-desert-dune-light | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-desert-dune-light" data-mode="light">
.theme-lavender-mist-light | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-lavender-mist-light" data-mode="light">
.theme-botanical-light   | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-botanical-light" data-mode="light">
.theme-clay-studio-light | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-clay-studio-light" data-mode="light">
.theme-solaris-light     | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-solaris-light" data-mode="light">
.theme-cyberpunk-day-light | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-cyberpunk-day-light" data-mode="light">
.theme-copper-patina-light | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-copper-patina-light" data-mode="light">
.theme-dracula-light     | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-dracula-light" data-mode="light">
.theme-lagoona-dark      | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-lagoona-dark" data-mode="dark">
.theme-frozen-dark       | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-frozen-dark" data-mode="dark">
.theme-night-dark        | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-night-dark" data-mode="dark">
.theme-inkworm-dark      | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-inkworm-dark" data-mode="dark">
.theme-monochrono-dark   | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-monochrono-dark" data-mode="dark">
.theme-fouram-dark       | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-fouram-dark" data-mode="dark">
.theme-wintercame-dark   | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-wintercame-dark" data-mode="dark">
.theme-sun-dark          | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-sun-dark" data-mode="dark">
.theme-console-dark      | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-console-dark" data-mode="dark">
.theme-dracula-dark      | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-dracula-dark" data-mode="dark">
.theme-catppuccin-mocha  | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-catppuccin-mocha" data-mode="light">
.theme-nord-dark         | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-nord-dark" data-mode="dark">
.theme-gruvbox-dark      | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-gruvbox-dark" data-mode="dark">
.theme-onedark-pro       | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-onedark-pro" data-mode="light">
.theme-rose-pine-dark    | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-rose-pine-dark" data-mode="dark">
.theme-midnight-emerald-dark | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-midnight-emerald-dark" data-mode="dark">
.theme-obsidian-crimson-dark | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-obsidian-crimson-dark" data-mode="dark">
.theme-synthwave-dark    | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-synthwave-dark" data-mode="dark">
.theme-deep-ocean-dark   | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-deep-ocean-dark" data-mode="dark">
.theme-amethyst-void-dark | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-amethyst-void-dark" data-mode="dark">
.theme-dark-default      | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-dark-default" data-mode="dark">
.theme-himalaya-dark     | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-himalaya-dark" data-mode="dark">
.theme-editorial-dark    | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-editorial-dark" data-mode="dark">
.theme-space-dark        | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-space-dark" data-mode="dark">
.theme-molly-dark        | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-molly-dark" data-mode="dark">
.theme-malana-dark       | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-malana-dark" data-mode="dark">
.theme-coresync-dark     | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-coresync-dark" data-mode="dark">
.theme-studio-dark       | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-studio-dark" data-mode="dark">
.theme-matcha-dark       | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-matcha-dark" data-mode="dark">
.theme-sakura-dark       | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-sakura-dark" data-mode="dark">
.theme-nordic-frost-dark | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-nordic-frost-dark" data-mode="dark">
.theme-desert-dune-dark  | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-desert-dune-dark" data-mode="dark">
.theme-lavender-mist-dark | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-lavender-mist-dark" data-mode="dark">
.theme-botanical-dark    | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-botanical-dark" data-mode="dark">
.theme-clay-studio-dark  | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-clay-studio-dark" data-mode="dark">
.theme-solaris-dark      | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-solaris-dark" data-mode="dark">
.theme-cyberpunk-day-dark | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-cyberpunk-day-dark" data-mode="dark">
.theme-copper-patina-dark | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-copper-patina-dark" data-mode="dark">
.theme-lagoona-light     | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-lagoona-light" data-mode="light">
.theme-frozen-light      | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-frozen-light" data-mode="light">
.theme-night-light       | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-night-light" data-mode="light">
.theme-inkworm-light     | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-inkworm-light" data-mode="light">
.theme-fouram-light      | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-fouram-light" data-mode="light">
.theme-wintercame-light  | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-wintercame-light" data-mode="light">
.theme-console-light     | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-console-light" data-mode="light">
.theme-catppuccin-latte  | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-catppuccin-latte" data-mode="light">
.theme-nord-light        | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-nord-light" data-mode="light">
.theme-gruvbox-light     | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-gruvbox-light" data-mode="light">
.theme-onelight-pro      | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-onelight-pro" data-mode="light">
.theme-rose-pine-light   | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-rose-pine-light" data-mode="light">
.theme-midnight-emerald-light | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-midnight-emerald-light" data-mode="light">
.theme-obsidian-crimson-light | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-obsidian-crimson-light" data-mode="light">
.theme-synthwave-light   | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-synthwave-light" data-mode="light">
.theme-deep-ocean-light  | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-deep-ocean-light" data-mode="light">
.theme-amethyst-void-light | L0 | 22 colour tokens                                           | _00_themes.sass        | <html class="theme-amethyst-void-light" data-mode="light">
.box                     | L2 | .box component / container                                 | _03_containers.sass    | <div class="box">
.box.xcenter             | L2 | Modifier for .box                                          | _03_containers.sass    | <div class="box.xcenter">
.box.xleft               | L2 | Modifier for .box                                          | _03_containers.sass    | <div class="box.xleft">
.box.xright              | L2 | Modifier for .box                                          | _03_containers.sass    | <div class="box.xright">
.box.ycenter             | L2 | Modifier for .box                                          | _03_containers.sass    | <div class="box.ycenter">
.box.ytop                | L2 | Modifier for .box                                          | _03_containers.sass    | <div class="box.ytop">
.box.ybot                | L2 | Modifier for .box                                          | _03_containers.sass    | <div class="box.ybot">
.box.ybetween            | L2 | Modifier for .box                                          | _03_containers.sass    | <div class="box.ybetween">
.box.yevenly             | L2 | Modifier for .box                                          | _03_containers.sass    | <div class="box.yevenly">
.box.yaround             | L2 | Modifier for .box                                          | _03_containers.sass    | <div class="box.yaround">
.row                     | L2 | .row component / container                                 | _03_containers.sass    | <div class="row">
.row.xleft               | L2 | Modifier for .row                                          | _03_containers.sass    | <div class="row.xleft">
.row.xcenter             | L2 | Modifier for .row                                          | _03_containers.sass    | <div class="row.xcenter">
.row.xright              | L2 | Modifier for .row                                          | _03_containers.sass    | <div class="row.xright">
.row.xbetween            | L2 | Modifier for .row                                          | _03_containers.sass    | <div class="row.xbetween">
.row.xevenly             | L2 | Modifier for .row                                          | _03_containers.sass    | <div class="row.xevenly">
.row.xaround             | L2 | Modifier for .row                                          | _03_containers.sass    | <div class="row.xaround">
.row.ycenter             | L2 | Modifier for .row                                          | _03_containers.sass    | <div class="row.ycenter">
.row.ytop                | L2 | Modifier for .row                                          | _03_containers.sass    | <div class="row.ytop">
.row.ybot                | L2 | Modifier for .row                                          | _03_containers.sass    | <div class="row.ybot">
.grid                    | L2 | .grid component / container                                | _03_containers.sass    | <div class="grid">
.grid.center             | L2 | Modifier for .grid                                         | _03_containers.sass    | <div class="grid.center">
.grid.xcenter            | L2 | Modifier for .grid                                         | _03_containers.sass    | <div class="grid.xcenter">
.grid.xleft              | L2 | Modifier for .grid                                         | _03_containers.sass    | <div class="grid.xleft">
.grid.xright             | L2 | Modifier for .grid                                         | _03_containers.sass    | <div class="grid.xright">
.grid.xstretch           | L2 | Modifier for .grid                                         | _03_containers.sass    | <div class="grid.xstretch">
.grid.ycenter            | L2 | Modifier for .grid                                         | _03_containers.sass    | <div class="grid.ycenter">
.grid.ytop               | L2 | Modifier for .grid                                         | _03_containers.sass    | <div class="grid.ytop">
.grid.ybot               | L2 | Modifier for .grid                                         | _03_containers.sass    | <div class="grid.ybot">
.grid.ystretch           | L2 | Modifier for .grid                                         | _03_containers.sass    | <div class="grid.ystretch">
.grid.xbetween           | L2 | Modifier for .grid                                         | _03_containers.sass    | <div class="grid.xbetween">
.grid.xevenly            | L2 | Modifier for .grid                                         | _03_containers.sass    | <div class="grid.xevenly">
.grid.xaround            | L2 | Modifier for .grid                                         | _03_containers.sass    | <div class="grid.xaround">
.grid.ybetween           | L2 | Modifier for .grid                                         | _03_containers.sass    | <div class="grid.ybetween">
.grid.yevenly            | L2 | Modifier for .grid                                         | _03_containers.sass    | <div class="grid.yevenly">
.grid.yaround            | L2 | Modifier for .grid                                         | _03_containers.sass    | <div class="grid.yaround">
.wrap                    | L2 | .wrap component / container                                | _03_containers.sass    | <div class="wrap">
.grow                    | L2 | .grow component / container                                | _03_containers.sass    | <div class="grow">
.shrink-0                | L2 | .shrink-0 component / container                            | _03_containers.sass    | <div class="shrink-0">
.relative                | L2 | .relative component / container                            | _03_containers.sass    | <div class="relative">
.absolute                | L2 | .absolute component / container                            | _03_containers.sass    | <div class="absolute">
.fixed                   | L2 | .fixed component / container                               | _03_containers.sass    | <div class="fixed">
.sticky                  | L2 | .sticky component / container                              | _03_containers.sass    | <div class="sticky">
.grid-1                  | L3 | .grid-1 component / container                              | _04_layouts.sass       | <div class="grid-1">
.grid-2                  | L3 | .grid-2 component / container                              | _04_layouts.sass       | <div class="grid-2">
.grid-3                  | L3 | .grid-3 component / container                              | _04_layouts.sass       | <div class="grid-3">
.grid-4                  | L3 | .grid-4 component / container                              | _04_layouts.sass       | <div class="grid-4">
.grid-6                  | L3 | .grid-6 component / container                              | _04_layouts.sass       | <div class="grid-6">
.card-grid               | L3 | .card-grid component / container                           | _04_layouts.sass       | <div class="card-grid">
.prose                   | L3 | .prose component / container                               | _04_layouts.sass       | <div class="prose">
.reel                    | L3 | .reel component / container                                | _04_layouts.sass       | <div class="reel">
.app-shell               | L4 | .app-shell component / container                           | _05_shells.sass        | <div class="app-shell">
.app-header              | L4 | .app-header component / container                          | _05_shells.sass        | <div class="app-header">
.app-main                | L4 | .app-main component / container                            | _05_shells.sass        | <div class="app-main">
.main-section            | L4 | .main-section component / container                        | _05_shells.sass        | <div class="main-section">
.sidebar-left            | L4 | ,                                                          | _05_shells.sass        | <div class="sidebar-left">
.sidebar-right           | L4 | .sidebar-right component / container                       | _05_shells.sass        | <div class="sidebar-right">
.sidebar-left            | L4 | .sidebar-left component / container                        | _05_shells.sass        | <div class="sidebar-left">
.sidebar-right           | L4 | .sidebar-right component / container                       | _05_shells.sass        | <div class="sidebar-right">
.sidebar-left            | L4 | Required child of .sidebar-right — see canonical-markups.md | _05_shells.sass        | <div class="sidebar-left">
.sidebar-right           | L4 | Required child of .sidebar-right — see canonical-markups.md | _05_shells.sass        | <div class="sidebar-right">
.content-shell           | L4 | .content-shell component / container                       | _05_shells.sass        | <div class="content-shell">
.app-footer              | L4 | .app-footer component / container                          | _05_shells.sass        | <div class="app-footer">
.mobile-toc              | L4 | .mobile-toc component / container                          | _05_shells.sass        | <div class="mobile-toc">
.navtree                 | L4 | .navtree component / container                             | _05_shells.sass        | <div class="navtree">
.navtree-title           | L4 | .navtree-title component / container                       | _05_shells.sass        | <div class="navtree-title">
.navtree-link            | L4 | .navtree-link component / container                        | _05_shells.sass        | <div class="navtree-link">
.navtree-link.active     | L4 | Modifier for .navtree-link                                 | _05_shells.sass        | <div class="navtree-link.active">
.navtree-sub             | L4 | .navtree-sub component / container                         | _05_shells.sass        | <div class="navtree-sub">
.toc                     | L4 | .toc component / container                                 | _05_shells.sass        | <div class="toc">
.toc-title               | L4 | .toc-title component / container                           | _05_shells.sass        | <div class="toc-title">
.toc-list                | L4 | .toc-list component / container                            | _05_shells.sass        | <div class="toc-list">
.toc-link                | L4 | .toc-link component / container                            | _05_shells.sass        | <div class="toc-link">
.toc-link.active         | L4 | Modifier for .toc-link                                     | _05_shells.sass        | <div class="toc-link.active">
.toc-footer              | L4 | .toc-footer component / container                          | _05_shells.sass        | <div class="toc-footer">
.tab-list                | L4 | .tab-list component / container                            | _05_shells.sass        | <div class="tab-list">
.tab-trigger             | L4 | .tab-trigger component / container                         | _05_shells.sass        | <div class="tab-trigger">
.tab-trigger.active      | L4 | Modifier for .tab-trigger                                  | _05_shells.sass        | <div class="tab-trigger.active">
.page-shell              | L4 | .page-shell component / container                          | _05_shells.sass        | <div class="page-shell">
.page-split              | L4 | .page-split component / container                          | _05_shells.sass        | <div class="page-split">
.page-main               | L4 | Required child of .page-split — see canonical-markups.md   | _05_shells.sass        | <div class="page-main">
.page-sidebar            | L4 | Required child of .page-split — see canonical-markups.md   | _05_shells.sass        | <div class="page-sidebar">
.drawer                  | L4 | .drawer component / container                              | _05_shells.sass        | <div class="drawer">
.drawer.open             | L4 | Modifier for .drawer                                       | _05_shells.sass        | <div class="drawer.open">
.dialog                  | L4 | .dialog component / container                              | _05_shells.sass        | <div class="dialog">
.dialog.open             | L4 | ,                                                          | _05_shells.sass        | <div class="dialog.open">
.popover                 | L4 | .popover component / container                             | _05_shells.sass        | <div class="popover">
.popover.open            | L4 | Modifier for .popover                                      | _05_shells.sass        | <div class="popover.open">
.accordion               | L4 | .accordion component / container                           | _05_shells.sass        | <div class="accordion">
.accordion-item          | L4 | .accordion-item component / container                      | _05_shells.sass        | <div class="accordion-item">
.accordion-content       | L4 | Required child of .accordion-item — see canonical-markups.md | _05_shells.sass        | <div class="accordion-content">
.accordion-panel         | L4 | Required child of .accordion-item — see canonical-markups.md | _05_shells.sass        | <div class="accordion-panel">
.accordion-item.open     | L4 | .accordion-content                                         | _05_shells.sass        | <div class="accordion-item.open">
.accordion-trigger       | L4 | .accordion-trigger component / container                   | _05_shells.sass        | <div class="accordion-trigger">
.hero                    | L4 | .hero component / container                                | _05_shells.sass        | <div class="hero">
.bg                      | L5 | .bg component / container                                  | _06_visuals.sass       | <div class="bg">
.surface                 | L5 | .surface component / container                             | _06_visuals.sass       | <div class="surface">
.raised                  | L5 | .raised component / container                              | _06_visuals.sass       | <div class="raised">
.panel                   | L5 | .panel component / container                               | _06_visuals.sass       | <div class="panel">
.footer                  | L5 | .footer component / container                              | _06_visuals.sass       | <div class="footer">
.canvas                  | L5 | .canvas component / container                              | _06_visuals.sass       | <div class="canvas">
.terminal                | L5 | .terminal component / container                            | _06_visuals.sass       | <div class="terminal">
.text-primary            | L5 | .text-primary component / container                        | _06_visuals.sass       | <div class="text-primary">
.text-secondary          | L5 | .text-secondary component / container                      | _06_visuals.sass       | <div class="text-secondary">
.text-muted              | L5 | .text-muted component / container                          | _06_visuals.sass       | <div class="text-muted">
.text-inverse            | L5 | .text-inverse component / container                        | _06_visuals.sass       | <div class="text-inverse">
.text-theme              | L5 | .text-theme component / container                          | _06_visuals.sass       | <div class="text-theme">
.text-success            | L5 | .text-success component / container                        | _06_visuals.sass       | <div class="text-success">
.text-warning            | L5 | .text-warning component / container                        | _06_visuals.sass       | <div class="text-warning">
.text-danger             | L5 | .text-danger component / container                         | _06_visuals.sass       | <div class="text-danger">
.text-info               | L5 | .text-info component / container                           | _06_visuals.sass       | <div class="text-info">
.bg-success              | L5 | .bg-success component / container                          | _06_visuals.sass       | <div class="bg-success">
.bg-warning              | L5 | .bg-warning component / container                          | _06_visuals.sass       | <div class="bg-warning">
.bg-danger               | L5 | .bg-danger component / container                           | _06_visuals.sass       | <div class="bg-danger">
.bg-info                 | L5 | .bg-info component / container                             | _06_visuals.sass       | <div class="bg-info">
.border                  | L5 | .border component / container                              | _06_visuals.sass       | <div class="border">
.border-subtle           | L5 | .border-subtle component / container                       | _06_visuals.sass       | <div class="border-subtle">
.border-top              | L5 | .border-top component / container                          | _06_visuals.sass       | <div class="border-top">
.border-right            | L5 | .border-right component / container                        | _06_visuals.sass       | <div class="border-right">
.border-bottom           | L5 | .border-bottom component / container                       | _06_visuals.sass       | <div class="border-bottom">
.border-left             | L5 | .border-left component / container                         | _06_visuals.sass       | <div class="border-left">
.text-xs                 | L5 | .text-xs component / container                             | _06_visuals.sass       | <div class="text-xs">
.text-sm                 | L5 | .text-sm component / container                             | _06_visuals.sass       | <div class="text-sm">
.text-md                 | L5 | .text-md component / container                             | _06_visuals.sass       | <div class="text-md">
.text-lg                 | L5 | .text-lg component / container                             | _06_visuals.sass       | <div class="text-lg">
.text-xl                 | L5 | .text-xl component / container                             | _06_visuals.sass       | <div class="text-xl">
.text-2xl                | L5 | .text-2xl component / container                            | _06_visuals.sass       | <div class="text-2xl">
.text-3xl                | L5 | .text-3xl component / container                            | _06_visuals.sass       | <div class="text-3xl">
.text-4xl                | L5 | .text-4xl component / container                            | _06_visuals.sass       | <div class="text-4xl">
.weight-400              | L5 | .weight-400 component / container                          | _06_visuals.sass       | <div class="weight-400">
.weight-500              | L5 | .weight-500 component / container                          | _06_visuals.sass       | <div class="weight-500">
.weight-600              | L5 | .weight-600 component / container                          | _06_visuals.sass       | <div class="weight-600">
.weight-700              | L5 | .weight-700 component / container                          | _06_visuals.sass       | <div class="weight-700">
.mono                    | L5 | .mono component / container                                | _06_visuals.sass       | <div class="mono">
.tt-u                    | L5 | .tt-u component / container                                | _06_visuals.sass       | <div class="tt-u">
.tt-c                    | L5 | .tt-c component / container                                | _06_visuals.sass       | <div class="tt-c">
.truncate                | L5 | .truncate component / container                            | _06_visuals.sass       | <div class="truncate">
.clamp-1                 | L5 | .clamp-1 component / container                             | _06_visuals.sass       | <div class="clamp-1">
.clamp-2                 | L5 | .clamp-2 component / container                             | _06_visuals.sass       | <div class="clamp-2">
.clamp-3                 | L5 | .clamp-3 component / container                             | _06_visuals.sass       | <div class="clamp-3">
.eyebrow                 | L5 | .eyebrow component / container                             | _06_visuals.sass       | <div class="eyebrow">
.card                    | L5 | .card component / container                                | _06_visuals.sass       | <div class="card">
.field                   | L5 | .field component / container                               | _06_visuals.sass       | <div class="field">
.field-label             | L5 | .field-label component / container                         | _06_visuals.sass       | <div class="field-label">
.field-error             | L5 | .field-error component / container                         | _06_visuals.sass       | <div class="field-error">
.avatar                  | L5 | .avatar component / container                              | _06_visuals.sass       | <div class="avatar">
.divider                 | L5 | .divider component / container                             | _06_visuals.sass       | <div class="divider">
.kbd                     | L5 | .kbd component / container                                 | _06_visuals.sass       | <div class="kbd">
.switch-track            | L5 | .switch-track component / container                        | _06_visuals.sass       | <div class="switch-track">
.switch-thumb            | L5 | .switch-thumb component / container                        | _06_visuals.sass       | <div class="switch-thumb">
.switch-track            | L5 | [aria-checked='true'],                                     | _06_visuals.sass       | <div class="switch-track">
.switch-track            | L5 | .checked                                                   | _06_visuals.sass       | <div class="switch-track">
.switch-thumb            | L5 | Required child of .switch-track — see canonical-markups.md | _06_visuals.sass       | <div class="switch-thumb">
.hide-mobile             | L5 | .hide-mobile component / container                         | _06_visuals.sass       | <div class="hide-mobile">
.hide-desktop            | L5 | .hide-desktop component / container                        | _06_visuals.sass       | <div class="hide-desktop">
.only-mobile             | L5 | .only-mobile component / container                         | _06_visuals.sass       | <div class="only-mobile">
.shadow-sm               | L5 | .shadow-sm component / container                           | _06_visuals.sass       | <div class="shadow-sm">
.shadow-md               | L5 | .shadow-md component / container                           | _06_visuals.sass       | <div class="shadow-md">
.shadow-lg               | L5 | .shadow-lg component / container                           | _06_visuals.sass       | <div class="shadow-lg">
.badge                   | L5 | .badge component / container                               | _07_interactions.sass  | <div class="badge">
.input                   | L5 | .input component / container                               | _07_interactions.sass  | <div class="input">
.select                  | L5 | .select component / container                              | _07_interactions.sass  | <div class="select">
.link                    | L5 | .link component / container                                | _07_interactions.sass  | <div class="link">
.link-plain              | L5 | .link-plain component / container                          | _07_interactions.sass  | <div class="link-plain">
.link-parent             | L5 | .link-parent component / container                         | _07_interactions.sass  | <div class="link-parent">
.link-plain              | L5 | Required child of .link-parent — see canonical-markups.md  | _07_interactions.sass  | <div class="link-plain">
.button                  | L5 | .button component / container                              | _07_interactions.sass  | <div class="button">
.button.primary          | L5 | Modifier for .button                                       | _07_interactions.sass  | <div class="button.primary">
.button.ghost            | L5 | Modifier for .button                                       | _07_interactions.sass  | <div class="button.ghost">
.button.active           | L5 | Modifier for .button                                       | _07_interactions.sass  | <div class="button.active">
.button.is-icon          | L5 | Modifier for .button                                       | _07_interactions.sass  | <div class="button.is-icon">
```

---

## Semantic Token Variables

```css
:root {
  --bg: #fdfefe;
  --bg-surface: #f8f7f7;
  --bg-raised: #f1f5f9;
  --bg-panel: #F1F3F5;
  --bg-footer: #E9ECEF;
  --bg-popover: #FFFFFF;
  --bg-dialog: #FFFFFF;
  --bg-terminal: #0F172A;
  --bg-input: #FFFFFF;
  --bg-canvas: #F8F9FA;
  --text-primary: #0f172a;
  --text-secondary: #5b6472;
  --text-muted: #929497;
  --text-inverse: #ffffff;
  --state-hover: #E2E8F0;
  --state-hover-subtle: #F1F5F9;
  --state-selected: #CBD5E1;
  --border: #E2E8F0;
  --border-subtle: #EDF2F7;
  --theme-color: #04825B;
  --theme-color-alt: #047857;
  --success: #10B981;
  --success-hover: #059669;
  --warning: #F59E0B;
  --warning-hover: #D97706;
  --danger: #EF4444;
  --danger-hover: #DC2626;
  --info: #3B82F6;
  --info-hover: #2563EB;
  --feedback-error: #DC2626;
  --ring: rgba(0, 127, 78, 0.35);
  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 4px 12px rgba(15, 23, 42, 0.08);
  --shadow-lg: 0 12px 32px rgba(15, 23, 42, 0.12);
  --font-sans: "Google Sans Flex", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  --text-xs: 0.75rem;
  --text-sm: clamp(0.9375rem, 0.9119rem + 0.1136vw, 1rem);
  --text-md: clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem);
  --text-lg: clamp(1.35rem, 1.2631rem + 0.3864vw, 1.5625rem);
  --text-xl: clamp(1.62rem, 1.4837rem + 0.6057vw, 1.9531rem);
  --text-2xl: clamp(1.944rem, 1.7405rem + 0.9044vw, 2.4414rem);
  --text-3xl: clamp(2.3328rem, 2.0387rem + 1.3072vw, 3.0518rem);
  --text-4xl: clamp(2.7994rem, 2.384rem + 1.8461vw, 3.8147rem);
  --space-3xs: clamp(0.3125rem, 0.3125rem + 0vw, 0.3125rem);
  --space-2xs: clamp(0.5625rem, 0.5369rem + 0.1136vw, 0.625rem);
  --space-xs: clamp(0.875rem, 0.8494rem + 0.1136vw, 0.9375rem);
  --space-sm: clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem);
  --space-md: clamp(1.6875rem, 1.6108rem + 0.3409vw, 1.875rem);
  --space-lg: clamp(2.25rem, 2.1477rem + 0.4545vw, 2.5rem);
  --space-xl: clamp(3.375rem, 3.2216rem + 0.6818vw, 3.75rem);
  --space-2xl: clamp(4.5rem, 4.2955rem + 0.9091vw, 5rem);
  --space-3xl: clamp(6.75rem, 6.4432rem + 1.3636vw, 7.5rem);
  --radius-0: 0;
  --radius-2: 2px;
  --radius-3: 3px;
  --radius-4: 4px;
  --radius-6: 6px;
  --radius-8: 8px;
  --radius-12: 12px;
  --radius-16: 16px;
  --radius-24: 24px;
  --radius-full: 9999px;
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --motion-fast: 120ms;
  --motion-base: 160ms;
  --motion-slow: 240ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --control-h-sm: 26px;
  --control-h-md: 32px;
  --control-h-lg: 38px;
  --z-base: 0;
  --z-raised: 10;
  --z-sticky: 100;
  --z-modal: 200;
  --z-toast: 300;
  --header-height: 48px;
  --footer-height: 32px;
  --measure: 65ch;
  --page-gutter: clamp(1rem, 4vw, 2rem);
  --sidebar-width: 260px;
  --toc-width: 240px;
  --card-min: 16rem;
  --breakpoint: 768px;
  --gap-scale: 0.85;
  --pad-scale: 0.7;
}
```
