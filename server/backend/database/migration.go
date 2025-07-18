package database

import (
	"context"
	"log"
)

func Migrate() {
	ctx := context.Background()
	if err := DBConn.Ping(ctx); err != nil {
		log.Fatalf("Ping thất bại: %v\n", err)
	}

	createDevicesTable := `
		CREATE TABLE IF NOT EXISTS devices (
			uuid UUID,
    		os String,
			created_at DateTime DEFAULT now()
		) ENGINE = MergeTree()
		ORDER BY (created_at, uuid);
	`

	if err := DBConn.Exec(ctx, createDevicesTable); err != nil {
		log.Fatalf("Lỗi tạo bảng devices: %v\n", err)
	}

	createNetworkLogsTable := `
		CREATE TABLE IF NOT EXISTS network_logs (
			device_uuid UUID,
			public_ip String,
			type Enum8('wifi' = 1, 'wired' = 2),
			ssid Nullable(String),
			band Nullable(String),
			rssi Nullable(Int32),

			ping_public_ip_avg Float64,
			ping_public_ip_min Float64,
			ping_public_ip_max Float64,
			ping_public_ip_count Int32,
			ping_public_ip_loss Int32,

			ping_domestic_avg Float64,
			ping_domestic_min Float64,
			ping_domestic_max Float64,
			ping_domestic_count Int32,
			ping_domestic_loss Int32,

			ping_international_avg Float64,
			ping_international_min Float64,
			ping_international_max Float64,
			ping_international_count Int32,
			ping_international_loss Int32,

			created_at DateTime DEFAULT now()
		) ENGINE = MergeTree()
		ORDER BY (created_at, device_uuid);
	`

	if err := DBConn.Exec(ctx, createNetworkLogsTable); err != nil {
		log.Fatalf("Lỗi tạo bảng network_logs: %v\n", err)
	}
}
