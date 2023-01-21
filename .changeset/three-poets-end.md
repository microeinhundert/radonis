---
'@microeinhundert/radonis': major
---

The way hydration works has been reworked. Defining islands (hydratable components) and client entry files is now done by convention rather than configuration.
This change comes with a few small migration steps, outlined below.

**In short**:
- Rename `hydratable` to `island`
- Suffix files containing islands with `.island.<ext>`
- Remove `entryFile`, `alwaysIncludeEntryFile` and `componentsDir` from `config/radonis.ts`.

**More in depth:**
- The `hydratable` function, which wraps all your hydratable components, has been renamed to `island`. Also, all files containing islands must now end with `.island.<ext>`, which means that a file currently named `Button.tsx` must now be named `Button.island.tsx` for the compiler to pick up islands defined in those files. These changes also fix some edge cases that were present in previous versions of Radonis: A single file can now contain multiple islands. The only requirements are that islands must be contained within `.islands.<ext>` files, be wrapped with `island` and have a unique identifier passed as the first argument to the `island` call.
- All files ending in `.client.<ext>` are now considered to be entry files for the client bundle. This means that the client entry file (by default `entry.client.ts`) can be located anywhere and named anything you like, as long as it's in the `resources` directory. This also means that you can have multiple client entry files.

Because of these changes, `entryFile`, `alwaysIncludeEntryFile` and `componentsDir` in `config/radonis.ts` can be removed.

