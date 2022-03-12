fn main() {
  tonic_build::configure()
    .build_client(false)
    .out_dir("./src/pb")
    .compile(&["../proto/cache_service.proto"], &["../proto"])
    .unwrap();
}
