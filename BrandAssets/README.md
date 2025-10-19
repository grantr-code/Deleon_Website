Brand Assets
============

This folder holds original, non-compiled brand artwork and legacy exports that are not bundled into the app at build time.

- Source SVG: `Design/BrandAssets/Deleon_Logo.svg`
- Legacy iOS bitmap exports: `Design/BrandAssets/Legacy iOS Exports/iOS icons (Deleon_Logo)`

In‑App Asset Usage
------------------

- The app uses a single‑scale PDF asset for the logo at `DeleonConnect/DeleonConnect/Assets.xcassets/Logo.imageset/Logo.pdf` with `preserves-vector-representation` enabled.
- To update the logo with a true vector:
  1. Export `Logo.pdf` from your design tool (Figma/Sketch/Illustrator) at 1×.
  2. Replace the file at: `DeleonConnect/DeleonConnect/Assets.xcassets/Logo.imageset/Logo.pdf`.
  3. Build the project; no code changes required.

Notes
-----

- App icons have been imported into `Assets.xcassets/AppIcon.appiconset` and should be managed from Xcode.
- The files under `Legacy iOS Exports` are retained for reference and are not used by the build.
