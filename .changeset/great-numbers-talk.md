---
'@microeinhundert/radonis-server': minor
'@microeinhundert/radonis': minor
---

Changed default build script.

**Migration:**
Change the `build` script in `package.json` to `npm run build:server && npm run build:client"`. This ensures that the two build steps are performed in order.
