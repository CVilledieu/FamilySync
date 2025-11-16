package server

import (
	"FamilySync/server/database"
	"flag"
	"fmt"
	"strconv"

	"github.com/labstack/echo/v4"
)

type Server struct {
	echo     *echo.Echo
	port     string
	database *database.Database
}

func New() *Server {
	var server Server
	serverPort, hashSeed := getFlagData()
	server.port = serverPort
	server.echo = echo.New()
	server.database = database.New(hashSeed)

	return &server
}

func (s *Server) Run() {
	fmt.Printf("Listening on port: %s\n", s.port)
	s.echo.Logger.Fatal(s.echo.Start(s.port))
}

func getFlagData() (string, int) {
	portPtr := flag.Int("port", 8080, "Which port the server will be listening")
	seedPtr := flag.Int("seed", 1, "")
	flag.Parse()
	seed := *seedPtr
	port := ":" + strconv.Itoa(*portPtr)
	return port, seed
}
