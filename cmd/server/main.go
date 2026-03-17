package main

import (
	"fmt"
	"time"

	"referral-app/internal/config"
	"referral-app/internal/handler"
	"referral-app/internal/middleware"
	"referral-app/internal/queue"
	"referral-app/internal/service"

	"github.com/gofiber/fiber/v2"
)

func main() {
	cfg := config.Load()

	app := fiber.New()

	// Middleware
	app.Use(middleware.RequestMiddleware(
		time.Duration(cfg.RequestTimeoutSeconds) * time.Second,
	))

	// Queue + Workers
	q := queue.NewQueue(cfg.QueueSize)
	q.StartWorkers(cfg.WorkerCount)

	// Service
	svc := service.NewReferralService(q)

	// Routes
	handler.RegisterRoutes(app, svc)

	fmt.Println("Server running on port:", cfg.Port)

	if err := app.Listen(":" + cfg.Port); err != nil {
		panic(err)
	}
}
