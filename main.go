package main

import (
	"html/template"
	"io"
	"net/http"

	"github.com/labstack/echo/v4"
)

const PORT string = ":8080"

const VIEW_PATH string = "public/views/"

type Template struct {
	templates *template.Template
}

func newTemplate() *Template {
	return &Template{
		templates: template.Must(template.ParseGlob(VIEW_PATH + "*.html")),
	}
}

func (t *Template) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	return t.templates.ExecuteTemplate(w, name, data)
}

// --------------------
//
//	Handlers
//
// --------------------

func getSchedule(c echo.Context) error {
	sample := []map[string][]string{
		{"Monday": {"09:00 AM - Opening Ceremony", "01:00 PM - Workshop"}},
		{"Tuesday": {"10:00 AM - Keynote Speech", "02:00 PM - Panel Discussion"}},
	}
	return c.JSON(http.StatusOK, sample)
}

func getNames(c echo.Context) error {
	members := []string{
		"Dad",
		"Mom",
	}
	return c.JSON(http.StatusOK, members)
}

func pageIndex(c echo.Context) error {
	return c.Render(http.StatusOK, "index", nil)
}

func main() {
	e := echo.New()
	e.Renderer = newTemplate()
	e.Static("/static", "./public")

	e.GET("/", pageIndex)
	e.GET("/names", getNames)
	e.GET("/schedule", getSchedule)
	e.Logger.Fatal(e.Start(PORT))
}
