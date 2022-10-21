# Radonis

![npm (scoped)](https://img.shields.io/npm/v/@microeinhundert/radonis)

Radonis is a full-stack application framework for building monolithic applications with a modern, React-based frontend stack. Radonis is built on top of the Node.js MVC framework [AdonisJS](https://adonisjs.com/) and extends it with features for server-side rendering and client-side hydration.

## Notable features

- Renders React views directly from AdonisJS routes and controllers.
- Partially hydrates only the components that require interactivity on the client (Islands Architecture).
- Includes pre-made hooks for working with AdonisJS inside your React views, both on client and server.
- Ships with a compiler powered by [esbuild](https://esbuild.github.io/), no Webpack Encore required.

## Documentation

Documentation is available on [radonis.vercel.app](https://radonis.vercel.app/).

## Example application

For an example application, take a look into the `example` directory.

## License

[MIT](LICENSE)
