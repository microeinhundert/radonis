import type { RadonisConfig } from '@ioc:Adonis/Addons/Radonis'
import Application from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'

const radonisConfig: RadonisConfig = {
  /*
  |--------------------------------------------------------------------------
  | Production mode
  |--------------------------------------------------------------------------
  |
  | Enabling production mode will minify
  | and set the environment accordingly.
  |
  */
  productionMode: Env.get('NODE_ENV') === 'production',

  client: {
    /*
    |--------------------------------------------------------------------------
    | Root dir
    |--------------------------------------------------------------------------
    */
    rootDir: Application.resourcesPath(),

    /*
    |--------------------------------------------------------------------------
    | Components dir
    |--------------------------------------------------------------------------
    |
    | Must be relative to `rootDir`.
    |
    */
    componentsDir: 'components',

    /*
    |--------------------------------------------------------------------------
    | Entry file
    |--------------------------------------------------------------------------
    |
    | Must be relative to `rootDir`.
    |
    */
    entryFile: 'client.entry.ts',

    /*
    |--------------------------------------------------------------------------
    | Output dir
    |--------------------------------------------------------------------------
    |
    | Directory the built client bundle gets written to.
    |
    */
    outputDir: Application.publicPath('radonis'),

    /*
    |--------------------------------------------------------------------------
    | Limit manifest
    |--------------------------------------------------------------------------
    |
    | Limit the client manifest to only include data
    | required for hydration on the client.
    |
    */
    limitManifest: true,
  },

  /*
  |--------------------------------------------------------------------------
  | Build options
  |--------------------------------------------------------------------------
  |
  | Allows overriding the build options used
  | by esbuild for bundling the client.
  |
  | Use with caution: This is only an escape hatch.
  | Overriding the options can break the build.
  |
  */
  buildOptions: {},
}

export default radonisConfig
