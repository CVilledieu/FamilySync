package server

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// Page renderers
// --------------------
func renderIndex(c echo.Context) error {
	return c.Render(http.StatusOK, "index", nil)
}

func authCheck(c echo.Context) error {
	return c.String(http.StatusOK, "")
}

type AppData struct {
	Names []string `json:"names"`
}

func getAppData(c echo.Context) error {
	nameList, _ := db.getNameList()
	res := AppData{Names: nameList}
	return c.JSON(http.StatusOK, res)
}

func getOtherUsers(c echo.Context) error {
	names, _ := db.getNameList()
	// Remove "admin" from the list if present
	// Will be expanded to a more robust filtering mechanism later to exclude current user
	if names[0] == "admin" {
		names = names[1:]
	}
	return c.JSON(http.StatusOK, names)
}
