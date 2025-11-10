package data

import (
	"database/sql"
	"fmt"

	_ "github.com/tursodatabase/turso-go"
)

/*
conn, err := sql.Open("turso","sqlite.db")
defer conn.Close()

stmt, _ := conn.Prepare("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)")
defer stmt.Close()
*/

const DB_PATH string = "./internal/FamilySync.db"

const USERS_TABLE string = "users"

type Connection struct {
	Connection *sql.DB
}

func Init() Connection {
	conn, err := sql.Open("turso", DB_PATH)
	if err != nil {
		panic(err)
	}
	//Add initializing tables functions later

	fmt.Println("Database connected and initialized.")
	return Connection{
		Connection: conn,
	}
}

//func (db Database) createTable(tableName, tableSchema string) error {
// s, _ := conn.Prepare(`CREATE TABLE IF NOT EXISTS ` + tableName + ` (id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(50), username varchar(100), password varchar(100));`)
//}

func (db Connection) ValidateUser(username, password string) (bool, error) {
	var exists bool
	stmt, _ := db.Connection.Prepare("SELECT EXISTS(SELECT 1 FROM users WHERE name=? AND password=?)")
	defer stmt.Close()
	err := stmt.QueryRow(username, password).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

func (db Connection) getNameList() ([]string, error) {
	var namesArray []string
	stmt, _ := db.Connection.Prepare("SELECT name FROM users")
	defer stmt.Close()
	rows, _ := stmt.Query()
	for rows.Next() {
		var name string
		rows.Scan(&name)
		namesArray = append(namesArray, name)
	}

	return namesArray, nil
}

func (db Connection) AddNewUser(name string) error {
	_, err := db.Connection.Exec("INSERT INTO users (name) VALUES (?)", name)

	if err != nil {
		return err
	}
	return nil
}

type UserData struct {
	ID         int    `json: "id"`
	Name       string `json: "name"`
	OtherUsers string `json:"otherusers"`
}

type EventsData struct {
	ID       int    `json: event_id`
	Name     string `json: name`
	start    string `json: timestamp`
	duration string `json: duration`
}

func (db Connection) getUserData(user, password string) interface{} {
	var name string
	fmt.Printf("%s\n%s\n", user, password)
	stmt, _ := db.Connection.Prepare("SELECT name FROM users WHERE username=? AND password=?")
	defer stmt.Close()
	err := stmt.QueryRow(user, password).Scan(&name)
	if err != nil || name == "" {
		return nil
	}
	fmt.Println(name)
	return name
}
