---
name: refactor-template-module
description: Use this skill when refactoring a template module in OCTemplate such as akRecruit or luoxiaohei. It guides extracting shared layout logic, shrinking page components into composition layers, centralizing editor state in a hook, keeping config files static, and preserving preview/export consistency and browser/mobile safety.
---

# Template Module Refactor

Use this skill when a template module has started mixing page state, layout math, preview rendering, and export code in ways that hurt readability or maintainability.

This skill is optimized for OCTemplate modules that follow the pattern:

- `xxxPage.tsx`
- `xxxConfig.ts`
- `xxxPreview.tsx`
- `xxxPoster.ts`
- `xxxToolbar.tsx`
- `xxxCanvas.tsx`
- `useXxxImageTransform.ts`

Typical targets include `akRecruit` and future sibling templates.

## Refactor goals

- Keep preview and export visually consistent
- Preserve the existing UI and behavior unless the task explicitly asks for UX changes
- Reduce cross-file coupling
- Make page files thin
- Keep config files static
- Avoid adding new libraries
- Maintain browser and mobile compatibility

## Desired module boundaries

Prefer this structure when the module has enough complexity to justify it:

- `xxxPage.tsx`
  - Route page
  - Layout shell
  - Wires toolbar, canvas, preview
  - Should not own long `useEffect` chains

- `useXxxEditor.ts`
  - Owns editor state and side effects
  - File upload validation
  - Object URL lifecycle
  - Image metadata loading
  - Async recommendation/extraction work
  - Export loading state
  - Export click handler

- `xxxConfig.ts`
  - Template constants
  - Types
  - Default form state
  - Asset maps
  - Template spec
  - No layout math unless the logic is truly static and trivial

- `xxxLayout.ts`
  - Shared pure calculations only
  - Image layout
  - Text layout
  - Shared formatting helpers
  - Values consumed by both preview and export

- `xxxPreview.tsx`
  - Renders the poster preview
  - May consume `useXxxImageTransform`
  - Should depend on `Config + Layout + interaction hook`
  - Should not import shared layout helpers from `xxxPoster.ts`

- `xxxPoster.ts`
  - Export pipeline only
  - Resource loading
  - Canvas drawing
  - Blob export
  - Can contain canvas-specific draw helpers
  - Should import shared layout rules from `xxxLayout.ts`

## Recommended refactor order

Use this order unless there is a strong reason not to:

1. Read the current module end to end before editing
2. Identify which logic is static config, pure layout, page state, preview-only UI, and export-only drawing
3. Create `xxxLayout.ts` and move pure shared calculations first
4. Shrink `xxxConfig.ts` into a static-definition file
5. Shrink `xxxPoster.ts` into an export entry file
6. Create `useXxxEditor.ts` and move page state plus side effects into it
7. Update `xxxPage.tsx` to become a composition layer
8. Clean up `xxxPreview.tsx` so it only depends on the right boundaries
9. Run build validation after each major step

## What belongs in layout vs poster

Move code into `xxxLayout.ts` when it is:

- Pure
- Shared by preview and export
- About positions, sizes, line breaking, formatted display values, or text measurement policy

Keep code in `xxxPoster.ts` when it is:

- Tied to canvas APIs
- About resource loading
- About turning the prepared scene into a file

Good examples for `xxxLayout.ts`:

- `getBaseImageLayout`
- `getImageRenderLayout`
- `getPosterLayout`
- `wrapIntroLines`
- `formatRgbLabel`

Good examples for `xxxPoster.ts`:

- `loadImageWithLabel`
- `ensureFontsLoaded`
- `drawVerticalTitle`
- `drawMetaText`
- `exportXxxImage`

## Page component standard

After refactor, the page should mostly read like:

1. Call `useXxxEditor()`
2. Render `AppLayout`
3. Render desktop toolbar
4. Render canvas + preview
5. Render mobile drawer toolbar

If the page still contains multiple state variables, object URL cleanup, async loading effects, and export orchestration, the refactor is incomplete.

## Preview/export consistency rules

Always preserve these rules:

- Preview is not the export source
- Export must redraw on canvas from shared rules
- Shared visual rules must come from `xxxTemplateSpec` and `xxxLayout.ts`
- Preview should not hide critical export rules inside Tailwind-only styling
- If a text rule affects the final image, it must be explicit in spec or layout helpers

## Performance and memory safety checklist

Check these during refactor:

- Revoke old `ObjectURL`s when replacing uploaded images
- Revoke `ObjectURL`s on unmount
- Cancel or guard async image-analysis callbacks so old tasks do not write into new state
- Cache font loading with a singleton promise
- Prefer `canvas.toBlob()` plus `URL.createObjectURL()` over `canvas.toDataURL()`
- Revoke export download URLs after click
- Avoid preview importing logic back from `xxxPoster.ts`

## Validation checklist

Run build validation after the refactor.

Also manually verify:

- Upload image
- Replace image multiple times
- Drag image
- Change form fields
- Export image
- Mobile drawer still opens and updates preview
- Export result still matches preview closely

## Notes for akRecruit

When applying this skill to `akRecruit`, pay special attention to:

- Moving image layout helpers out of `akRecruitConfig.ts`
- Moving text wrapping and info-row layout helpers out of `akRecruitPoster.ts`
- Extracting editor state from `akRecruitPage.tsx`
- Replacing export `dataURL` flow with `Blob + objectURL`
- Keeping profession, organization, rarity, and text layout consistent between preview and export
