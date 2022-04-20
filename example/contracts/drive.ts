declare module '@ioc:Adonis/Core/Drive' {
  interface DisksList {
    local: {
      config: LocalDriverConfig
      implementation: LocalDriverContract
    }
    // s3: {
    //   config: S3DriverConfig
    //   implementation: S3DriverContract
    // }
    // gcs: {
    //   config: GcsDriverConfig
    //   implementation: GcsDriverContract
    // }
  }
}
