declare module "@ioc:Adonis/Core/Env" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  type CustomTypes = typeof import("../env").default;
  interface EnvTypes extends CustomTypes {}
}
