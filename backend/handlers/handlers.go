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

	authenticated := h.Conn.ValidateUser(username, password)
	if authenticated {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"status":  "success",
			"message": "Login successful",
		})
	}

	return c.JSON(http.StatusUnauthorized, map[string]string{
		"status":  "error",
		"message": "Invalid credentials",
	})
}

func formatResponse(status, message string, respData map[string]interface{}) map[string]interface{} {

	response := map[string]interface{}{
		"status":  status,
		"message": message,
	}
	if respData != nil {

	}
	return response
}

// func authRequest(c echo.Context) error {
// 	params := c.QueryParams()
// 	u := params.Get("username")
// 	p := params.Get("password")
// 	userdata := Conn.getUserData(u, p)

// 	if userdata != nil {

// 		return c.JSON(http.StatusOK, map[string]interface{}{
// 			"status":  "success",
// 			"token":   "authenticated_user_token",
// 			"message": "Login successful",
// 		})
// 	}

// 	return c.JSON(http.StatusUnauthorized, map[string]string{
// 		"status":  "error",
// 		"message": "Invalid credentials",
// 	})
// }
