package middleware

import (
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
)

func Logger() fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := time.Now()
		c.Next()
		duration := time.Since(start)
		log.Printf("%s %s %s", c.Method(), c.Path(), duration)

		return nil
	}
}
