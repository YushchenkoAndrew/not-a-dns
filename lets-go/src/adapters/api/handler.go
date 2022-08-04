package api

import (
	"context"
	"lets-go/src/composites"
	"lets-go/src/lib/log"
	"lets-go/src/pb/dnspb"
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
		return &dnspb.ListResponse{Status: dnspb.Status_ERR, Message: err.Error()}, nil
	}

	return &dnspb.ListResponse{Status: dnspb.Status_OK, Message: "Success", Result: res}, nil
}

func (h *Handler) CreateRecord(ctx context.Context, req *dnspb.RecordRequest) (*dnspb.StatResponse, error) {
	if err := h.storage.Record.Create(ctx, req); err != nil {
		return &dnspb.StatResponse{Status: dnspb.Status_ERR, Message: err.Error()}, nil
	}

	return &dnspb.StatResponse{Status: dnspb.Status_OK, Message: "Success"}, nil
}

func (h *Handler) UpdateRecord(ctx context.Context, req *dnspb.UpdateRequest) (*dnspb.StatResponse, error) {
	if err := h.storage.Record.Update(ctx, req); err != nil {
		return &dnspb.StatResponse{Status: dnspb.Status_ERR, Message: err.Error()}, nil
	}

	return &dnspb.StatResponse{Status: dnspb.Status_OK, Message: "Success"}, nil
}

func (h *Handler) DeleteRecord(ctx context.Context, req *dnspb.RecordRequest) (*dnspb.StatResponse, error) {
	if err := h.storage.Record.Delete(ctx, req); err != nil {
		return &dnspb.StatResponse{Status: dnspb.Status_ERR, Message: err.Error()}, nil
	}

	return &dnspb.StatResponse{Status: dnspb.Status_OK, Message: "Success"}, nil
}
