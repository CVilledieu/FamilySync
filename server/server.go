package server

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

const INDEX_PATH string = "./app/public/views/*.html"

var DEV_WIDGETS = []map[string]string{
	{"name": "Home", "path": "./"},
	{"name": "Calendar", "path": "./"},
}

var WIDGETS = []map[string]string{}

func Run() {
	setGlobals("DEV")

	e := echo.New()
	e.Renderer = newTemplate(INDEX_PATH)

	// Initialize database
	//db = InitConnection()

	// Serve static files for authenticated users (from ./app/private)
	e.Use(serve_Authenticated_Static())
	e.Use(serve_Public_Static())

	e.GET("/", newRequest)

	e.GET("/login", apiHandler)

	var PORT = getPort()
	e.Logger.Fatal(e.Start(PORT))
}

func newRequest(c echo.Context) error {
	return c.Render(http.StatusOK, "index", nil)
}

func apiHandler(c echo.Context) error {
	params := c.QueryParams()
	u := params.Get("username")
	p := params.Get("password")

	if u == "admin" && p == "password" {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"status":  "success",
			"token":   "authenticated_user_token",
			"message": "Login successful",
			"widgets": WIDGETS,
		})
	}

	return c.JSON(http.StatusUnauthorized, map[string]string{
		"status":  "error",
		"message": "Invalid credentials",
	})
}

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

func setGlobals(state string) {
	if state == "PROD" {

	} else {
		WIDGETS = DEV_WIDGETS
	}
}
