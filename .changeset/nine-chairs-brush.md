---
'@microeinhundert/radonis-hydrate': major
'@microeinhundert/radonis-server': major
'@microeinhundert/radonis-build': major
'@microeinhundert/radonis-hooks': major
'@microeinhundert/radonis-types': major
'@microeinhundert/radonis': major
'@microeinhundert/radonis-form': major
'@microeinhundert/radonis-query': major
'@microeinhundert/radonis-shared': major
'@microeinhundert/radonis-unocss': major
---

Revised the way static analysis is performed. Instead of extracting identifiers from specifically named properties, Radonis now looks for any function call, object property or JSX property whose name ends with a dollar sign `$`. This has the advantage of simplifying static analysis and reducing edge cases, but also gives you, the developer, more flexibility. Any function call, object property or JSX property in your codebase will now be statically analysed if it ends with a dollar sign. This convention also makes it clearer to the reader what is statically analysed and what is not.

**Migration:**
- `useI18n`: `formatMessage` -> `formatMessage$`
- `useFlashMessages`: `get` -> `get$`, `has` -> `has$`
- `useUrlBuilder`: `make` -> `make$`
- `<Form>` and `useForm`: `action` -> `action$`
- `island` -> `island$`
