package server

import (
	"flag"
	"fmt"
	"html/template"
	"io"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

const INDEX_PATH string = "./app/public/views/*.html"

var db Database

type Template struct {
	templates *template.Template
}

func StartServer() {
	e := echo.New()
	e.Renderer = newTemplate(INDEX_PATH)

	// Initialize database
	db = InitConnection()

	// Serve static files for authenticated users (from ./app/private)
	e.Use(serve_Public_Static())

	e.GET("/", newRequest)

	eg := e.Group("/api")
	postAuthGroup(eg)

	var PORT = getPort()
	e.Logger.Fatal(e.Start(PORT))
}

// File serving based on authentication
func serve_Public_Static() echo.MiddlewareFunc {
	return middleware.StaticWithConfig(middleware.StaticConfig{
		Root: "./app/public",
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
