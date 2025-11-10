package server

import (
	"flag"
	"fmt"
	"io"
	"net/http"
	"text/template"

	data "FamilySync/backend/data"
	handler "FamilySync/backend/handlers"

	"github.com/labstack/echo/v4"
)

const INDEX_PATH string = "./app/public/views/*.html"

var WIDGETS_NAMES = []map[string]string{
	{"name": "Home"},
	{"name": "Calendar"},
}

var Conn data.Connection

func Run() {
	e := echo.New()
	e.Renderer = newTemplate(INDEX_PATH)

	// Initialize database
	conn = Init()

	e.Static("", "/app/public")

	e.GET("/", handler.Home)

	e.GET("/login", authRequest)
	// e.GET("/api/userdata", getUserData)

	var PORT = getPort()
	e.Logger.Fatal(e.Start(PORT))
}

func authRequest(c echo.Context) error {
	params := c.QueryParams()
	u := params.Get("username")
	p := params.Get("password")
	userdata := Conn.getUserData(u, p)

	if userdata != nil {

		return c.JSON(http.StatusOK, map[string]interface{}{
			"status":   "success",
			"token":    "authenticated_user_token",
			"message":  "Login successful",
			"widgets":  WIDGETS_NAMES,
			"userdata": userdata,
		})
	}

	return c.JSON(http.StatusUnauthorized, map[string]string{
		"status":  "error",
		"message": "Invalid credentials",
	})
}

func getPort() string {
	portFlag := flag.String("port", "", "Port to run the server on")

	flag.Parse()

	if *portFlag != "" {
		fmt.Printf("Using port from command line argument: %s\n", *portFlag)
		return ":" + *portFlag
	} else {
		fmt.Println("PORT not provided, defaulting to :6969")
		return "0.0.0.0:6969"
	}

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
