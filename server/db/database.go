package database

import "database/sql"

type Database struct {
	connection *sql.DB
	salt       string
}
