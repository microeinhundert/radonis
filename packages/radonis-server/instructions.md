The package has been configured successfully.

## Install required AdonisJS addons

Install and configure the required AdonisJS addons if not already done:

```console
npm install --save @adonisjs/i18n
node ace configure @adonisjs/i18n
```

and

```console
npm install --save @adonisjs/session
node ace configure @adonisjs/session
```

## Install React

```console
npm install --save react react-dom
npm install --save-dev @types/react @types/react-dom
```

## Configure TypeScript

Add the following to the `compilerOptions` object of your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react"
  }
}
```

For additional type safety, add the dynamically generated Radonis types to the `files` array of your `tsconfig.json` and exclude the `tmp` directory:

```json
{
  "exclude": ["tmp"],
  "files": ["./tmp/types/radonis.d.ts"]
}
```

### Replace package scripts

In order for the Radonis client build to run in parallel with the AdonisJS server build, replace the existing `dev` and `build` scripts in your `package.json` file with the following scripts:

```json
{
  "scripts": {
    "dev": "concurrently 'npm:dev:*'",
    "dev:server": "node ace serve --watch",
    "dev:client": "node ace build:client --watch-dir './resources/**/*.ts(x)?'",
    "build": "concurrently 'npm:build:*'",
    "build:server": "node ace build --production",
    "build:client": "node ace build:client --production --output-dir adonis-build-dir"
  }
}
```

And install `concurrently`:

```console
npm install --save-dev concurrently
```
