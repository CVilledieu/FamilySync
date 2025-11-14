package manager

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type Route struct {
	Path    string
	Method  string
	Handler echo.HandlerFunc
}

func (g *Group) SetRoutes() {
	for _, route := range g.Routes {
		switch route.Method {

		case "GET":
			g.Group.GET(route.Path, route.Handler)
		case "POST":
			g.Group.POST(route.Path, route.Handler)

		}

	}
}

// API Route Design Pattern:
// Routes are organized by resource type, following RESTful conventions.
// - /user/* endpoints handle user-centric operations and data retrieval
// - /event/* endpoints handle event-centric operations and data retrieval
type Group struct {
	Group  *echo.Group
	Name   string
	Conn   *Connection
	Routes map[string]Route
}

type UserGroup Group
type EventGroup Group

// User routes
func CreateUserGroup(c *Connection) *UserGroup {
	var g UserGroup
	g.Name = "/User"
	g.Conn = c

	g.Routes = map[string]Route{
		"Basic": {"/:id/basic", "GET", g.basic},
		"Login": {"/login", "POST", g.loginByCredentials},
	}
	// g.Group = e.Group("/user")
	return &g
}

func (g *UserGroup) loginByCredentials(c echo.Context) error {
	var notSecure Credentials
	c.Bind(notSecure)
	user, err := g.Conn.GetByCredentials(notSecure)
	if err != nil {
		return c.JSON(http.StatusBadRequest, nil)
	}

	return c.JSON(http.StatusOK, ResponseBody{
		"user": user,
	})
}

// Responds with minimum amount required to use web app
func (g *UserGroup) basic(c echo.Context) error {
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

// Event Routes
func CreateEventGroup(c *Connection) *EventGroup {
	var eg EventGroup
	eg.Name = "/event"
	eg.Conn = c
	eg.Routes = map[string]Route{
		"Basic": {"/:id/basic", "GET", eg.basic},
	}
	return &eg
}

// Temp filler handler
func (g *EventGroup) basic(c echo.Context) error {
	return c.NoContent(200)
}
