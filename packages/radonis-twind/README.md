# Twind Plugin for Radonis

Easily bridge the gap between your [React](https://reactjs.org/) frontend and [AdonisJS](https://adonisjs.com/) backend.
Get DX similar to [Remix](https://remix.run/) while having the power of [AdonisJS](https://adonisjs.com/) at your fingertips.

## Getting Started

### 1. Install the plugin

Install the plugin from your command line:

```console
npm install --save @microeinhundert/radonis-twind
```

### 2. Register the plugin

Add the plugin to your server configuration:

```ts
import { twindPlugin } from '@microeinhundert/radonis-twind'

const radonisConfig: RadonisConfig = {
  plugins: [twindPlugin], // <- Add it here
}
```

Add the plugin to your client:

```ts
import { initClient } from '@microeinhundert/radonis'
import { twindPlugin } from '@microeinhundert/radonis-twind'

initClient({ plugins: [twindPlugin] }) // <- Add it here
```

## Usage

```tsx
import { useTwind } from '@microeinhundert/radonis-twind'

function SomeComponent() {
  const { tx } = useTwind()

  return <div className={tx`text-red-500`}>I am styled using Twind</div>
}
```

## License

[MIT](LICENSE)
