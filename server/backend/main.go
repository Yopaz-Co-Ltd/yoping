package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"
	"yoping-server-backend/database"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	database.InitClickhouseConnection()
	database.Migrate()

	// Init Gin
	r := gin.Default()

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	r.GET("/clickhouse", func(c *gin.Context) {
		var now time.Time
		if err := database.DBConn.QueryRow(context.Background(), "SELECT now()").Scan(&now); err != nil {
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
