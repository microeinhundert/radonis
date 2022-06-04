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

- @adonisjs/core ^5.8.0
- @adonisjs/session ^6.4.0
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

## Server-Side Templating

Instead of Edge, Radonis uses React to render views on the server. This makes it possible to use the same templating language on both the server and the client.

Usage in controllers:

```typescript
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
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

You can also add meta by calling `withMeta` in your controllers, routes, middlewares or everywhere `radonis` is available on the HttpContext:

```typescript
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Index, Show } from '../../../resources/views/Users.tsx'

export default class UsersController {
  public index({ radonis }: HttpContextContract) {
    return radonis.withMeta({ viewport: 'width=device-width, initial-scale=1.0' }).render(Index)
  }
}
```

> **Note**: Data passed to `useHead` is always prioritized over data passed to `render` or `withMeta`.

## The Manifest

The manifest is where Radonis stores all its data, like props of a component or translation messages. This manifest is also accessible client-side, which makes client-side hydration possible.
By default, Radonis limits the client manifest to only include data required for client-side hydration. However, if your specific use case requires having the same manifest on both the client and the server, set `client.limitManifest` to `false` in the Radonis config.

### Extending the manifest

You can also add your own data to the manifest, for example the currently logged in user or some global application settings. To extend the manifest, first add the types for your custom data to `contracts/radonis.ts` inside of the `Globals` interface. Then, call `withGlobals` in your controllers, routes, middlewares or everywhere `radonis` is available on the HttpContext:

```typescript
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
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

Access your custom globals with the `useGlobals` hook:

```typescript
import { useGlobals } from '@microeinhundert/radonis'

const globals = useGlobals()

console.log(globals) // => `{ user: { id: 1, email: 'radonis@example.com' } }`
```

> **Note**: Globals are set on a per-request basis. Use a custom middleware if you need some globals on all routes.

## Using Client-Side Hydration

Radonis uses partial hydration, which only hydrates parts of the page that require interactivity on the client.
In order for Radonis to know what to hydrate on the client, wrap the individual components with the _HydrationRoot_ component:

```tsx
import { HydrationRoot } from '@ioc:Adonis/Addons/Radonis'

function ServerRenderedComponent() {
  return (
    <HydrationRoot component="SomeInteractiveComponent">
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

## Forms

By default, Radonis applications work like a traditional monolythic application: Forms are submitted and trigger a page reload, no JavaScript required. With the help of client-side hydration and flash messages, this "old school" way of handling user input comes really close to the modern UX known from Single Page Applications. But there are cases, being some small interaction like a "Add to favorites" button or a whole form, where communicating with the backend via fetch comes in handy and delivers a better UX for the user. Radonis ships with a form component that can do both, and switching between submit and fetch is as simple as adding a prop to the form component.

```tsx
import { Form } from '@microeinhundert/radonis'

type Data = {
  title: string
  description: string
}

type Error = Record<keyof Data, string | undefined>

function FetchFormDemo() {
  return (
    <Form<Data, Error>
      method="post" // or `get`, `put`, `delete`, `patch`
      action="YourController.store"
      params={{ someParam: 'hello' }}
      queryParams={{ someQueryParam: 'world' }}
      hooks={{
        onMutate: ({ input }) => {
          // Do something before the mutation runs

          return () => {
            // Rollback changes if the mutation failed
          }
        },
        onSuccess: ({ data, input }) => {
          // Do something once the mutation succeeded
        },
        onFailure: ({ error, rollback, input }) => {
          // Do something once the mutation failed,
          // like executing the rollback
          if (rollback) rollback()
        },
        onSettled: ({ status, error, data, rollback, input }) => {
          switch (status) {
            case 'success': {
              // Do something if the mutation succeeded
            }
            case 'failure': {
              // Do something if the mutation failed
            }
          }
        },
      }}
    >
      {({ status, error }) => {
        const isSubmitting = status === 'running'

        return (
          <>
            <label>
              <span>Title</span>
              <input name="title" type="text" required />
              {error?.title && <span>Validation failed</span>}
            </label>
            <label>
              <span>Description</span>
              <textarea name="description" required />
              {error?.description && <span>Validation failed</span>}
            </label>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </>
        )
      }}
    </Form>
  )
}
```

To submit the form traditionally, simply add the `reloadDocument` prop to the form component and switch to flash messages for validation:

```tsx
import { useFlashMessages, Form } from '@microeinhundert/radonis'

function TraditionalFormDemo() {
  const flashMessages = useFlashMessages()

  return (
    <Form
      method="post" // or `get`, `put`, `delete`, `patch`
      action="YourController.store"
      params={{ someParam: 'hello' }}
      queryParams={{ someQueryParam: 'world' }}
      reloadDocument // Reload the document like a <form> would do natively
    >
      <label>
        <span>Title</span>
        <input name="title" type="text" required />
        {flashMessages.hasError('title') && <span>{flashMessages.getError('title')}</span>}
      </label>
      <label>
        <span>Description</span>
        <textarea name="description" required />
        {flashMessages.hasError('description') && <span>{flashMessages.getError('description')}</span>}
      </label>
      <button type="submit">Submit</button>
    </Form>
  )
}
```

When JavaScript is not available, fetch forms will gracefully fall back to a traditional submit. But then you must make sure that validation will work in both cases, fetch and traditional submit.

> **Note**: When using methods other than `get` or `post`, `allowMethodSpoofing` must be set to `true` in the AdonisJS config. The `hooks` prop as well as the render props do not work in conjunction with `reloadDocument`.

## Hooks

### useHydration (Server and client)

```typescript
import { useHydration } from '@microeinhundert/radonis'

