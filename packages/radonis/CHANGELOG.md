# @microeinhundert/radonis

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
