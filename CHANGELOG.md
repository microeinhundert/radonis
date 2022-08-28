# Changelog

All notable changes to this project will be documented in this file.

## [1.8.1] - 2022-08-28

### Changed
- BREAKING: Removed `addData` from the HeadManager in favor of `addTags`. `addTags` expects a configuration object instead of a plain string.
- BREAKING: Renamed `withMeta` on the Radonis contract to `withHeadMeta`.

## [1.8.0] - 2022-08-27

### Changed
- BREAKING: Radonis now uses the automatic JSX transform.

### Migration

- Set `jsx` inside `tsconfig.json` to `react-jsx` and remove `React` imports from your codebase.

## [1.7.4] - 2022-08-27

### Added
- Props passed to hydrated components can now contain non-serializable data (uses [superjson](https://github.com/blitz-js/superjson) under the hood).

### Changed
- Updated dependencies.

## [1.7.3] - 2022-07-31

### Changed
- Updated dependencies.

## [1.7.2] - 2022-07-05

### Changed
- Renamed `--watch-dir` flag to `--watch`. `--watch-dir` will continue to work.
- Updated dependencies.
- Internal refinements.

### Fixed
- Edge case in compiler when default export name does not equal component file name.

## [1.7.1] - 2022-07-04

### Changed
- Removed unused `path` property from build manifest.
- Removed `bg-gray-100` class from `body` element.
- Updated dependencies.
- Small refactorings of the compiler.

## [1.7.0] - 2022-07-03

### Fixed
- The `publicPath` in the generated buildManifest is now valid on Windows.

### Changed
- BREAKING: Removed the `outputDir` option from config. See below for migration. The output dir is now automatically red from `.adonisrc.json` and falls back to `public` if not set.
- BREAKING: Removed `--types-output-dir` and `--output-dir` flags from the `build:client` Ace command. The types are now always output to `tmp/types` if not building for production.
- Removed `tx` template literal minification from Twind plugin.

### Migration

- Remove `outputDir` from `config/radonis.ts`.
- Replace the `dev:client` and `build:client` scripts in `package.json` with the following two scripts:

```json
{
  "scripts": {
    "dev:client": "node ace build:client --watch-dir './resources/!(views)/**/*.ts(x)?'",
    "build:client": "node ace build:client --production",
  },
}
```

