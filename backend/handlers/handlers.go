package handlers

import (
	"FamilySync/backend/data"
	"fmt"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type Handlers struct {
	Echo        *echo.Echo
	Event_Group *EventGroup
	User_Group  *UserGroup
}

type Manager struct {
	Echo          *echo.Echo
	HashSalt      int
	PublicGroups  []*Group
	PrivateGroups []*Group
}

type ResponseBody map[string]interface{}

type EventGroup Group
type UserGroup Group

type Group struct {
	Group  *echo.Group
	Conn   *data.Connection
	Routes map[string]Route
}

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

func New(e *echo.Echo) Manager {
	newManager := Manager{}

	port, salt := getF
}

func InitCtx(salt int) *Handlers {
	data := data.InitConn(salt)
	ctx := new(Handlers)

	//Source of truth
	// ROUTES := map[string]Route{
	// 	//Get requests
	// 	"EventsByUserId":   {"/events/user/:id", "GET", ctx.GetEvents},
	// 	"BaseDataByUserId": {"/base/:id", "GET", ctx.GetBaseData},

	// 	//Post requests
	// 	"Login": {"/login", "POST", ctx.Login},
	// 	"NewEvent":{"/events/new/user/:id","POST",ctx.PostEvent}
	// }

	// NON_PUBLIC_ROUTES := map[string]Route{
	// 	"Admin": {"/admin/access", "GET", nil},
	// }
	ctx.Event_Group = CreateEventGroup()

	return ctx
}

func (h *Handlers) GetPublicRoutes() map[string]string {
	routes := make(map[string]string)
	for name, route := range h.Routes {
		routes[name] = route.Path
	}
	return routes
}

func (h *Handlers) Home(c echo.Context) error {
	return c.Render(http.StatusOK, "index", nil)
}

func (h *Handlers) Login(c echo.Context) error {
	credentials := new(Credentials)
	err := c.Bind(credentials)
	if err != nil {
		return err
	}

	user := h.Conn.ValidateByUP(credentials.Username, credentials.Password)
	if user == nil {
		return c.JSON(http.StatusUnauthorized, ResponseBody{
			"status":  "error",
			"message": "Invalid credentials",
		})
	}
	return c.JSON(http.StatusOK, ResponseBody{
		"status":  "success",
		"message": "Login successful",
		"user":    user,
		"routes":  h.GetPublicRoutes(),
	})
}

func (h *Handlers) GetBaseData(c echo.Context) error {
	userId := c.Param("user_id")
	famId := c.Param("family_id")
	uId, _ := strconv.Atoi(userId)
	fId, _ := strconv.Atoi(famId)
	events := h.Conn.EventsByUserId(uId)
	family := h.Conn.GetFamilyMembersByFamId(fId)
	return c.JSON(http.StatusOK, ResponseBody{
		"events": events,
		"family": family,
	})
}

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
