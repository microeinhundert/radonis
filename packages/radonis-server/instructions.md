Follow the following steps to finalize the installation:

## Configure AdonisJS addons

Configure the required AdonisJS addons if not already done:

```console
node ace configure @adonisjs/i18n
```

and

```console
node ace configure @adonisjs/session
```

## Register generated types (optional)

For additional type safety, add the dynamically generated Radonis types to the `files` array of your `tsconfig.json` and exclude the `tmp` directory:

```json
{
  "exclude": ["tmp"],
  "files": ["./tmp/types/radonis.d.ts"]
}
```
