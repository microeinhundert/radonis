/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {
  Exception,
  interpolate,
} from '@microeinhundert/radonis-shared'

import {
  E_CANNOT_HYDRATE_COMPONENT,
  E_CANNOT_HYDRATE_COMPONENT_WITH_CHILDREN,
  E_CANNOT_RENDER_VIEW,
  E_CANNOT_SERIALIZE_MANIFEST,
  E_MISSING_CLIENT_ENTRY_FILE,
  E_MISSING_COMPONENTS_DIRECTORY,
} from '../../exceptions.json'

/**
 * Exceptions related to the server
 * @internal
 */
export class ServerException extends Exception {
  static missingClientEntryFile(path: string) {
    const error = new this(
      interpolate(E_MISSING_CLIENT_ENTRY_FILE.message, {
        path,
      }),
      E_MISSING_CLIENT_ENTRY_FILE.status,
      E_MISSING_CLIENT_ENTRY_FILE.code
    )

    throw error
  }
  static missingComponentsDirectory(path: string) {
    const error = new this(
      interpolate(E_MISSING_COMPONENTS_DIRECTORY.message, {
        path,
      }),
      E_MISSING_COMPONENTS_DIRECTORY.status,
      E_MISSING_COMPONENTS_DIRECTORY.code
    )

    throw error
  }
  static cannotSerializeManifest() {
    const error = new this(
      E_CANNOT_SERIALIZE_MANIFEST.message,
      E_CANNOT_SERIALIZE_MANIFEST.status,
      E_CANNOT_SERIALIZE_MANIFEST.code
    )

    throw error
  }
  static cannotHydrateComponent(
    componentIdentifier: string,
    hydrationRootIdentifier: string
  ) {
    const error = new this(
      interpolate(E_CANNOT_HYDRATE_COMPONENT.message, {
        componentIdentifier,
        hydrationRootIdentifier,
      }),
      E_CANNOT_HYDRATE_COMPONENT.status,
      E_CANNOT_HYDRATE_COMPONENT.code
    )

    throw error
  }
  static cannotHydrateComponentWithChildren(
    componentIdentifier: string,
    hydrationRootIdentifier: string
  ) {
    const error = new this(
      interpolate(
        E_CANNOT_HYDRATE_COMPONENT_WITH_CHILDREN.message,
        {
          componentIdentifier,
          hydrationRootIdentifier,
        }
      ),
      E_CANNOT_HYDRATE_COMPONENT_WITH_CHILDREN.status,
      E_CANNOT_HYDRATE_COMPONENT_WITH_CHILDREN.code
    )

    throw error
  }
  static cannotRenderView() {
    const error = new this(
      E_CANNOT_RENDER_VIEW.message,
      E_CANNOT_RENDER_VIEW.status,
      E_CANNOT_RENDER_VIEW.code
    )

    throw error
  }
}
