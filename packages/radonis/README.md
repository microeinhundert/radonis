# Radonis

![npm (scoped)](https://img.shields.io/npm/v/@microeinhundert/radonis)

Easily bridge the gap between your [React](https://reactjs.org/) frontend and [AdonisJS](https://adonisjs.com/) backend.
Get DX similar to [Remix](https://remix.run/) while having the power of [AdonisJS](https://adonisjs.com/) at your fingertips.

**Features:**

- Render React views directly from AdonisJS routes and controllers
- Partially hydrate only the components that require interactivity on the client (Islands Architecture)
- Includes pre-made hooks for working with AdonisJS inside your React views, both on client and server
- Ships with a compiler powered by [esbuild](https://esbuild.github.io/), no Webpack Encore required

**Requirements:**

- @adonisjs/core ^5.7.0
- @adonisjs/session ^6.2.0
- @adonisjs/i18n ^1.5.0
- react ^18.1.0
- react-dom ^18.1.0

## Getting Started

### 1. Install the package

Install the package from your command line:

```console
npm install --save @microeinhundert/radonis @microeinhundert/radonis-server
```

### 2. Configure the server package

```console
node ace configure @microeinhundert/radonis-server
```

### 3. Install required AdonisJS addons

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

### 4. Install React

```console
npm install --save react react-dom
npm install --save-dev @types/react @types/react-dom
```

### 5. Configure TypeScript

Add the following to the compilerOptions of your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react"
  }
}
```

## Server-Side Templating

Instead of Edge, Radonis uses React to render views on the server. This makes it possible to use the same templating language on both the server and the client.

Usage in controllers:

```typescript
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Index, Show } from '../../../resources/views/Users.tsx' // Where you put your views and how you structure them is completely your choice

export default class UsersController {
  public index({ radonis }: HttpContextContract) {
    return radonis.render(Index)
  }

  public show({ radonis }: HttpContextContract) {
    return radonis.render(Show)
  }
}
```

Usage in routes:

```typescript
import Route from '@ioc:Adonis/Core/Route'
import { SignUp } from '../resources/views/Auth.tsx'

Route.get('/signUp', async ({ radonis }) => {
  return radonis.render(SignUp)
})
```

### Adding tags to the head of the page

To modify the `<head>` of a page, use the `useHead` hook in your views:

```tsx
import { useHead } from '@ioc:Adonis/Addons/Radonis'

function View() {
  const head = useHead()

  // Set the <title> tag
  head.setTitle('Welcome')

  // Add <meta> tags
  head.addMeta({
    viewport: 'width=device-width, initial-scale=1.0',
  })

  return <SomeComponent>Hello World!</SomeComponent>
}
```

You can optionally pass `<head>` data directly to the render call as the third argument:

```typescript
import Route from '@ioc:Adonis/Core/Route'
import { SignUp } from '../resources/views/Auth.tsx'

Route.get('/signUp', async ({ radonis }) => {
  return radonis.render(SignUp, undefined, {
    title: 'Sign up',
    meta: { viewport: 'width=device-width, initial-scale=1.0' },
  })
})
```

> Note that usage of the `useHead` hook always overrides data passed to `render`.

## The Manifest

The manifest is where Radonis stores all its data, like props of a component or translation messages. This manifest is also accessible client-side, which makes client-side hydration possible.
By default, Radonis limits the client manifest to only include data required for client-side hydration. If your specific use case requires having the same manifest on both the client and the server, set `client.limitManifest` to `false` in the Radonis config.

### Extending the manifest

You can also add your own data to the manifest, for example the currently logged in user or some global application settings. To extend the manifest, first add the types for your custom data to `contracts/radonis.ts` inside of the `Globals` interface. Then, call `withGlobals` in your controllers, routes, middlewares or everywhere `radonis` is available on the HttpContext:

```typescript
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Index, Show } from '../../../resources/views/Users.tsx'

export default class UsersController {
  public index({ radonis }: HttpContextContract) {
    return radonis.withGlobals({ user: { id: 1, email: 'radonis@example.com' } }).render(Index)
  }
}
```

You can optionally pass globals directly to the render call as the third argument:

```typescript
import Route from '@ioc:Adonis/Core/Route'
import { SignUp } from '../resources/views/Auth.tsx'

Route.get('/signUp', async ({ radonis }) => {
  return radonis.render(SignUp, undefined, {
    globals: { user: { id: 1, email: 'radonis@example.com' } },
  })
})
```

Access your custom globals with the `useManifest` hook:

```typescript
import { useManifest } from '@microeinhundert/radonis'

const manifest = useManifest()

