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

Add the following to the compilerOptions of your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react"
  }
}
```
