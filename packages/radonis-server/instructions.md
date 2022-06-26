Follow the following steps to finalize the installation:

## Configure the required AdonisJS addons

Radonis requires the two official AdonisJS addons @adonisjs/i18n and @adonisjs/session to be installed and configured. Execute the following commands and follow the instructions output to the terminal.

```shell
node ace configure @adonisjs/i18n
```

and

```shell
node ace configure @adonisjs/session
```

## Register generated types _(Optional)_

For additional type safety, add the dynamically generated Radonis types to the `files` array of your `tsconfig.json` and exclude the `tmp` directory:

```json
{
  "exclude": ["tmp"],
  "files": ["./tmp/types/radonis.d.ts"]
}
```

## Read the documentation

Documentation is available at [radonis.vercel.app](https://radonis.vercel.app/).
