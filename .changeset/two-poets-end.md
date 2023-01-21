---
'@microeinhundert/radonis': major
---

Aligned route resolution to match the behavior of the AdonisJS core.

**Migration:**
If routes have a name set via `.as()` or are part of a resource, make sure that this name is used to reference that route within Radonis. 
Run `node ace list:routes` to get a list of all your routes and their names. The name is the first value on the right, before the `›` symbol.
If routes have no name, use the handler instead which typically looks something like `YourController.yourAction`.
