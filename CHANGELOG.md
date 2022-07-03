# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

