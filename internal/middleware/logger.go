package middleware

import (
	"context"
	"time"

	"referral-app/pkg/logger"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func RequestMiddleware(timeout time.Duration) fiber.Handler {
	return func(c *fiber.Ctx) error {
		reqID := uuid.NewString()

		ctx, cancel := context.WithTimeout(context.Background(), timeout)
		defer cancel()

		ctx = context.WithValue(ctx, logger.RequestIDKey, reqID)
		c.Locals("ctx", ctx)

		start := time.Now()

		err := c.Next()

		logger.Info(ctx, "request_complete", map[string]interface{}{
			"path":     c.Path(),
			"method":   c.Method(),
			"duration": time.Since(start).Milliseconds(),
			"status":   c.Response().StatusCode(),
		})

		return err
	}
}
