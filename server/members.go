package api

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func MembersHandler(c echo.Context) error {
	members := []map[string]string{
		{"name": "Dad"},
		{"name": "Mom"},
	}
	return c.JSON(http.StatusOK, members)
}
