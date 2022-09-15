package api

import (
	"context"
	"lets-go/src/adapters/dns/models"
	"lets-go/src/composites"
	"lets-go/src/lib/log"
)

type Handler struct {
	storage *composites.StorageComposite
	logger  log.Logger
}

func NewHandler(storage *composites.StorageComposite) *Handler {
	return &Handler{storage: storage, logger: log.GetLogger()}
}

func (h *Handler) ListRecord(ctx context.Context) *models.DnsListResponse {
	res, err := h.storage.Record.List(ctx)
	if err != nil {
		return &models.DnsListResponse{Status: models.Status_ERR, Message: err.Error()}
	}

	return &models.DnsListResponse{Status: models.Status_OK, Message: "Success", Result: res}
}

func (h *Handler) CreateRecord(ctx context.Context, req *models.DnsRecordRequest) *models.DnsStatResponse {
	if err := h.storage.Record.Create(ctx, req); err != nil {
		return &models.DnsStatResponse{Status: models.Status_ERR, Message: err.Error()}
	}

	return &models.DnsStatResponse{Status: models.Status_OK, Message: "Success"}
}

func (h *Handler) UpdateRecord(ctx context.Context, req *models.DnsUpdateRequest) *models.DnsStatResponse {
	if err := h.storage.Record.Update(ctx, req); err != nil {
		return &models.DnsStatResponse{Status: models.Status_ERR, Message: err.Error()}
	}

	return &models.DnsStatResponse{Status: models.Status_OK, Message: "Success"}
}

func (h *Handler) DeleteRecord(ctx context.Context, req *models.DnsRecordRequest) *models.DnsStatResponse {
	if err := h.storage.Record.Delete(ctx, req); err != nil {
		return &models.DnsStatResponse{Status: models.Status_ERR, Message: err.Error()}
	}

	return &models.DnsStatResponse{Status: models.Status_OK, Message: "Success"}
}
