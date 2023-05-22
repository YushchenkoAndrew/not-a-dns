FROM golang:1.18-alpine AS go-builder
RUN apk --no-cache add ca-certificates gcc g++ make bash git
WORKDIR /app

ENV GIN_MODE=release
ENV GO111MODULE=on

# Fetch dependencies
COPY lets-go/* .
RUN go mod download

# Build proto
COPY proto/ ./
RUN protoc proto/*.proto --go-grpc_out=./src --go_out=./src

RUN go build -o ./lets-go ./main.go

# TODO:

FROM rust:1.62.1 as rust-builder
WORKDIR /app

# Build
COPY lets-rust-it/* .
RUN cargo build --release


# Create final image
FROM alpine AS runner
WORKDIR /

ENV GIN_MODE=release
ENV CACHE_ADDR=127.0.0.1:50031

# Copy config file & complied file
COPY .env.template .env
COPY lets-go/config/config.yaml .
COPY --from=go-builder /app/lets-go .

# Copy complied file
COPY --from=rust-builder /app/target/release/lets-rust-it .

EXPOSE 50053
CMD ["./lets-go 0.0.0.0 50053 ./config.yaml"]
