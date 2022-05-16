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
