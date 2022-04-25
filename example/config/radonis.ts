import type { RadonisConfig } from '@ioc:Adonis/Addons/Radonis'
import Application from '@ioc:Adonis/Core/Application'

const radonisConfig: RadonisConfig = {
  client: {
    /*
    |--------------------------------------------------------------------------
    | Entry file
    |--------------------------------------------------------------------------
    |
    | The entry file is where the client library is initialized.
    | You can also use this file to include your own scripts
    | that are not bound to a specific component "Island".
    |
    */
    entryFile: Application.resourcesPath('entry.client.ts'),

    /*
    |--------------------------------------------------------------------------
    | Components dir
    |--------------------------------------------------------------------------
    |
    | The directory where all your React components are located in.
    | These components will be built for the client
    | and are therefore hydratable.
    |
    */
    componentsDir: Application.resourcesPath('components'),

    /*
    |--------------------------------------------------------------------------
    | Output dir
    |--------------------------------------------------------------------------
    |
    | The directory where the client bundle will be written to.
    | If you change this to some directory outside the public directory,
    | make sure to setup the webserver accordingly in order for the client
    | assets to be publicly accessible.
    |
    */
    outputDir: Application.publicPath('radonis'),

    /*
    |--------------------------------------------------------------------------
    | Limit manifest
    |--------------------------------------------------------------------------
    |
    | Limit the client manifest to only include data required for client-side
    | hydration. Disable this if you have some use case that requires
    | all data to be available at all times.
    |
    */
    limitManifest: true,

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
  },
}

export default radonisConfig
