package handlers

import (
	"FamilySync/backend/data"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

//Group for requests for '/events'
//Requests that originate from the perspective of an event
//Example: Request to find all events on a date or all users related to an event

func CreateEventGroup(c *data.Connection, e *echo.Echo) *EventGroup {
	g := new(EventGroup)
	g.Conn = c
	g.Routes = map[string]Route{
		"EventList_UserId": {"/user/:id", "GET", g.EventList_UserId},
		//"PostUserEvent": {"/user/:id", "POST", g.PostUserEvent},
	}
	g.Group = e.Group("/events")
	(*Group)(g).SetRoutes()
	return g
}

func (g *EventGroup) EventList_UserId(c echo.Context) error {
	req := c.Param("user_id")
	id, _ := strconv.Atoi(req)
	data := g.Conn.EventsByUserId(id)
	if data == nil {
		return c.JSON(http.StatusBadRequest, ResponseBody{
			"message": "user not found",
		})
	}
	return c.JSON(http.StatusOK, ResponseBody{"Events": data})
}

func (g *EventGroup) PostUserEvent(c echo.Context) error {
	return c.NoContent(200)
}

func (g *EventGroup) GetEvents(c echo.Context) error {
	return c.NoContent(200)
}
