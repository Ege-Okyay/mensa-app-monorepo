package handlers

import (
	"github.com/Ege-Okyay/mensa-app-monorepo/utils"
	"github.com/gofiber/fiber/v2"
)

func ScrapeData(c *fiber.Ctx) error {
	jsonResp, err := utils.ScrapeData()
	if err != nil {
		c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	imgs, err := utils.GetImageLinks(jsonResp)
	if err != nil {
		c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return c.JSON(fiber.Map{
		"images": imgs,
	})
}
