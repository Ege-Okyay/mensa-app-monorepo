package main

import (
	"log"

	"github.com/Ege-Okyay/mensa-app-monorepo/handlers"
	"github.com/Ege-Okyay/mensa-app-monorepo/middleware"
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	app.Use(middleware.Logger())

	app.Get("/scrape", handlers.ScrapeData)

	log.Fatal(app.Listen(":3000"))
}
