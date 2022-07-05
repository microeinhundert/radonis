# Changelog

All notable changes to this project will be documented in this file.

## [1.7.2] - WIP

### Changed
- Renamed `--watch-dir` flag to `--watch`. `--watch-dir` will continue to work.
- Updated dependencies.

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

