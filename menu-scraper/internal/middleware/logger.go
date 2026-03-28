package middleware

import (
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
)

func Logger() fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := time.Now()

		err := c.Next()

		duration := time.Since(start)
		status := c.Response().StatusCode()
		method := c.Method()
		path := c.Path()
		ip := c.IP()

		log.Printf("[%d] %-7s %s (%s) - %s", status, method, path, duration, ip)

		return err
	}
}
