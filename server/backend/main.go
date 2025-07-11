package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/ClickHouse/clickhouse-go/v2"
	"github.com/gin-gonic/gin"
)

func main() {
	// Init ClickHouse connection
	conn, err := clickhouse.Open(&clickhouse.Options{
		Addr: []string{getEnv("CLICKHOUSE_ADDR", "127.0.0.1:9000")},
		Auth: clickhouse.Auth{
			Database: getEnv("CLICKHOUSE_DB", "default"),
			Username: getEnv("CLICKHOUSE_USER", "default"),
			Password: getEnv("CLICKHOUSE_PASSWORD", "mypassword"),
		},
		DialTimeout: 5 * time.Second,
	})
	if err != nil {
		log.Fatalf("failed to create ClickHouse connection: %v", err)
	}

	// Test connection
	if err := conn.Ping(context.Background()); err != nil {
		log.Fatalf("failed to ping ClickHouse: %v", err)
	}
	log.Println("Connected to ClickHouse successfully!")

	// Init Gin
	r := gin.Default()

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	r.GET("/clickhouse", func(c *gin.Context) {
		var now time.Time
		if err := conn.QueryRow(context.Background(), "SELECT now()").Scan(&now); err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{"clickhouse_now": now})
	})

	fmt.Println("Server running at :8080")
	r.Run(":8080")
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
