# @microeinhundert/radonis

## 5.0.3

### Patch Changes

- [`0ae9c17`](https://github.com/microeinhundert/radonis/commit/0ae9c17204b8e6d8d73532f93e5cf6e7a34c21d0) Thanks [@microeinhundert](https://github.com/microeinhundert)! - Fixed wrong paths in assets manifest for production build

- Updated dependencies [[`0ae9c17`](https://github.com/microeinhundert/radonis/commit/0ae9c17204b8e6d8d73532f93e5cf6e7a34c21d0)]:
  - @microeinhundert/radonis-server@5.0.3
  - @microeinhundert/radonis-shared@5.0.3
  - @microeinhundert/radonis-form@5.0.3
  - @microeinhundert/radonis-hooks@5.0.3
  - @microeinhundert/radonis-hydrate@5.0.3
  - @microeinhundert/radonis-types@5.0.3

## 5.0.2

### Patch Changes

- [`066c233`](https://github.com/microeinhundert/radonis/commit/066c2336696039a91cc1c9eed4da301872f3755c) Thanks [@microeinhundert](https://github.com/microeinhundert)! - Fixed assets manifest generation on windows

- Updated dependencies [[`066c233`](https://github.com/microeinhundert/radonis/commit/066c2336696039a91cc1c9eed4da301872f3755c)]:
  - @microeinhundert/radonis-shared@5.0.2
  - @microeinhundert/radonis-form@5.0.2
  - @microeinhundert/radonis-hooks@5.0.2
  - @microeinhundert/radonis-hydrate@5.0.2
  - @microeinhundert/radonis-server@5.0.2
  - @microeinhundert/radonis-types@5.0.2

## 5.0.1

### Patch Changes

- [`e76951c`](https://github.com/microeinhundert/radonis/commit/e76951c9f8ba49fc4d44ebfe473ad3203f245b3e) Thanks [@microeinhundert](https://github.com/microeinhundert)! - Update dependencies

- Updated dependencies [[`e76951c`](https://github.com/microeinhundert/radonis/commit/e76951c9f8ba49fc4d44ebfe473ad3203f245b3e)]:
  - @microeinhundert/radonis-form@5.0.1
  - @microeinhundert/radonis-hooks@5.0.1
  - @microeinhundert/radonis-hydrate@5.0.1
  - @microeinhundert/radonis-server@5.0.1
  - @microeinhundert/radonis-shared@5.0.1
  - @microeinhundert/radonis-types@5.0.1

## 5.0.0

### Major Changes

- [`97f238d`](https://github.com/microeinhundert/radonis/commit/97f238d51b34c58d9e4f024aefb97ef633bc38dd) Thanks [@microeinhundert](https://github.com/microeinhundert)! - Removed the undocumented `useFormField` hook.

- [`87c6921`](https://github.com/microeinhundert/radonis/commit/87c6921070d1923ce62e58c71fc56e29009ada71) Thanks [@microeinhundert](https://github.com/microeinhundert)! - Removed `allErrors`, `hasError`, `hasAnyError` and `getError` utility methods from the `useFlashMessages` hook. Use `all`, `has`, `hasAny` and `get` instead.

- [`1008ab5`](https://github.com/microeinhundert/radonis/commit/1008ab5e0d84b1ddb1ae294a51595af990efadd3) Thanks [@microeinhundert](https://github.com/microeinhundert)! - Revised the way static analysis is performed. Instead of extracting identifiers from specifically named snippets of code, Radonis now looks for any function call, object property or JSX property whose name ends with a dollar sign `$`. This has the advantage of simplifying static analysis and reducing edge cases, but also gives you more flexibility. Any function call, object property or JSX property in your codebase will now be statically analysed if it ends with a dollar sign. This convention also makes it clearer to the reader what is statically analysed and what is not.

  **Migration:**

  - `useI18n`: `formatMessage` -> `formatMessage$`
  - `useFlashMessages`: `get` -> `get$`, `has` -> `has$`
  - `useUrlBuilder`: `make` -> `make$`
  - `<Form>` and `useForm`: `action` -> `action$`
  - `useRoute`: `isCurrent` -> `isCurrent$`.

  See the [documentation](https://radonis.vercel.app/docs/compiler) to learn more.

- [`4f44646`](https://github.com/microeinhundert/radonis/commit/4f4464644115289466dd7a63c020634b4f3974e3) Thanks [@microeinhundert](https://github.com/microeinhundert)! - Renamed `fetch$` utility to `radonisFetch`.

### Minor Changes

- [`9a1fe5c`](https://github.com/microeinhundert/radonis/commit/9a1fe5c956c819eb9ea737bf7618ef9b77cf05ee) Thanks [@microeinhundert](https://github.com/microeinhundert)! - Changed default build script.

  **Migration:**
  Change the `build` script in `package.json` to `npm run build:server && npm run build:client"`. This ensures that the two build steps are performed in order.

- [`c7a59fb`](https://github.com/microeinhundert/radonis/commit/c7a59fb9023f7988672d2ce60446a5f8a1cd254b) Thanks [@microeinhundert](https://github.com/microeinhundert)! - Restricted buildOptions type.

- [`f8d2206`](https://github.com/microeinhundert/radonis/commit/f8d22063291a54a2d0e5a12108f86bbe9f5fccdb) Thanks [@microeinhundert](https://github.com/microeinhundert)! - Added `token$` utility function.

### Patch Changes

- Updated dependencies [[`4fbcc6c`](https://github.com/microeinhundert/radonis/commit/4fbcc6c1c34e36ae0438a10f0d465fd95347620f), [`3d5f284`](https://github.com/microeinhundert/radonis/commit/3d5f28423236654045be44e716186296b444fa35), [`5c00c86`](https://github.com/microeinhundert/radonis/commit/5c00c8633b241fad612289fd661c71e1b7a494f5), [`573a79b`](https://github.com/microeinhundert/radonis/commit/573a79b977f90ec51e9572eec86cb20eee628abb), [`4031b32`](https://github.com/microeinhundert/radonis/commit/4031b329506e0578893b243aee3737834eb5c566), [`9a1fe5c`](https://github.com/microeinhundert/radonis/commit/9a1fe5c956c819eb9ea737bf7618ef9b77cf05ee), [`97f238d`](https://github.com/microeinhundert/radonis/commit/97f238d51b34c58d9e4f024aefb97ef633bc38dd), [`c7a59fb`](https://github.com/microeinhundert/radonis/commit/c7a59fb9023f7988672d2ce60446a5f8a1cd254b), [`87c6921`](https://github.com/microeinhundert/radonis/commit/87c6921070d1923ce62e58c71fc56e29009ada71), [`fafe5ba`](https://github.com/microeinhundert/radonis/commit/fafe5ba3f4e83894b1c20670161ab2973fa9ed69), [`9f23f13`](https://github.com/microeinhundert/radonis/commit/9f23f13c592dd15a546831b035b704b5a81f2476), [`4f44646`](https://github.com/microeinhundert/radonis/commit/4f4464644115289466dd7a63c020634b4f3974e3), [`7663090`](https://github.com/microeinhundert/radonis/commit/7663090350d638d0d635f4d4ec13c7f04c191434)]:
  - @microeinhundert/radonis-form@5.0.0
  - @microeinhundert/radonis-hooks@5.0.0
  - @microeinhundert/radonis-types@5.0.0
  - @microeinhundert/radonis-shared@5.0.0
  - @microeinhundert/radonis-server@5.0.0
  - @microeinhundert/radonis-hydrate@5.0.0

## 4.0.2

### Patch Changes

- Updated dependencies [[`6522fb6`](https://github.com/microeinhundert/radonis/commit/6522fb6017fe0eace680624742eaf3503aade431), [`50d762f`](https://github.com/microeinhundert/radonis/commit/50d762fc6db2691cfda64bcb0b6ef4f23791414f)]:
  - @microeinhundert/radonis-server@4.0.2
  - @microeinhundert/radonis-shared@4.0.2
  - @microeinhundert/radonis-form@4.0.2
  - @microeinhundert/radonis-hooks@4.0.2
  - @microeinhundert/radonis-hydrate@4.0.2

## 4.0.1

### Patch Changes

- [`c6fc095`](https://github.com/microeinhundert/radonis/commit/c6fc095f2651379d5ecb258a620be79f0bb3dc43) Thanks [@microeinhundert](https://github.com/microeinhundert)! - Fix build not running when not in watch mode

- Updated dependencies [[`c6fc095`](https://github.com/microeinhundert/radonis/commit/c6fc095f2651379d5ecb258a620be79f0bb3dc43)]:
  - @microeinhundert/radonis-shared@4.0.1
  - @microeinhundert/radonis-form@4.0.1
  - @microeinhundert/radonis-hooks@4.0.1
  - @microeinhundert/radonis-hydrate@4.0.1
  - @microeinhundert/radonis-server@4.0.1
  - @microeinhundert/radonis-types@4.0.1

## 4.0.0

### Minor Changes

- [`e1fd598`](https://github.com/microeinhundert/radonis/commit/e1fd598b37f0d49ac170c7a50ee15dae6993da1c) Thanks [@microeinhundert](https://github.com/microeinhundert)! - Reduced dependencies

### Patch Changes

- [`a40335c`](https://github.com/microeinhundert/radonis/commit/a40335c7e906add462e3926af77430036889420d) Thanks [@microeinhundert](https://github.com/microeinhundert)! - Refactored internal exceptions

- Updated dependencies [[`a40335c`](https://github.com/microeinhundert/radonis/commit/a40335c7e906add462e3926af77430036889420d), [`e1fd598`](https://github.com/microeinhundert/radonis/commit/e1fd598b37f0d49ac170c7a50ee15dae6993da1c), [`33fd7d0`](https://github.com/microeinhundert/radonis/commit/33fd7d0d83ad245443472fb3e316ee7df507c31b)]:
  - @microeinhundert/radonis-hydrate@4.0.0
  - @microeinhundert/radonis-server@4.0.0
  - @microeinhundert/radonis-shared@4.0.0
  - @microeinhundert/radonis-hooks@4.0.0
  - @microeinhundert/radonis-form@4.0.0
  - @microeinhundert/radonis-types@4.0.0

## 3.0.0

### Major Changes

- [#29](https://github.com/microeinhundert/radonis/pull/29) [`b4b756d`](https://github.com/microeinhundert/radonis/commit/b4b756df77ed54b6c4611ff038ad7b4e0a67e9f8) Thanks [@microeinhundert](https://github.com/microeinhundert)! - The way hydration works has been reworked. Defining islands (hydratable components) and client entry files is now done by convention rather than configuration.
  This change comes with a few small migration steps, outlined below.

  **In short:**

  - Rename `hydratable` to `island`
  - Suffix files containing islands with `.island.<ext>`
  - Remove `entryFile`, `alwaysIncludeEntryFile` and `componentsDir` from `config/radonis.ts`.

  **More in depth:**

  - The `hydratable` function, which wraps all your hydratable components, has been renamed to `island`. Also, all files containing islands must now end with `.island.<ext>`, which means that a file currently named `Button.tsx` must now be named `Button.island.tsx` for the compiler to pick up islands defined in those files. These changes also fix some edge cases that were present in previous versions of Radonis: A single file can now contain multiple islands. The only requirements are that islands must be contained within `.islands.<ext>` files, be wrapped with `island` and have a unique identifier passed as the first argument to the `island` call.
  - All files ending in `.client.<ext>` are now considered to be entry files for the client bundle. This means that the client entry file (by default `entry.client.ts`) can be located anywhere and named anything you like, as long as it's in the `resources` directory. This also means that you can have multiple client entry files.

  Because of these changes, `entryFile`, `alwaysIncludeEntryFile` and `componentsDir` can be removed from `config/radonis.ts`.

- [`1513f21`](https://github.com/microeinhundert/radonis/commit/1513f213f5b20001b649ec60ecd247e7f888508f) Thanks [@microeinhundert](https://github.com/microeinhundert)! - Aligned route resolution to match the behavior of the AdonisJS core.

  **Migration:**
  If routes have a name set via `.as()` or are part of a resource, make sure that this name is used to reference that route within Radonis.
  Run `node ace list:routes` to get a list of all your routes and their names. The name is the first value on the right, before the `›` symbol.
  If routes have no name, use the handler instead which typically looks something like `YourController.yourAction`.

### Patch Changes

- Updated dependencies [[`e91d059`](https://github.com/microeinhundert/radonis/commit/e91d0591cd621a976e569392082fc313c04dae5e)]:
  - @microeinhundert/radonis-hydrate@3.0.0
  - @microeinhundert/radonis-server@3.0.0
  - @microeinhundert/radonis-shared@3.0.0
  - @microeinhundert/radonis-hooks@3.0.0
  - @microeinhundert/radonis-types@3.0.0
  - @microeinhundert/radonis-form@3.0.0

## 2.1.14

### Patch Changes

- Updated dependencies [[`556001d`](https://github.com/microeinhundert/radonis/commit/556001dab70f0774ea2dbab264f453ce8286de38)]:
  - @microeinhundert/radonis-hooks@2.1.14
  - @microeinhundert/radonis-hydrate@2.1.14
  - @microeinhundert/radonis-server@2.1.14
  - @microeinhundert/radonis-form@2.1.14

## 2.1.13

### Patch Changes

- [`241fbf7`](https://github.com/microeinhundert/radonis/commit/241fbf72e9f61e6cb5c0fab4f796c33d7c2cbf0a) Thanks [@microeinhundert](https://github.com/microeinhundert)! - Maintenance

- Updated dependencies [[`241fbf7`](https://github.com/microeinhundert/radonis/commit/241fbf72e9f61e6cb5c0fab4f796c33d7c2cbf0a)]:
  - @microeinhundert/radonis-form@2.1.13
  - @microeinhundert/radonis-hooks@2.1.13
  - @microeinhundert/radonis-hydrate@2.1.13
  - @microeinhundert/radonis-server@2.1.13
  - @microeinhundert/radonis-shared@2.1.13
  - @microeinhundert/radonis-types@2.1.13

## 2.1.12

### Patch Changes

- [`aed8ba4`](https://github.com/microeinhundert/radonis/commit/aed8ba4a52de1676ec77c4a14e53e6136c0d7f51) Thanks [@microeinhundert](https://github.com/microeinhundert)! - Query plugin

- Updated dependencies [[`aed8ba4`](https://github.com/microeinhundert/radonis/commit/aed8ba4a52de1676ec77c4a14e53e6136c0d7f51)]:
  - @microeinhundert/radonis-form@2.1.12
  - @microeinhundert/radonis-hooks@2.1.12
  - @microeinhundert/radonis-hydrate@2.1.12
  - @microeinhundert/radonis-server@2.1.12
  - @microeinhundert/radonis-shared@2.1.12
  - @microeinhundert/radonis-types@2.1.12

## 2.1.11

### Patch Changes

- [`e342718`](https://github.com/microeinhundert/radonis/commit/e3427188d3042395820197c162396b77fa5a2dcb) Thanks [@microeinhundert](https://github.com/microeinhundert)! - Configuration

- Updated dependencies [[`e342718`](https://github.com/microeinhundert/radonis/commit/e3427188d3042395820197c162396b77fa5a2dcb)]:
  - @microeinhundert/radonis-form@2.1.11
  - @microeinhundert/radonis-hooks@2.1.11
  - @microeinhundert/radonis-hydrate@2.1.11
  - @microeinhundert/radonis-server@2.1.11
  - @microeinhundert/radonis-shared@2.1.11
  - @microeinhundert/radonis-types@2.1.11

## 2.1.10

### Patch Changes

- [#19](https://github.com/microeinhundert/radonis/pull/19) [`0884f13`](https://github.com/microeinhundert/radonis/commit/0884f13e53eb60705fa3d042ad93d06ee6588adb) Thanks [@github-actions](https://github.com/apps/github-actions)! - Switch to pnpm

- Updated dependencies [[`0884f13`](https://github.com/microeinhundert/radonis/commit/0884f13e53eb60705fa3d042ad93d06ee6588adb)]:
  - @microeinhundert/radonis-form@2.1.10
  - @microeinhundert/radonis-hooks@2.1.10
  - @microeinhundert/radonis-hydrate@2.1.10
  - @microeinhundert/radonis-server@2.1.10
  - @microeinhundert/radonis-shared@2.1.10
  - @microeinhundert/radonis-types@2.1.10

## 2.1.9

### Patch Changes

- [#18](https://github.com/microeinhundert/radonis/pull/18) [`7c8ca79`](https://github.com/microeinhundert/radonis/commit/7c8ca797aca69ad91373fe8c1b3076631a4ba50e) Thanks [@github-actions](https://github.com/apps/github-actions)! - Refactoring

- Updated dependencies [[`7c8ca79`](https://github.com/microeinhundert/radonis/commit/7c8ca797aca69ad91373fe8c1b3076631a4ba50e)]:
  - @microeinhundert/radonis-form@2.1.9
  - @microeinhundert/radonis-hooks@2.1.9
  - @microeinhundert/radonis-hydrate@2.1.9
  - @microeinhundert/radonis-server@2.1.9
  - @microeinhundert/radonis-shared@2.1.9
  - @microeinhundert/radonis-types@2.1.9
