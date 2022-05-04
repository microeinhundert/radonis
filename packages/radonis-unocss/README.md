# UnoCSS Plugin for Radonis

Add styling powered by [UnoCSS](https://github.com/unocss/unocss) to your Radonis application.

## Getting Started

### 1. Install the plugin

Install the plugin from your command line:

```console
npm install --save @microeinhundert/radonis-unocss
```

### 2. Register the plugin

Add the plugin to your server inside of `config/radonis.ts`:

```ts
import { unocssPlugin } from '@microeinhundert/radonis-unocss'

const radonisConfig: RadonisConfig = {
  plugins: [unocssPlugin()], // <- Add it here
}
```

## Usage

It just works™

> Unlike the [Twind plugin](https://github.com/microeinhundert/radonis/tree/main/packages/radonis-twind), the UnoCSS plugin does only run on the server and therefore produces no runtime overhead for the browser, with the cost of less flexibility and a "larger" CSS bundle.

## Configuration

You can optionally provide your own configuration:

```ts
import { unocssPlugin } from '@microeinhundert/radonis-unocss'
import presetWind from '@unocss/preset-wind'

const radonisConfig: RadonisConfig = {
  plugins: [
    unocssPlugin({
      presets: [presetWind()],
    }),
  ],
}
```

> This configuration accepts everything [UnoCSS](https://github.com/unocss/unocss) accepts.

## License

[MIT](LICENSE)
