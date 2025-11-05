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

// Authentication check for middleware. Adjusting static file serving based on auth status
func isAuthenticated(c echo.Context) bool {
	/*
		username := c.QueryParam("username")
		password := c.QueryParam("password")
		valid, err := db.GetValidateUser(username, password)
		if err != nil || !valid {
			return false
		}
		return true
	*/
	// For now, return false (not authenticated) to test unauthenticated flow
	return true
}

func updatePage(c echo.Context) error {

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
