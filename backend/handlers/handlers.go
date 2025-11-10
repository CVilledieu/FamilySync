package handlers

import (
	"FamilySync/backend/data"
	"net/http"

	"github.com/labstack/echo/v4"
)

type HandleCtx struct {
	conn data.Connection
	path string
}

func InitHandlerCtx() *HandleCtx {
	c := data.Init()
	return &HandleCtx{conn: c}
}

func (h *HandleCtx) Home(c echo.Context) error {
	return c.Render(http.StatusOK, "index", nil)
}

func (h *HandleCtx) Login(c echo.Context) error {
	params := c.QueryParams()
	if authenticated {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"status":  "success",
			"token":   "authenticated_user_token",
			"message": "Login successful",
		})
	}

	return c.JSON(http.StatusUnauthorized, map[string]string{
		"status":  "error",
		"message": "Invalid credentials",
	})
}
