# Twind Plugin for Radonis

Add styling powered by [Twind](https://twind.dev/) to your Radonis application.

## Getting Started

### 1. Install the plugin

Install the plugin from your command line:

```console
npm install --save @microeinhundert/radonis-twind
```

### 2. Register the plugin

Add the plugin to your server inside of `config/radonis.ts`:

```ts
import { twindPlugin } from '@microeinhundert/radonis-twind'

const radonisConfig: RadonisConfig = {
  plugins: [twindPlugin()], // <- Add it here
}
```

Add the plugin to your client inside of `resources/entry.client.ts`:

```ts
import { initClient } from '@microeinhundert/radonis'
import { twindPlugin } from '@microeinhundert/radonis-twind'

initClient({ plugins: [twindPlugin()] }) // <- Add it here
```

## Usage

The `useTwind` hook returns an instance of `tw` and `tx`:

```tsx
import { useTwind } from '@microeinhundert/radonis-twind'

function SomeComponent() {
  const { tx } = useTwind()

  return <div className={tx`text-red-500`}>I am styled using Twind</div>
}
```

## Configuration

You can optionally provide your own configuration for the server:

```ts
import { twindPlugin } from '@microeinhundert/radonis-twind'
import presetTailwind from '@twind/preset-tailwind'
import presetTailwindForms from '@twind/preset-tailwind-forms'

const radonisConfig: RadonisConfig = {
  plugins: [
    twindPlugin({
      presets: [presetTailwind(), presetTailwindForms()],
    }),
  ],
}
```

as well as the client:

```ts
import { initClient } from '@microeinhundert/radonis'
import { twindPlugin } from '@microeinhundert/radonis-twind'
import presetTailwind from '@twind/preset-tailwind'
import presetTailwindForms from '@twind/preset-tailwind-forms'

initClient({
  plugins: [
    twindPlugin({
      presets: [presetTailwind(), presetTailwindForms()],
    }),
  ],
})
```

> This configuration accepts everything [Twind](https://twind.dev/) accepts.

## License

[MIT](LICENSE)
