package server

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

const INDEX_PATH string = "./app/public/views/*.html"

func Run() {
	e := echo.New()
	e.Renderer = newTemplate(INDEX_PATH)

	// Initialize database
	//db = InitConnection()

	// Serve static files for authenticated users (from ./app/private)
	e.Use(serve_Public_Static())
	e.Use(serve_Authenticated_Static())

	e.GET("/", newRequest)

	e.GET("/login", apiHandler)

	var PORT = getPort()
	e.Logger.Fatal(e.Start(PORT))
}

func newRequest(c echo.Context) error {
	return c.Render(http.StatusOK, "index", nil)
}

func apiHandler(c echo.Context) error {
	return c.String(http.StatusOK, "API is working")
}

// File serving based on authentication
func serve_Public_Static() echo.MiddlewareFunc {
	return middleware.StaticWithConfig(middleware.StaticConfig{
		Root: "./app/public",
	})
}
func serve_Authenticated_Static() echo.MiddlewareFunc {
	return middleware.StaticWithConfig(middleware.StaticConfig{
		Root: "./app/private",
		Skipper: func(c echo.Context) bool {
			return !isAuthenticated(c)
		},
	})
}
