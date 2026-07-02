# Fancam Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the `/fancam` image template with canvas preview, uploaded character positioning, fixed 1920x1080 PNG export, and home page entry.

**Architecture:** Follow the current `br` template shape: a thin page composes toolbar, viewport, canvas, and export action; `useFancamEditor` owns form state and object URLs; preview and export both call the same canvas renderer. Template-specific constants, asset maps, and visual numbers stay in `fancamConfig.ts` and pure helpers stay in `fancamLayout.ts`.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui components, browser Canvas API.

---

### Task 1: Structure And Resources

**Files:**
- Create: `src/assets/fancam/`
- Create: `src/styles/fancam-fonts.css`
- Create: `src/components/fancam/fancamConfig.ts`
- Create: `src/components/fancam/fancamResources.ts`
- Modify: `src/data/templateList.ts`
- Modify: `src/data/siteMetadata.ts`
- Modify: `src/app/routes.tsx`

- [ ] Copy `temp_assets/mbc_front.webp`, `effect_01.webp`, `effect_02.webp`, `effect_03.webp`, `ChironGoRoundTC-Bold.ttf`, and `ChironGoRoundTC-Medium.ttf` into `src/assets/fancam/`.
- [ ] Define `@font-face` rules for Chiron GoRound TC fonts in `src/styles/fancam-fonts.css`.
- [ ] Define `FancamFormState`, initial values, accepted image types, max upload sizes, effect/template options, text limits, drag defaults, and `fancamTemplateSpec`.
- [ ] Add resource loading helpers with image Promise cache, font loading Promise, and object URL disposal.
- [ ] Add the lazy route `/fancam`, SEO metadata, and a home card description: `生成舞台直拍风格封面，替换立绘、背景、装饰和演出信息后导出横版 PNG。`

### Task 2: Layout And Renderer

**Files:**
- Create: `src/components/fancam/fancamLayout.ts`
- Create: `src/components/fancam/fancamRenderer.ts`
- Create: `src/components/fancam/fancamPoster.ts`

- [ ] Implement contain display sizing for a 16:9 canvas.
- [ ] Implement cover-image source rectangle calculation for background uploads.
- [ ] Implement character render rect from image dimensions, scale, and canvas-space offset.
- [ ] Draw layers in order: background color, optional background image, optional effect, optional character clipped to canvas, MBC foreground template, MBC text.
- [ ] Render MBC text using Chiron fonts, white fill, semi-transparent black stroke, and black shadow matching the requirement.
- [ ] Export via an independent 1920x1080 canvas and `canvas.toBlob()`.

### Task 3: Editor, Toolbar, Canvas, Page

**Files:**
- Create: `src/components/fancam/useFancamEditor.ts`
- Create: `src/components/fancam/fancamToolbar.tsx`
- Create: `src/components/fancam/fancamViewport.tsx`
- Create: `src/components/fancam/fancamCanvas.tsx`
- Create: `src/pages/fancamPage.tsx`

- [ ] Manage form state, character/background uploads, validation messages, font readiness, and export loading in `useFancamEditor`.
- [ ] Revoke old object URLs on replacement and current object URLs on unmount.
- [ ] Render toolbar tabs for character, style, and basic info.
- [ ] Support character scale slider from `0.5` to `2`.
- [ ] Support pointer drag on the preview canvas, translating screen movement back into canvas-space character offset.
- [ ] Compose the page like `brPage`, with desktop sidebar and mobile drawer.

### Task 4: Verification

**Files:**
- All files above.

- [ ] Run `npm run build`.
- [ ] Fix TypeScript or Vite build failures.
- [ ] Confirm remaining known gaps: background crop dialog is not implemented in this phase; background upload uses cover drawing.

