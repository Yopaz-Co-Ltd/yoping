package database

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/ClickHouse/clickhouse-go/v2"
	"github.com/ClickHouse/clickhouse-go/v2/lib/driver"
)

var DBConn driver.Conn

func InitClickhouseConnection() {
	var err error
	DBConn, err = clickhouse.Open(&clickhouse.Options{
		Addr: []string{os.Getenv("CLICKHOUSE_ADDR")},
		Auth: clickhouse.Auth{
			Database: os.Getenv("CLICKHOUSE_DB"),
			Username: os.Getenv("CLICKHOUSE_USER"),
			Password: os.Getenv("CLICKHOUSE_PASSWORD"),
		},
		DialTimeout: 5 * time.Second,
	})
	if err != nil {
		log.Fatalf("failed to create ClickHouse connection: %v", err)
	}

	if err := DBConn.Ping(context.Background()); err != nil {
		log.Fatalf("failed to ping ClickHouse: %v", err)
	}
	log.Println("Connected to ClickHouse successfully!")
}