const hydration = useHydration()

// Get info about the HydrationRoot the component is a child of:
console.log(hydration) // => `{ hydrated: false, root: ':Rl6:', component: 'SomeInteractiveComponent', propsHash: 'cf5aff6dac00648098a9' }`

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

> **Note**: This hook also allows formatting via the ICU message format, just like the official AdonisJS i18n package. Refer to the official [AdonisJS documentation](https://docs.adonisjs.com/guides/i18n) for more information about the available formatting rules.

### useManifest (Server and client)

```typescript
import { useManifest } from '@microeinhundert/radonis'

const manifest = useManifest()

// Get the manifest:
console.log(manifest) // => `{ props: {}, globals: {}, flashMessages: {}, locale: 'en', messages: {}, routes: {}, route: {} }`
```

> **Note**: The manifest differs between server-side rendering and client-side hydration, therefore don't use this hook inside of components you plan to hydrate on the client. However, if your specific use case requires having the same manifest on both the client and the server, set `client.limitManifest` to `false` in the Radonis config.

### useGlobals (Server and client)

```typescript
import { useGlobals } from '@microeinhundert/radonis'

const globals = useGlobals()

// Get the globals:
console.log(globals) // => `{}`
```

### useRoute (Server and client)

```typescript
import { useRoute } from '@microeinhundert/radonis'

const route = useRoute()

// Get the current route:
console.log(route.current) // => `{ name: 'users.show', pattern: '/users/:id' }`

// Check if a route is the current route:
console.log(route.isCurrent('users.show')) // => `true` if currently on `users.show` or a child of `users.show`, `false` if not

// Check if a route is exactly the current route:
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

// Check if any flash message exists:
console.log(flashMessages.has()) // => `true` or `false`

// Check if any error flash message exists:
console.log(flashMessages.hasError()) // => `true` or `false`

// Check if some specific flash message exists:
console.log(flashMessages.has('errors.fieldName.0')) // => `true` or `false`

// Check if some specific error flash message exists:
console.log(flashMessages.hasError('fieldName.0')) // => `true` or `false`

// Get some specific flash message:
console.log(flashMessages.get('errors.fieldName.0')) // => `required validation failed on fieldName`

// You can also omit the index to automatically get the first item from an array:
console.log(flashMessages.get('errors.fieldName')) // => same as `errors.fieldName.0`

// You can also get some specific error flash message like this:
console.log(flashMessages.getError('fieldName')) // => same as `errors.fieldName`

// Get all flash messages:
console.log(flashMessages.all()) // => `{ 'errors.fieldName.0': 'required validation failed on fieldName', ... }`

// Get all error flash messages:
console.log(flashMessages.allErrors()) // => `{ 'errors.fieldName.0': 'required validation failed on fieldName', ... }`
```

### useMutation (Client only)

```typescript
import { useMutation, useUrlBuilder } from '@microeinhundert/radonis'

const urlBuilder = useUrlBuilder()

// Create a function that runs the mutation:
async function storeComment({ postId, authorId, comment }: { postId: string; authorId: string; comment: string }) {
  const response = await fetch(urlBuilder.withParams({ id: postId }).make('PostsController.storeComment'), {
    method: 'POST',
    body: JSON.stringify({ authorId, comment }),
  })

  if (!response.ok) throw new Error(res.statusText)

  return response.json()
}

// Use this function with the `useMutation` hook:
const [mutate, { status }] = useMutation(storeComment)

// Execute the mutation:
mutate({ postId, authorId, comment })
```

For the following hooks, refer to the official [AdonisJS documentation](https://docs.adonisjs.com/guides/introduction), as these hooks just proxy AdonisJS contracts.

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
     * This plugin hook is called before a component is hydrated
     */
    beforeHydrate() {
      return (tree: ReactElement) => {
        // Return modified React tree
        return tree
      }
    },

    /**
     * This plugin hook is called after the server has been booted
     */
    onBootServer() {},

    /**
     * This plugin hook is called on scan of a previously output file
     */
    onScanFile(file) {},

    /**
     * This plugin hook is called before a file is output
     */
    beforeOutput() {
      return (source: string) => {
        // Return modified file source
        return source
      }
    },

    /**
     * This plugin hook is called after all files have been output
     */
    afterOutput(files) {},

    /**
     * This plugin hook is called before the page is rendered
     */
    beforeRender() {
      return (tree: ReactElement) => {
        // Return modified React tree
        return tree
      }
    },

    /**
     * This plugin hook is called after the page has been rendered
     */
    afterRender() {
      return (html: string) => {
        // Return modified HTML
        return html
      }
    },
  })
}
```

Here's an example of a plugin that injects a React context provider into the server-side rendering as well as the client-side hydration:

```tsx
import { definePlugin } from '@microeinhundert/radonis'
import React from 'react'

export function contextProviderPlugin() {
  const contextProviderValue = {
    hello: 'world',
  }

  return definePlugin({
    name: 'context-provider-plugin',
    environments: ['client', 'server'],
    beforeHydrate() {
      return (tree) => <SomeContextProvider value={contextProviderValue}>{tree}</SomeContextProvider>
    },
    beforeRender() {
      return (tree) => <SomeContextProvider value={contextProviderValue}>{tree}</SomeContextProvider>
    },
  })
}
```

## License

[MIT](LICENSE)
