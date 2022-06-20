# CSRF Handling

1. Install and configure the `@adonisjs/shield` addon:

```console
npm install --save @adonisjs/shield
node ace configure @adonisjs/shield
```

> **Note**: Find out more about `@adonisjs/shield` in the [AdonisJS documentation](https://docs.adonisjs.com/guides/security/web-security).

2. Create the `CsrfMiddleware` which adds the token to meta and globals:

```typescript
// app/Middleware/Csrf.ts
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CsrfMiddleware {
  public async handle({ request, radonis }: HttpContextContract, next: () => Promise<void>) {
    radonis.withMeta({ 'csrf-token': request.csrfToken })
    radonis.withGlobals({ csrfToken: request.csrfToken })
    await next()
  }
}
```

3. Register the newly created `CsrfMiddleware`:

```typescript
// start/kernel.ts
Server.middleware.register([() => import('App/Middleware/Csrf')])
```

4. Define the type for the `csrfToken` global:

```typescript
// contracts/radonis.ts
declare module '@microeinhundert/radonis-types' {
  interface Globals {
    csrfToken?: string
  }
}
```

5. **Optional:** Create a React hook for retrieving the token from globals:

```typescript
// resources/hooks/useCsrfToken.ts
import { useGlobals } from '@microeinhundert/radonis'

export function useCsrfToken() {
  const { csrfToken } = useGlobals()

  return csrfToken
}
```

6. **Optional:** Create a React component for the hidden `_csrf` form field:

```tsx
// resources/components/CsrfField.tsx
import React from 'react'
import { useCsrfToken } from 'resources/hooks/useCsrfToken'

function CsrfField() {
  const csrfToken = useCsrfToken()

  return csrfToken ? <input name="_csrf" type="hidden" value={csrfToken} /> : null
}

export default CsrfField
```

## License

[MIT](https://github.com/microeinhundert/radonis/tree/main/packages/radonis/LICENSE)
