import '@japa/runner'

declare module '@japa/runner' {
  interface TestContext {
    // Extend context
  }

  interface Test<TestData> {
    // Extend test
  }
}
