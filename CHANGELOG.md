# Changelog

All notable changes to this project will be documented in this file.

## [1.9.3] - 2022-09-20

### Fixed
- Error because of wrong folder casing on non Unix systems.

## [1.9.2] - 2022-09-20

### Changed
- BREAKING: Removed `ExtractControllerActionReturnType` type utility.

### Fixed
- Type generation. Learn more in the [docs](https://radonis.vercel.app/docs/type-generation).

## [1.9.1] - 2022-09-15

### Changed
- Improvements to the experimental `query` plugin.

## [1.9.0] - 2022-09-14

### Added
- New experimental `query` plugin. Docs coming soon.
- `beforeRequest` and `afterRequest` hooks to plugin API.

### Changed
- Requests to an endpoint rendering a view will now return the view's props as JSON when the `accept=application/json` header is present on the request.
- Updated dependencies.

## [1.8.9] - 2022-09-10

### Changed
- Updated dependencies.

## [1.8.8] - 2022-09-07

### Added
- Node.js environment variables prefixed with `PUBLIC_` are now available in the client bundle.

## [1.8.7] - 2022-09-07

### Changed
- BREAKING: The `useFormField` hook now takes a single props object as its only param.

### Fixed
- `onChange` and `onBlur` on form elements controlled by `useFormField` will now not be overridden, but merged.

## Migration
- Refer to the updated `useFormField` example in the [documentation](https://radonis.vercel.app/docs/guides/building-an-input-component).

## [1.8.6] - 2022-09-07

### Changed
- Improved code documentation.
- Updated dependencies.

## [1.8.5] - 2022-09-05

### Changed
- `useFormField` now always outputs the description, even if an error exists.
- Updated dependencies.

## [1.8.4] - 2022-08-28

### Added
- `hasAny` and `hasAnyError` to `useFlashMessages` hook.

### Changed
- BREAKING: The identifier parameter on `has` and `hasError` on the `useFlashMessages` hook is now required.

## [1.8.3] - 2022-08-28

### Changed
- Use superjson for serialization of the whole client manifest instead of just the props.

### Fixed
- Server manifest handled incorrectly with superjson serialization.

## [1.8.2] - 2022-08-28

### Fixed
- Publish due to problem with previous publish.

## [1.8.1] - 2022-08-28

### Changed
- BREAKING: Removed `addData` from the HeadManager in favor of `addTags`. `addTags` expects a configuration object instead of a plain string.
- BREAKING: Renamed `withMeta` on the Radonis contract to `withHeadMeta`.
- Updated dependencies.

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

