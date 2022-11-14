declare module '@microeinhundert/radonis-types' {
  /*
  |--------------------------------------------------------------------------
  | Define typed globals
  |--------------------------------------------------------------------------
  |
  | You can define types for globals inside the following interface and
  | Radonis will make sure that all usages of globals adhere
  | to the defined types.
  |
  | For example:
  |
  | interface Globals {
  |   hello: string
  | }
  |
  | Now calling `radonis.withGlobals({ hello: 'Hello world!' })` will statically ensure correct types.
  |
  */
  interface Globals {}
}
