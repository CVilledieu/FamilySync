package server

import (
	"crypto/subtle"
	"fmt"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

// Authentication check for middleware. Adjusting static file serving based on auth status
func isAuthenticated(c echo.Context) bool {
	username := c.FormValue("username")
	// password := c.QueryParam("password")

	if username == "user" {
		fmt.Println(username)
		return true
	}
	return false
}

func serve_Authenticated_Static() echo.MiddlewareFunc {
	return middleware.StaticWithConfig(middleware.StaticConfig{
		Root: "./app/private",
		Skipper: func(c echo.Context) bool {
			return !isAuthenticated(c)
		},
	})
}

func BasicAuthMiddleware() echo.MiddlewareFunc {
	return middleware.BasicAuth(func(username, password string, c echo.Context) (bool, error) {
		if subtle.ConstantTimeCompare([]byte(username), []byte("admin")) == 1 && subtle.ConstantTimeCompare([]byte(password), []byte("password")) == 1 {
			return true, nil
		}
		return false, nil
	})
}
