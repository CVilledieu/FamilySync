package ApiServer

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func indexHandler(c echo.Context) error {
	return c.Render(http.StatusOK, "index", nil)
}

func scheduleHandler(c echo.Context) error {
	schedule := map[string]interface{}{
		"Mom": []map[string]string{
			{"Monday": "09:00 AM", "event": "Opening Ceremony"},
			{"Tuesday": "10:00 AM", "event": "Keynote Speech"},
		},
		"Summary": map[string]int{
			"total_events": 2,
			"total_days":   2,
		},
	}
	return c.JSON(http.StatusOK, schedule)
}

type Schedule struct {
	Id       string
	Calendar []Week
}

type Week [7]Day

type Day struct {
	Name   string
	Events []Event
}

type Event struct {
	Title string
	Time  string
}
