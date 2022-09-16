package router

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"lets-go/src/adapters/api"
	"lets-go/src/adapters/dns/models"
	"lets-go/src/lib/log"
	"lets-go/src/pb"
	"net/http"
)

type storage struct {
	cache pb.CacheServiceClient
}

func NewRouter(h *api.Handler) {
	http.HandleFunc("/dns/api", func(w http.ResponseWriter, r *http.Request) {
		log.GetLogger().Infof("%s %s", r.Method, r.RemoteAddr)

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		w.Header().Set("Content-Type", "application/json")

		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			json.NewEncoder(w).Encode(models.DnsStatResponse{Status: models.Status_ERR, Message: err.Error()})
			return
		}

		switch r.Method {
		case http.MethodGet:
			json.NewEncoder(w).Encode(h.ListRecord(context.Background()))

		case http.MethodPost:
			var req = &models.DnsRecordRequest{}
			if err = json.Unmarshal(body, req); err != nil {
				json.NewEncoder(w).Encode(models.DnsStatResponse{Status: models.Status_ERR, Message: err.Error()})
				return
			}

			json.NewEncoder(w).Encode(h.CreateRecord(context.Background(), req))

		case http.MethodPut:
			var req = &models.DnsUpdateRequest{}
			if err = json.Unmarshal(body, req); err != nil {
				json.NewEncoder(w).Encode(models.DnsStatResponse{Status: models.Status_ERR, Message: err.Error()})
				return
			}

			json.NewEncoder(w).Encode(h.UpdateRecord(context.Background(), req))

		case http.MethodDelete:
			var req = &models.DnsRecordRequest{}
			if err = json.Unmarshal(body, req); err != nil {
				json.NewEncoder(w).Encode(models.DnsStatResponse{Status: models.Status_ERR, Message: err.Error()})
				return
			}

			json.NewEncoder(w).Encode(h.DeleteRecord(context.Background(), req))
		}
	})
}