console.log(manifest.globals) // => `{ user: { id: 1, email: 'radonis@example.com' } }`
```

> Note that globals are set on a per-request basis. Use a custom middleware if you need some globals on all routes.

## Using Client-Side Hydration

Radonis uses partial hydration, which only hydrates parts of the page that require interactivity on the client.
In order for Radonis to know what to hydrate on the client, wrap the individual components with the _HydrationRoot_ component:

```tsx
import { HydrationRoot } from '@ioc:Adonis/Addons/Radonis'

function ServerRenderedComponent() {
  return (
    <HydrationRoot componentName="SomeInteractiveComponent">
      <SomeInteractiveComponent someProp="test">This component will be hydrated client-side</SomeInteractiveComponent>
    </HydrationRoot>
  )
}
```

### Things to keep in mind when working with HydrationRoots

- HydrationRoots only accept a single child. If you want to hydrate multiple parts of your application, use multiple HydrationRoots instead.
- All props passed to the direct child of an HydrationRoot must be serializable.
- HydrationRoots cannot be nested.
- Hydration will only take place once the HydrationRoot is in view.

### Passing model data to client-side hydrated components

In order for data to be of the same format on both the server and the client, you have to use a custom naming strategy for your Lucid models.
This makes sure properties are kept in camelCase after serialization.

```ts
// app/Strategies/CamelCaseNamingStrategy.ts
import { string } from '@ioc:Adonis/Core/Helpers'
import { SnakeCaseNamingStrategy, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class CamelCaseNamingStrategy extends SnakeCaseNamingStrategy {
  public serializedName(_model: typeof BaseModel, propertyName: string) {
    return string.camelCase(propertyName)
  }
}
```

```ts
// app/Models/YourModel.ts
import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'
import { BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class YourModel extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
}
```

## Hooks

### useHydration (Server and client)

```typescript
import { useHydration } from '@microeinhundert/radonis'

const hydration = useHydration()

// Get info about the HydrationRoot the component is a child of:
console.log(hydration) // => `{ hydrated: false, root: ':Rl6:', componentName: 'SomeInteractiveComponent', propsHash: 'cf5aff6dac00648098a9' }`

// By combining useHydration and useManifest, you can get the props of the component
// passed to the HydrationRoot from any component in the tree:
const hydration = useHydration()
const manifest = useManifest()

console.log(manifest.props[hydration.propsHash]) // => `{ someProp: 'test' }`
```

### useHydrated (Server and client)

This hook allows checking if a component was hydrated.

```typescript
import { useHydrated } from '@microeinhundert/radonis'

const hydrated = useHydrated()

console.log(hydrated) // => `true` if it was hydrated or `false` if not
```

### useI18n (Server and client)

```typescript
import { useI18n } from '@microeinhundert/radonis'

const i18n = useI18n()

// Get a translated message:
console.log(i18n.formatMessage('auth.signUpTitle')) // => `Some message defined in translations`
```

> This hook also allows formatting via the ICU message format, just like the official AdonisJS i18n package. Refer to the official [AdonisJS Docs](https://docs.adonisjs.com/guides/i18n) for more information about the available formatting rules.

### useManifest (Server and client)

```typescript
import { useManifest } from '@microeinhundert/radonis'

const manifest = useManifest()

// Get the manifest:
console.log(manifest) // => `{ props: {}, globals: {}, flashMessages: {}, locale: 'en', messages: {}, routes: {}, route: {} }`
```

> Note that the manifest differs between server-side rendering and client-side hydration, therefore don't use this hook inside of components you plan to hydrate on the client. If your specific use case requires having the same manifest on both the client and the server, set `client.limitManifest` to `false` in the Radonis config.

### useRoute (Server and client)

```typescript
import { useRoute } from '@microeinhundert/radonis'

const route = useRoute()

// Get the current route:
console.log(route.current) // => `{ name: 'users.show', pattern: '/users/:id' }`

// Check if a route is the current route:
console.log(route.isCurrent('users.show')) // => `true` if currently on `users.show` or a child of `users.show`, `false` if not

// Check if exact match:
console.log(route.isCurrent('users.show', true)) // => `true` if currently on `users.show`, `false` if not
```

### useRoutes (Server and client)

```typescript
import { useRoutes } from '@microeinhundert/radonis'

const routes = useRoutes()

// Get all routes as object:
console.log(routes) // => `{ 'drive.local.serve': '/uploads/*', ... }`
```

### useUrlBuilder (Server and client)

```typescript
import { useUrlBuilder } from '@microeinhundert/radonis'

const urlBuilder = useUrlBuilder()

// Build the URL for a named route:
const url = urlBuilder.make('signUp') // => `/signUp`

// Build the URL for a controller:
const url = urlBuilder.make('users.index') // => `/users`

// Build the URL with params:
const url = urlBuilder.withParams({ id: 1 }).make('users.show') // => `/users/1`

// You can also provide query params:
const url = urlBuilder.withQueryParams({ cool: ['adonis', 'react'] }).make('tech.index') // => `/tech?cool=adonis,react
```

### useFlashMessages (Server and client)

```typescript
import { useFlashMessages } from '@microeinhundert/radonis'

const flashMessages = useFlashMessages()

// Check if some flash message exists:
console.log(flashMessages.has()) // => `true` or `false`

// Check if some validation error flash message exists:
console.log(flashMessages.hasValidationError()) // => `true` or `false`

// Check if a specific flash message exists:
console.log(flashMessages.has('errors.fieldName.0')) // => `true` or `false`

// Check if a specific validation error flash message exists:
console.log(flashMessages.hasValidationError('fieldName.0')) // => `true` or `false`

// Get a specific flash message:
console.log(flashMessages.get('errors.fieldName.0')) // => `required validation failed on fieldName`

// You can also omit the index to automatically get the first item if an array:
console.log(flashMessages.get('errors.fieldName')) // => same as `errors.fieldName.0`

// You can also get a specific validation error flash message like this:
console.log(flashMessages.getValidationError('fieldName')) // => same as `errors.fieldName`

// Get all flash messages:
console.log(flashMessages.all()) // => `{ 'errors.fieldName.0': 'required validation failed on fieldName', ... }`

// Get all validation error flash messages:
console.log(flashMessages.allValidationErrors()) // => `{ 'errors.fieldName.0': 'required validation failed on fieldName', ... }`
```

**The following hooks align with AdonisJS functionality, refer to the official [AdonisJS Docs](https://docs.adonisjs.com/guides/introduction) for usage:**

### useAdonis (Server only)

Returns info about the AdonisJS instance in the following format:

```typescript
interface AdonisContextContract {
  application: ApplicationContract
  httpContext: HttpContextContract
  router: RouterContract
}
```

Usage:

```typescript
import { useAdonis } from '@ioc:Adonis/Addons/Radonis'

const adonis = useAdonis()
```

### useApplication (Server only)

Returns the AdonisJS _ApplicationContract_.

```typescript
import { useApplication } from '@ioc:Adonis/Addons/Radonis'

const application = useApplication()
```

### useHttpContext (Server only)

Returns the AdonisJS _HttpContextContract_.

```typescript
import { useHttpContext } from '@ioc:Adonis/Addons/Radonis'

const httpContext = useHttpContext()
```

### useRequest (Server only)

Returns the AdonisJS _RequestContract_.

```typescript
import { useRequest } from '@ioc:Adonis/Addons/Radonis'

const request = useRequest()
```

### useRouter (Server only)

Returns the AdonisJS _RouterContract_.

```typescript
import { useRouter } from '@ioc:Adonis/Addons/Radonis'

const router = useRouter()
```

### useSession (Server only)

Returns the AdonisJS _SessionContract_.

```typescript
import { useSession } from '@ioc:Adonis/Addons/Radonis'

const session = useSession()
```

## Plugins

### Official

[Twind](https://github.com/microeinhundert/radonis/tree/main/packages/radonis-twind)  
[UnoCSS](https://github.com/microeinhundert/radonis/tree/main/packages/radonis-unocss)

### Build your own

Take a look at this example which illustrates how a plugin is built:

```typescript
import { definePlugin } from '@microeinhundert/radonis'

function yourPlugin() {
  return definePlugin({
    /**
     * The name of the plugin
     */
    name: 'your-plugin',

    /**
     * The environments the plugin is compatible with
     */
    environments: ['client', 'server'],

    /**
     * This plugin hook is called after the client has been initialized
     */
    onInitClient() {},

    /**
     * This plugin hook is called after the server has been booted
     */
    onBootServer() {},

    /**
     * This plugin hook is called before a file is output by the compiler
     */
    beforeOutput(fileContents: string) {},

    /**
     * This plugin hook is called after all files have been output by the compiler
     */
    afterOutput(files: Map<string, string>) {},

    /**
     * This plugin hook is called before the compiler starts
     */
    beforeCompile() {},

    /**
     * This plugin hook is called after the compiler has finished
     */
    afterCompile() {},

    /**
     * This plugin hook is called before the page is rendered
     */
    beforeRender() {
      return async (tree: ReactElement) => {
        // Return modified React tree
        return tree
      }
    },

    /**
     * This plugin hook is called after the page has been rendered
     */
    afterRender() {
      return async (html: string) => {
        // Return modified HTML
        return html
      }
    },
  })
}
```

## License

[MIT](LICENSE)
