package api

import (
	"context"
	"lets-go/src/composites"
	"lets-go/src/lib/log"
	"lets-go/src/pb"
)

type Handler struct {
	pb.UnimplementedDnsServiceServer
	storage *composites.StorageComposite
	logger  log.Logger
}

func NewHandler(storage *composites.StorageComposite) *Handler {
	return &Handler{storage: storage, logger: log.GetLogger()}
}

func (h *Handler) ListRecord(ctx context.Context, req *pb.DnsRequest) (*pb.DnsListResponse, error) {
	res, err := h.storage.Record.List(ctx, req)
	if err != nil {
		return &pb.DnsListResponse{Status: pb.Status_ERR, Message: err.Error()}, nil
	}

	return &pb.DnsListResponse{Status: pb.Status_OK, Message: "Success", Result: res}, nil
}

func (h *Handler) CreateRecord(ctx context.Context, req *pb.DnsRecordRequest) (*pb.DnsStatResponse, error) {
	if err := h.storage.Record.Create(ctx, req); err != nil {
		return &pb.DnsStatResponse{Status: pb.Status_ERR, Message: err.Error()}, nil
	}

	return &pb.DnsStatResponse{Status: pb.Status_OK, Message: "Success"}, nil
}

func (h *Handler) UpdateRecord(ctx context.Context, req *pb.DnsUpdateRequest) (*pb.DnsStatResponse, error) {
	if err := h.storage.Record.Update(ctx, req); err != nil {
		return &pb.DnsStatResponse{Status: pb.Status_ERR, Message: err.Error()}, nil
	}

	return &pb.DnsStatResponse{Status: pb.Status_OK, Message: "Success"}, nil
}

func (h *Handler) DeleteRecord(ctx context.Context, req *pb.DnsRecordRequest) (*pb.DnsStatResponse, error) {
	if err := h.storage.Record.Delete(ctx, req); err != nil {
		return &pb.DnsStatResponse{Status: pb.Status_ERR, Message: err.Error()}, nil
	}

	return &pb.DnsStatResponse{Status: pb.Status_OK, Message: "Success"}, nil
}
