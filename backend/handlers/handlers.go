package handlers

import (
	"FamilySync/backend/data"
	"net/http"

	"github.com/labstack/echo/v4"
)

type HandleCtx struct {
	Conn *data.Connection
}

func InitCtx(salt int) *HandleCtx {
	data := data.InitConn(salt)
	return &HandleCtx{Conn: data}
}

func (h *HandleCtx) Home(c echo.Context) error {
	return c.Render(http.StatusOK, "index", nil)
}

func (h *HandleCtx) Login(c echo.Context) error {
	params := c.QueryParams()
	username := params.Get("username")
	password := params.Get("password")
	user := h.Conn.GetUser(username, password)
	if user != nil {

		return c.JSON(http.StatusOK, map[string]interface{}{
			"status":    "success",
			"message":   "Login successful",
			"user_id":   user.User_ID,
			"user_name": user.Name,
			"family_id": user.Family_ID,
		})
	}

	return c.JSON(http.StatusUnauthorized, map[string]string{
		"status":  "error",
		"message": "Invalid credentials",
	})
}
