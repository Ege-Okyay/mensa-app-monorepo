package main

import (
	"log"

	"github.com/Ege-Okyay/mensa-app-monorepo/internal/handlers"
	"github.com/Ege-Okyay/mensa-app-monorepo/internal/middleware"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	app := fiber.New()

	app.Use(middleware.Logger())

	app.Get("/scrape", handlers.ScrapeAndAnalyze())

	log.Fatal(app.Listen(":3000"))
}
