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

export const propsFixtureTwo = {
  stringProp: 'hello world',
  numericProp: 123,
  arrayProp: [1, 2, 3],
  additionalProp: 123,
}

export const propsFixtureThree = {
  numericProp: 123,
  arrayProp: [1, 2, 3],
  dateProp: new Date(),
  nonSerializableProp: BigInt(1),
}
