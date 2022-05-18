/*
 * @microeinhundert/radonis-manifest
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export const propsFixtureOne = {
  stringProp: 'hello world',
  numericProp: 123,
  arrayProp: [1, 2, 3],
  objectProp: {
    stringProp: 'hello world',
    numericProp: 123,
    arrayProp: [1, 2, 3],
  },
  dateProp: new Date(),
}

export const propsFixtureNonSerializable = {
  ...propsFixtureOne,
  nonSerializableProp: BigInt(1),
}

export const propsFixtureTwo = {
  ...propsFixtureOne,
  additionalProp: 123,
}
