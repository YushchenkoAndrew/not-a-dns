package api

import (
	"context"
	"lets-go/src/composites"
	"lets-go/src/lib/log"
	"lets-go/src/pb/dnspb"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type Handler struct {
	dnspb.UnimplementedDnsServiceServer
	storage *composites.StorageComposite
	logger  log.Logger
}

func NewHandler(storage *composites.StorageComposite) *Handler {
	return &Handler{storage: storage, logger: log.GetLogger()}
}

func (h *Handler) ListRecord(ctx context.Context, _ *dnspb.Request) (*dnspb.ListResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method List not implemented")
}
func (h *Handler) CreateRecord(context.Context, *dnspb.RecordRequest) (*dnspb.StatResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Create not implemented")
}
func (h *Handler) UpdateRecord(context.Context, *dnspb.RecordRequest) (*dnspb.StatResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Update not implemented")
}
func (h *Handler) DeleteRecord(context.Context, *dnspb.RecordRequest) (*dnspb.StatResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Delete not implemented")
}
