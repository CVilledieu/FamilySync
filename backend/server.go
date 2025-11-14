package server

import (
	"FamilySync/backend/data"
	"FamilySync/backend/handlers"
	"flag"
	"fmt"
	"io"
	"text/template"

	"github.com/labstack/echo/v4"
)

// File Paths
const FP_INDEX string = "app/dist/index.html"
const FP_STATIC string = "/app/dist"

var WIDGETS_NAMES = []map[string]string{
	{"name": "Home"},
	{"name": "Calendar"},
}

func Run() {
	e := echo.New()

	e.Renderer = newTemplate(FP_INDEX)
	e.Static("", FP_STATIC)

	port, salt := getFlagData()
	h := new(handlers.Handlers)
	db := data.InitConn(salt)
	h.Event_Group = handlers.CreateEventGroup(db, e)
	h.User_Group = handlers.CreateUserGroup(db, e)

	e.Logger.Fatal(e.Start(port))
}

func getFlagData() (string, int) {
	port := flag.String("port", ":6969", "Port the server is listening to")
	salt := flag.Int("salt", 1, "")
	flag.Parse()
	fmt.Printf("Port used %s\n", *port)
	return *port, *salt
}

func newTemplate(path string) *Template {
	return &Template{
		templates: template.Must(template.ParseGlob(path)),
	}
}

func (t *Template) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	return t.templates.ExecuteTemplate(w, name, data)
}

type Template struct {
	templates *template.Template
}
