package composites

import (
	dnsRecord "lets-go/src/adapters/dns/record"
	"lets-go/src/domain/record"
)

type StorageComposite struct {
	Record record.Storage
}

func NewStorageComposite() *StorageComposite {
	return &StorageComposite{Record: dnsRecord.NewStorage()}
}
