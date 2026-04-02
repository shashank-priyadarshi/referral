package handler

import (
	"context"
	"path/filepath"

	"github.com/durgeshPandey-dev/referral/apps/api/internal/service"
	"github.com/durgeshPandey-dev/referral/apps/api/internal/utils"
	"github.com/durgeshPandey-dev/referral/apps/api/logger"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(app *fiber.App, svc *service.ReferralService) {

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	app.Post("/upload", func(c *fiber.Ctx) error {
		ctxVal := c.Locals("ctx")
		ctx, ok := ctxVal.(context.Context)
		if !ok {
			ctx = context.Background()
		}

		file, err := c.FormFile("file")
		if err != nil {
			logger.Error(ctx, "file_missing", map[string]interface{}{
				"error": err,
			})
			return c.Status(400).JSON(fiber.Map{"error": "file required"})
		}

		if filepath.Ext(file.Filename) != ".xlsx" {
			logger.Warn(ctx, "invalid_file_type", map[string]interface{}{
				"filename": file.Filename,
			})
			return c.Status(400).JSON(fiber.Map{"error": "only .xlsx allowed"})
		}

		// ✅ USE UTILS HERE
		path, err := utils.SaveUploadedFile(file, "./uploads")
		if err != nil {
			logger.Error(ctx, "file_save_failed", map[string]interface{}{
				"error": err,
			})
			return c.Status(500).JSON(fiber.Map{"error": "failed to save"})
		}

		logger.Info(ctx, "file_uploaded", map[string]interface{}{
			"file": file.Filename,
			"path": path,
		})

		go func(parentCtx context.Context) {
			// extract request id
			reqID := parentCtx.Value(logger.RequestIDKey)

			// new background ctx
			bgCtx := context.Background()

			// reattach request id
			if reqID != nil {
				bgCtx = context.WithValue(bgCtx, logger.RequestIDKey, reqID)
			}

			err := svc.Process(bgCtx, path)
			if err != nil {
				logger.Error(bgCtx, "background_process_failed", map[string]interface{}{
					"error": err,
				})
			}
		}(ctx)

		return c.JSON(fiber.Map{
			"message": "processing started",
		})
	})
}
