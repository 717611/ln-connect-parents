# Real LN branding on the login screen

Swap the generated placeholders for the two uploaded assets — the school building photo and the official crest — without touching the login layout, card, type, buttons, spacing, or animations.

## Assets

- Upload both files to CDN-backed assets and reference them via pointer files (`login-school.jpg`, `ln-logo.png`), so the repo stays light and images are served compressed and cached.
- Building photo: resized/compressed to a mobile-friendly size, kept at its original aspect ratio.
- Crest: kept transparent, uncropped, unrecolored.
- Delete the old generated `login-school.jpg` and `ln-logo.png` so no placeholder artwork remains.
- Regenerate `public/favicon.png` / `favicon.ico` from the real crest.

## Login hero treatment

Keep the existing structure (one full-bleed image plus overlay layers), only refine the treatment:

- Image stays `object-cover`, full-screen, no stretching, with the building recognizable; slight scale to avoid blur edge bleed.
- Very light blur only (kept minimal so the school stays identifiable), plus a small brightness/saturation reduction.
- Navy overlay around 50% opacity, layered with a subtle vertical gradient (lighter at the top over the building, deeper toward the bottom behind the form) so the white card and text stay high-contrast.
- No text or graphics drawn over the photo itself — all copy remains in the existing blocks.
- Decorative background image marked non-semantic; the crest keeps a descriptive alt.

## Logo usage

- Login screen crest swaps to the official logo at the same size box, aspect ratio preserved via `object-contain`.
- The shared `ASSETS.lnLogo` entry is the single source, so any other branding spot (header, splash) picks up the real crest automatically.

## Technical notes

- Files touched: `src/assets/index.ts` (pointer imports), `src/routes/index.tsx` (overlay/filter classes and image attributes only), new `.asset.json` pointers, favicon files.
- No changes to form logic, auth, routing, or any other screen.
