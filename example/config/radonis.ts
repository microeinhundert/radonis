import type { RadonisConfig } from '@ioc:Adonis/Addons/Radonis'
import Application from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'

const radonisConfig: RadonisConfig = {
  /*
  |--------------------------------------------------------------------------
  | Production Mode
  |--------------------------------------------------------------------------
  |
  | Enabling production mode will minify
  | and set the environment accordingly.
  |
  */
  productionMode: Env.get('NODE_ENV') === 'production',

  /*
  |--------------------------------------------------------------------------
  | Components Dir
  |--------------------------------------------------------------------------
  |
  | The directory that contains all the components
  | to be built for hydration on the client.
  |
  */
  componentsDir: Application.resourcesPath('components'),

  /*
  |--------------------------------------------------------------------------
  | Client Bundle Output Dir
  |--------------------------------------------------------------------------
  |
  | The directory the built client bundle
  | should be written to.
  |
  */
  clientBundleOutputDir: Application.publicPath('client'),

  /*
  |--------------------------------------------------------------------------
  | Limit Client Manifest
  |--------------------------------------------------------------------------
  |
  | Limit the client manifest to only include data
  | required for hydration on the client.
  |
  */
  limitClientManifest: true,
}

export default radonisConfig
