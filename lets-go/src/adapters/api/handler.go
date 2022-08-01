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

func (h *Handler) ListRecord(ctx context.Context, req *dnspb.Request) (*dnspb.ListResponse, error) {
	res, err := h.storage.Record.List(ctx, req)
	if err != nil {
		return nil, err
	}

	return &dnspb.ListResponse{Status: dnspb.Status_OK, Message: "Success", Result: res}, nil
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
