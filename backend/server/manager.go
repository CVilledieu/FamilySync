package server

import (
	"flag"

	database "FamilySync/backend/database"

	"github.com/labstack/echo/v4"
)

type server struct {
	Echo          *echo.Echo
	Database      *database.Database
	PublicGroups  []interface{}
	PrivateGroups []interface{}
}

type ResponseBody map[string]interface{}

func New() *server {
	var manager server
	e := echo.New()

	manager.Echo = e

	port, hashSeed := getFlagData()

	manager.Database = database.New(hashSeed)

	manager.setPublicGroups()

	e.Logger.Fatal(e.Start(port))
	return &manager
}

func (m *server) setPublicGroups() {
	userGroup := CreateUserGroup(m.Database)
	userGroup.Group = m.Echo.Group(userGroup.Name)
	m.PublicGroups = append(m.PublicGroups, userGroup)

	eventGroup := CreateEventGroup(m.Database)
	eventGroup.Group = m.Echo.Group(eventGroup.Name)
	m.PublicGroups = append(m.PublicGroups, eventGroup)
}

func getFlagData() (string, int) {
	port := flag.String("port", ":8080", "Which port the server will be listening")
	seed := flag.Int("seed", 1, "")
	flag.Parse()
	return *port, *seed
}
