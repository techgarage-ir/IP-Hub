package main

import (
	"fmt"
	"log"
	"os"
	"time"

	minifier "github.com/beyer-stefan/gofiber-minifier"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/template/html/v2"
	"github.com/techgarage-ir/IP-Hub/config"
	"github.com/techgarage-ir/IP-Hub/database"
	"github.com/techgarage-ir/IP-Hub/pluginBase"
)

var plugins []pluginBase.Plugin
var app *fiber.App

func init() {
	// Validate variables
	if config.LookupEndpoint == "" {
		log.Fatal("Lookup service endpoint is not set")
		return
	}
	if config.RedisURL == "" {
		config.RedisURL = "redis://localhost:6379/2"
	}
	if config.Version == "" {
		config.Version = fmt.Sprintf("%v-%v", time.Now().Month(), time.Now().Day())
	}

	// Load plugins
	loadPlugins()

	// Create database connection
	rda := os.Getenv("redis")
	if rda != "" && rda != " " {
		config.RedisURL = "redis://" + rda + "/2"
	}
	// Initialize Redis client
	db, err := database.New()
	if err != nil {
		log.Fatal(err)
		return
	}
	defer db.Close()

	// Create view engine
	engine := html.New("./views", ".html")

	app = fiber.New(fiber.Config{
		Views: engine,
	})

	// Configure rate limiter
	app.Use("/lookup", limiter.New())

	// Configure minifier
	app.Use(minifier.New(minifier.Config{
		MinifyHTML:       true,
		MinifyCSS:        true,
		MinifyJS:         true,
		MinifyJSON:       true,
		SuppressWarnings: true,
	}))

	// Routes
	app.Get("/", handleHome)
	app.Post("/lookup", handleRequest)
	app.Static("/", "./public")
}

func main() {
	log.Fatal(app.Listen(":3000"))
}
