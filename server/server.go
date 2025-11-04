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

	// Serv static files
	e.Static("", "/app/public")

	// Serve files for UNauthenticated users (from ./public/login)
	e.Use(serve_Auth_Static())

	// Routes
	e.GET("/", renderIndex)
	e.GET("/auth", updatePage)
	e.GET("/names", getNames)

	// Start server
	var PORT = getPort()

	e.Logger.Fatal(e.Start(PORT))
}

// Static file serving middleware based on authentication status
func serve_Auth_Static() echo.MiddlewareFunc {
	return middleware.StaticWithConfig(middleware.StaticConfig{
		Root: "./app/private",
		Skipper: func(c echo.Context) bool {
			return !isAuthenticated(c) // Skip if NOT authenticated
		},
	})
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
