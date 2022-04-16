import { hydrate } from '@microeinhundert/radonis-hydrate'
import { setup, twindConfig } from '@microeinhundert/radonis-twind'

export function initClient() {
  setup(twindConfig)

  return {
    hydrate,
  }
}
