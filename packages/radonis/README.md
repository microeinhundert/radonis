# Radonis

Easily bridge the gap between your [React](https://reactjs.org/) frontend and [AdonisJS](https://adonisjs.com/) backend.
Get DX similar to [Remix](https://remix.run/) while having the power of [AdonisJS](https://adonisjs.com/) at your fingertips.

**Features:**
- Render React views directly from AdonisJS routes and controllers
- Partially hydrate only the components that require interactivity on the client (Islands Architecture)
- Includes pre-made hooks for working with AdonisJS inside your React views, both on client and server

**Requirements:**
- AdonisJS v5.X.X
- React v18.X.X
- ReactDOM v18.X.X

## Getting Started

### 1. Install the packages

Install the client as well as the server package from your command line:

```console
npm install --save @microeinhundert/radonis @microeinhundert/radonis-server
```

or

```console
yarn add @microeinhundert/radonis @microeinhundert/radonis-server 
```

### 2. Configure the server package

```console
node ace configure @microeinhundert/radonis-server
```

### 3. Configure i18n (optional)

If you plan to use i18n functionality, first install the official [@adonisjs/i18n](https://docs.adonisjs.com/guides/i18n) package:

```console
npm install --save @adonisjs/i18n
```

Inside the *DetectUserLocale* middleware, add the following below the *switchLocale* call:

```typescript
ctx.radonis.shareTranslations(language, I18n.getTranslationsFor(language));
```

This makes sure Radonis knows about the available translations as well as the current locale.

### 4. Configure session storage (optional)

If you plan to use session functionality, install the official [@adonisjs/session](https://docs.adonisjs.com/guides/session) package:

```console
npm install --save @adonisjs/session
```

Without it, *useSession* and *useFlashMessages* hooks won't work.

### 5. Configure Tailwind CSS

Some Tailwind CSS classes are baked into the default rendering, which is currently not configurable.
Add the following path to *content* inside tailwind.config.js:

```javascript
module.exports = {
  content: ['./node_modules/@microeinhundert/**/*.js'],
};
```

## Server-Side Templating

Instead of Edge, Radonis uses React to render views on the server. This makes it possible to use the same templating language on both server and client.

Usage in controllers:

```typescript
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { Index, Show } from '../../../resources/views/Users.tsx'; // Where you put your views and how you structure them is completely your choice

export default class UsersController {
  public index({ radonis }: HttpContextContract) {
    return radonis.render(Index);
  }

  public show({ radonis }: HttpContextContract) {
    return radonis.render(Show);
  }
}
```

Usage in routes:

```typescript
import Route from '@ioc:Adonis/Core/Route';
import { SignUp } from '../resources/views/Auth.tsx';

Route.get('/signUp', async ({ radonis }) => {
  return radonis.render(SignUp);
});
```

## Using Client-Side Hydration

Radonis uses partial hydration to only hydrate what is needed.
In order for Radonis to know what to hydrate on the client, wrap the individual components with the *HydrationRoot* component:

```tsx
import { HydrationRoot } from '@ioc:Radonis';

const ServerRenderedComponent = () => {
  return (
    <HydrationRoot componentName="SomeInteractiveComponent">
      <SomeInteractiveComponent someProp="test">
        This component will be hydrated client-side
      </SomeInteractiveComponent>
    </HydrationRoot>
  );
};
```

Make sure to only pass a single child to a *HydrationRoot* component. If you want to hydrate multiple parts of your application, use multiple *HydrationRoot*s instead.
Theres another gotcha: Because a *HydrationRoot* component acts as root for a React instance, *HydrationRoot*s cannot be nested. Also make sure all props passed to a hydrated component are serializable.

Then in your client bundle:

```typescript
import { initClient } from '@microeinhundert/radonis';
import { lazy } from 'react';

const client = initClient();

// The variable name must match the componentName passed to the HydrationRoot
const SomeInteractiveComponent = lazy(() => import('./components/SomeInteractiveComponent'));

client.hydrate({ SomeInteractiveComponent });
```

> Please note that hydration will take place only when the component is in view.

## Hooks

### useHydration (Server and client)

```typescript
import { useHydration } from '@microeinhundert/radonis';

const hydration = useHydration();

// Get info about the HydrationRoot the component is a child of:
console.log(hydration) // => `{ root: ':Rl6:', componentName: 'SomeInteractiveComponent', propsHash: 'cf5aff6dac00648098a9' }`

// By combining useHydration and useManifest, you can get the props of the component 
// passed to the HydrationRoot from any component in the tree:
const hydration = useHydration();
const manifest = useManifest();

console.log(manifest.props[hydration.propsHash]); // => `{ someProp: 'test' }`
```

### useI18n (Server and client)

```typescript
import { useI18n } from '@microeinhundert/radonis';

const i18n = useI18n();

// Get a translated message:
console.log(i18n.formatMessage('auth.signUpTitle')) // => `Some message defined in translations`
```

This hook also allows formatting via the ICU format, just like the AdonisJS i18n package. Refer to the official [AdonisJS Docs](https://docs.adonisjs.com/guides/i18n) for more information about the available formatting rules.

> Please note that this hook requires some [manual setup](#3-configure-i18n-optional).


### useManifest (Server and client)

```typescript
import { useManifest } from '@microeinhundert/radonis';

const manifest = useManifest();

// Get the manifest:
console.log(manifest) // => `{ props: {}, route: {}, routes: {}, locale: 'en', messages: {}, flashMessages: {} }`
```

> Please note that the manifest differs between server-side rendering and client-side hydration, therefore don't use this hook inside of components you plan to hydrate on the client. On the client the manifest only includes data actually needed for client-side hydration.

### useRoute (Server and client)

```typescript
import { useRoute } from '@microeinhundert/radonis';

const route = useRoute();

// Get the current route:
console.log(route.current) // => `{ name: 'users.show', pattern: '/users/:id' }`

// Check if a route is the current route:
console.log(route.isCurrent('users.show'))  // => `true` if currently on `users.show`, `false` if not
```

### useRoutes (Server and client)

```typescript
import { useRoutes } from '@microeinhundert/radonis';

const routes = useRoutes();

// Get all routes as object:
console.log(routes) // => `{ 'drive.local.serve': '/uploads/*', ... }`
```

### useUrlBuilder (Server and client)

```typescript
import { useUrlBuilder } from '@microeinhundert/radonis';

const urlBuilder = useUrlBuilder();

// Build the URL for a named route:
const url = urlBuilder.make('signUp'); // => `/signUp`

// Build the URL for a controller:
const url = urlBuilder.make('users.index'); // => `/users`

// Build the URL with params:
const url = urlBuilder.withParams({ id: 1 }).make('users.show'); // => `/users/1`

// You can also provide path params as an array and they will be populated according to their order:
const url = urlBuilder.withParams([1]).make('users.show'); // => `/users/1`

// You can also provide query params:
const url = urlBuilder.withQueryParams({ cool: ['adonis', 'react'] }).make('tech.index'); // => `/tech?cool=adonis,react
```

### useFlashMessages (Server and client, requires @adonisjs/session)

```typescript
import { useFlashMessages } from '@microeinhundert/radonis';

const flashMessages = useFlashMessages();

// Check if a flash message exists:
console.log(flashMessages.has('errors.fieldName')) // => `true` or `false`

// Get a flash message:
console.log(flashMessages.get('errors.fieldName')) // => `required validation failed on fieldName`

// Get all flash messages:
console.log(flashMessages.all()) // => `{ 'errors.fieldName': 'required validation failed on fieldName', ... }`
```

**The following hooks align with AdonisJS functionality, refer to the official [AdonisJS Docs](https://docs.adonisjs.com/guides/introduction) for usage:**

### useAdonis (Server only)

Returns info about the AdonisJS instance in the following format:

```typescript
interface AdonisContextContract {
  app: ApplicationContract;
  ctx: HttpContextContract;
  request: RequestContract;
  router: RouterContract;
}

import { useAdonis } from '@ioc:Radonis';

const adonis = useAdonis();
```

### useApp (Server only)

Returns the AdonisJS *ApplicationContract*.

```typescript
import { useApp } from '@ioc:Radonis';

const app = useApp();
```

### useHttpContext (Server only)

Returns the AdonisJS *HttpContextContract*.

```typescript
import { useHttpContext } from '@ioc:Radonis';

const httpContext = useHttpContext();
```

### useRequest (Server only)

Returns the AdonisJS *RequestContract*.

```typescript
import { useRequest } from '@ioc:Radonis';

const request = useRequest();
```

### useRouter (Server only)

Returns the AdonisJS *RouterContract*.

```typescript
import { useRouter } from '@ioc:Radonis';

const router = useRouter();
```

### useSession (Server only, requires @adonisjs/session)

Returns the AdonisJS *SessionContract*.

```typescript
import { useSession } from '@ioc:Radonis';

const session = useSession();
```

## License

[MIT](LICENSE)
