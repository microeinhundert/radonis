# Additional Configuration

## Configure i18n (optional)

If you plan to use i18n functionality, first install the official [@adonisjs/i18n](https://docs.adonisjs.com/guides/i18n) package:

```console
npm install --save @adonisjs/i18n
```

Inside the *DetectUserLocale* middleware, add the following below the *switchLocale* call:

```typescript
ctx.radonis.shareTranslations(language, I18n.getTranslationsFor(language));
```

This makes sure Radonis knows about the available translations as well as the current locale.

## Configure session storage (optional)

If you plan to use session functionality, install the official [@adonisjs/session](https://docs.adonisjs.com/guides/session) package:

```console
npm install --save @adonisjs/session
```

Without it, *useSession* and *useFlashMessages* hooks won't work.
