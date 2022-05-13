declare module '@ioc:Adonis/Addons/Radonis' {
  interface Globals {}

  interface ManifestContract extends Radonis.Manifest {
    globals: Globals
  }
}
