package server

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

const DB_PATH string = "./database/FamilySync.db"

// List of table names
// --------------------
//
//	Database Schema
const USERS_TABLE string = "users"

type Database struct {
	Connection *sql.DB
	tableNames []string
}

func InitConnection() Database {
	conn, _ := sql.Open("turso", DB_PATH)
	var tableName = "users"
	// Create Users table if it doesn't exist
	s, _ := conn.Prepare(`CREATE TABLE IF NOT EXISTS ` + tableName + ` (id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(50), username varchar(100), password varchar(100));`)
	defer s.Close()
	s.Exec()

	fmt.Println("Database connected and initialized.")
	return Database{
		Connection: conn,
		tableNames: []string{"users"},
	}
}

//func (db Database) createTable(tableName, tableSchema string) error {

//}

func (db Database) GetValidateUser(username, password string) (bool, error) {
	var exists bool
	stmt, _ := db.Connection.Prepare("SELECT EXISTS(SELECT 1 FROM users WHERE name=? AND password=?)")
	defer stmt.Close()
	err := stmt.QueryRow(username, password).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

func (db Database) GetUserNames() ([]string, error) {
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

func (db Database) AddNewUser(name string) error {
	_, err := db.Connection.Exec("INSERT INTO users (name) VALUES (?)", name)

	if err != nil {
		return err
	}
	return nil
}
