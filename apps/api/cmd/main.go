package main

import (
	"fmt"
	"time"

	"github.com/durgeshPandey-dev/referral/apps/api/internal/config"
	"github.com/durgeshPandey-dev/referral/apps/api/internal/handler"
	"github.com/durgeshPandey-dev/referral/apps/api/internal/middleware"
	"github.com/durgeshPandey-dev/referral/apps/api/internal/queue"
	"github.com/durgeshPandey-dev/referral/apps/api/internal/service"

	"github.com/gofiber/fiber/v3"
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
