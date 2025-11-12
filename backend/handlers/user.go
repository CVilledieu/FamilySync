package handlers

import (
	"FamilySync/backend/data"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

func CreateUserGroup(c *data.Connection, e *echo.Echo) *UserGroup {
	g := new(UserGroup)
	g.Conn = c
	g.Routes = map[string]Route{
		//"User_EventData":   {"/:id/eventlist", "GET", g.EventList},
		"User_GeneralData": {"/:id/general", "GET", g.GeneralData},
		"Founding":         {"/:id/Founding", "GET", g.Foundational},
	}
	g.Group = e.Group("/user")
	(*Group)(g).SetRoutes()
	return g
}

// Responds with minimum amount required to use web app
func (g *UserGroup) Foundational(c echo.Context) error {
	user := c.Param("user_id")
	family := c.Param("family_id")
	u, _ := strconv.Atoi(user)
	f, _ := strconv.Atoi(family)
	eList := g.Conn.EventsByUserId(u)
	fList := g.Conn.GetFamilyMembersByFamId(f)
	return c.JSON(http.StatusOK, ResponseBody{
		"events": eList,
		"family": fList,
	})
}

// func (g *UserGroup) EventList(c echo.Context) error {

// }

func (g *UserGroup) GeneralData(c echo.Context) error {
	return c.NoContent(200)
}
