package handlers

import (
	"fmt"

	"github.com/labstack/echo/v4"
)

// Middleware approach
// func DataConnection(conn data.Connection) echo.MiddlewareFunc {
// 	return func(next echo.HandlerFunc) echo.HandlerFunc {
// 		return func(c echo.Context) error {
// 			c.Set("dataConn", conn)
// 			return next(c)
// 		}
// 	}
// }

func isAuthenticated(c echo.Context) bool {
	params := c.QueryParams()

	// Checking for token
	token := params.Get("token")
	if token == "authenticated_user_token" {
		fmt.Println("User authenticated via token")
		return true
	}

	// Temp login info during dev
	u := params.Get("username")
	p := params.Get("password")
	if u == "admin" && p == "password" {
		fmt.Println("User authenticated via credentials")
		return true
	}

	fmt.Println("User not authenticated")
	return false
}
