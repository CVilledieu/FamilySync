package manager

import (
	"flag"

	"github.com/labstack/echo/v4"
)

type Manager struct {
	Echo          *echo.Echo
	Port          string
	HashSeed      int
	DataBase      *Connection
	PublicGroups  []interface{}
	PrivateGroups []interface{}
}

type ResponseBody map[string]interface{}

func New() *Manager {
	var manager Manager
	e := echo.New()

	manager.Echo = e
	var hashSeed int
	manager.Port, hashSeed = getFlagData()

	manager.DataBase = NewDatabaseConnection(hashSeed)
	manager.setPublicGroups()

	return &manager
}

func (m *Manager) setPublicGroups() {
	userGroup := CreateUserGroup(m.DataBase)
	userGroup.Group = m.Echo.Group(userGroup.Name)
	m.PublicGroups = append(m.PublicGroups, userGroup)

	eventGroup := CreateEventGroup(m.DataBase)
	eventGroup.Group = m.Echo.Group(eventGroup.Name)
	m.PublicGroups = append(m.PublicGroups, eventGroup)
}

func (m *Manager) Run() {
	m.Echo.Logger.Fatal(m.Echo.Start(m.Port))
}

func getFlagData() (string, int) {
	port := flag.String("port", ":8080", "Which port the server will be listening")
	seed := flag.Int("seed", 1, "")
	flag.Parse()
	return *port, *seed
}
