package main

import (
	Api "FamilySync/server"
	"html/template"
	"io"

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

func main() {
	e := echo.New()
	e.Renderer = newTemplate()
	e.Static("/static", "public/static")

	e.GET("/", Api.IndexHandler)
	e.GET("/members", Api.MembersHandler)
	e.GET("/schedule", Api.ScheduleHandler)
	e.Logger.Fatal(e.Start(PORT))
}
