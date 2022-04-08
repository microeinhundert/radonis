# Radonis

Easily bridge the gap between your [React](https://reactjs.org/) frontend and [AdonisJS](https://adonisjs.com/) backend.
Get DX similar to [Remix](https://remix.run/) while having the power of [AdonisJS](https://adonisjs.com/) at your fingertips.

Features:
- Render React views directly from AdonisJS routes and controllers
- Partially hydrate only the components that require interactivity on the client (Islands Architecture)
- Includes pre-made hooks for working with AdonisJS inside your React views, both on client and server

## Getting started

### 1. Install the packages

Install the packages from your command line:

```bash
npm install --save @microeinhundert/radonis @microeinhundert/radonis-server
```

or

```bash
yarn add @microeinhundert/radonis @microeinhundert/radonis-server
```

### 2. Configure the server package

```bash
node ace configure @microeinhundert/radonis-server
```

## License

[MIT](LICENSE)
