fn main() {
  tonic_build::configure()
    .build_client(false)
    .out_dir("./src/pb")
    .compile(
      &[
        "../proto/main_service.proto",
        "../proto/cache_service.proto",
        "../proto/dns_service.proto",
        "../proto/basic_service.proto",
      ],
      &["../"],
    )
    .unwrap();
}
