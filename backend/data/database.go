package data

import (
	"database/sql"
	"fmt"

	_ "github.com/tursodatabase/turso-go"
)

const DB_PATH string = "./internal/FamilySync.db"

const USERS_TABLE string = "users"

type Connection struct {
	Connection *sql.DB
	Salt       int
}

func InitConn(hashSalt int) *Connection {
	conn, err := sql.Open("turso", DB_PATH)
	if err != nil {
		panic(err)
	}
	//Add initializing tables functions later

	fmt.Println("Database connected and initialized.")
	return &Connection{
		Connection: conn,
		Salt:       hashSalt,
	}
}

type FamilyData struct {
	Family_ID int    `json:"family_id"`
	Name      string `json:"name"`
	Members   []UserData
}

type UserData struct {
	User_ID   int    `json:"user_id"`
	Name      string `json:"name"`
	Family_ID int    `json:"family_id"`
}

type EventsData struct {
	Event_ID  int    `json:"event_id"`
	Name      string `json:"name"`
	Start     string `json:"start"`
	Duration  string `json:"duration"`
	Family_ID int    `json:"family_id"`
	User_ID   int    `json:"user_id"`
}
