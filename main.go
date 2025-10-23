package main

import "github.com/labstack/echo/v4"

func main() {
	e := echo.New()
	e.Renderer = newTemplate()
	e.Static("/static", "public/static")
	e.GET("/")
	e.Logger.Fatal(e.Start(PORT))
}
