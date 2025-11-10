package server

import (
	"flag"
	"fmt"
	"io"
	"text/template"

	handler "FamilySync/backend/handlers"

	"github.com/labstack/echo/v4"
)

const PUBLIC_INDEX string = "./frontend/views/*.html"

var WIDGETS_NAMES = []map[string]string{
	{"name": "Home"},
	{"name": "Calendar"},
}

func Run() {
	e := echo.New()

	e.Renderer = newTemplate(PUBLIC_INDEX)
	e.Static("", "/frontend")

	port, salt := getFlagData()
	hctx := handler.InitCtx(salt)

	e.GET("/", hctx.Home)
	e.GET("/login", hctx.Login)

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
