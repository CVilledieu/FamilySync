package database

import (
	"database/sql"

	_ "github.com/tursodatabase/turso-go"
)

/*
conn, err := sql.Open("turso","sqlite.db")
defer conn.Close()

stmt, _ := conn.Prepare("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)")
defer stmt.Close()
*/

type Database struct {
	Connection *sql.DB
}

func InitDB() Database {
	conn, _ := sql.Open("turso", "./database/FamilySync.db")
	return Database{Connection: conn}
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
