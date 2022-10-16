/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*
 * Client-side hooks
 */
export { useMutation } from './hooks/client/useMutation'

/*
 * Isomorphic hooks
 */
export { useFlashMessages } from './hooks/isomorphic/useFlashMessages'
export { useFlushEffect } from './hooks/isomorphic/useFlushEffect'
export { useGlobals } from './hooks/isomorphic/useGlobals'
export { useI18n } from './hooks/isomorphic/useI18n'
export { useManifest } from './hooks/isomorphic/useManifest'
export { useRoute } from './hooks/isomorphic/useRoute'
export { useRoutes } from './hooks/isomorphic/useRoutes'
export { useUrlBuilder } from './hooks/isomorphic/useUrlBuilder'

/*
 * Server-side hooks
 */
export { useApplication } from './hooks/server/useApplication'
export { useAssetsManager } from './hooks/server/useAssetsManager'
export { useHttpContext } from './hooks/server/useHttpContext'
export { useManifestManager } from './hooks/server/useManifestManager'
export { useRenderer } from './hooks/server/useRenderer'
export { useRequest } from './hooks/server/useRequest'
export { useRouter } from './hooks/server/useRouter'
export { useServer } from './hooks/server/useServer'
export { useSession } from './hooks/server/useSession'

/*
 * Types
 */
export type { MutationHooks, MutationOptions, MutationStatus } from './types'
