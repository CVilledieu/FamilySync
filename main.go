package main

import (
	database "FamilySync/server"
	"flag"
	"fmt"
	"html/template"
	"io"
	"net/http"

	"github.com/labstack/echo/v4"
)

const INDEX_PATH string = "public/views/*.html"

var db database.Database

func main() {
	e := echo.New()
	e.Renderer = newTemplate()

	// Initialize database
	db = database.InitConnection()

	// Serv static files
	e.Static("/style", "./public/style")
	e.Static("/app", "./public/app")

	// Routes
	e.GET("/", pageIndex)
	e.GET("/names", getNames)

	// Start server
	var PORT = getPort()

	e.Logger.Fatal(e.Start(PORT))
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
	names, _ := db.GetUserNames()
	return c.JSON(http.StatusOK, names)
}

func pageIndex(c echo.Context) error {
	return c.Render(http.StatusOK, "index", nil)
}

// getPort checks for a command line argument "-port" to set the server port.
// If not provided, it defaults to ":6969".
func getPort() string {
	portFlag := flag.String("port", "", "Port to run the server on")

	flag.Parse()

	if *portFlag != "" {
		fmt.Printf("Using port from command line argument: %s\n", *portFlag)
		return ":" + *portFlag
	} else {
		fmt.Println("PORT not provided, defaulting to :6969")
		return ":6969"
	}

}

type Template struct {
	templates *template.Template
}

func newTemplate() *Template {
	return &Template{
		templates: template.Must(template.ParseGlob(INDEX_PATH)),
	}
}

func (t *Template) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	return t.templates.ExecuteTemplate(w, name, data)
}
