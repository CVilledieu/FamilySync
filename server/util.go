package server

import (
	"flag"
	"fmt"
	"html/template"
	"io"

	"github.com/labstack/echo/v4"
)

func isAuthenticated(c echo.Context) bool {
	params := c.QueryParams()

	// Checking for token
	token := params.Get("token")
	if token == "authenticated_user_token" {
		fmt.Println("User authenticated via token")
		return true
	}

	// Temp login info during dev
	u := params.Get("username")
	p := params.Get("password")
	if u == "admin" && p == "password" {
		fmt.Println("User authenticated via credentials")
		return true
	}

	fmt.Println("User not authenticated")
	return false
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
