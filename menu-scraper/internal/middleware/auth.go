package middleware

import "github.com/gofiber/fiber/v2"

func Auth(apiKey string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		clientKey := c.Get("X-Internal-Key")

		if clientKey == "" || clientKey != apiKey {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized access",
			})
		}

		return c.Next()
	}
}
