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
    | Entry file
    |--------------------------------------------------------------------------
    */
    entryFile: Application.resourcesPath('client.entry.ts'),

    /*
    |--------------------------------------------------------------------------
    | Components dir
    |--------------------------------------------------------------------------
    */
    componentsDir: Application.resourcesPath('components'),

    /*
    |--------------------------------------------------------------------------
    | Output dir
    |--------------------------------------------------------------------------
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
