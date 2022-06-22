# Radonis

![npm (scoped)](https://img.shields.io/npm/v/@microeinhundert/radonis)

Easily bridge the gap between your [React](https://reactjs.org/) frontend and [AdonisJS](https://adonisjs.com/) backend.
Get DX similar to [Remix](https://remix.run/) while having the power of [AdonisJS](https://adonisjs.com/) at your fingertips.

## Notable Features

- Renders React views directly from AdonisJS routes and controllers.
- Partially hydrates only the components that require interactivity on the client (Islands Architecture).
- Includes pre-made hooks for working with AdonisJS inside your React views, both on client and server.
- Ships with a compiler powered by [esbuild](https://esbuild.github.io/), no Webpack Encore required.

## Required Packages

- @adonisjs/core ^5.8.0
- @adonisjs/session ^6.4.0
- @adonisjs/i18n ^1.5.0
- react ^18.2.0
- react-dom ^18.2.0

> **Note**: Required packages are installed automatically.

## Getting Started

### 1. Install the packages

Install the two Radonis core packages from your command line:

```console
npm install --save @microeinhundert/radonis @microeinhundert/radonis-server
```

### 2. Configure the server package

```console
node ace configure @microeinhundert/radonis-server
```

### 3. Configure AdonisJS addons

Configure the required AdonisJS addons if not already done:

```console
node ace configure @adonisjs/i18n
```

and

```console
node ace configure @adonisjs/session
```

> **Note**: These addons were automatically installed as part of the `node ace configure` command.

### 4. Register generated types (Optional)

For additional type safety, add the dynamically generated Radonis types to the `files` array of your `tsconfig.json` and exclude the `tmp` directory:

```json
{
  "exclude": ["tmp"],
  "files": ["./tmp/types/radonis.d.ts"]
}
```

## Documentation

For documentation about Radonis, take a look at the markdown files located in the documentation directory or [follow this link](documentation/index.md).

## Cookbooks

- [CSRF Handling](documentation/cookbooks/csrf.md)
- [Creating A Form Input Component](documentation/cookbooks/form-input-component.md)
- [Creating A Plugin](documentation/cookbooks/plugin.md)

## Official Plugins

- [Twind](https://github.com/microeinhundert/radonis/tree/main/packages/radonis-twind)
- [UnoCSS](https://github.com/microeinhundert/radonis/tree/main/packages/radonis-unocss)

## License

[MIT](LICENSE)
