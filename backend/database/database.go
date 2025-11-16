package database

import (
	"crypto/sha256"
	"database/sql"
	"fmt"
	"hash"
	"strconv"

	_ "github.com/tursodatabase/turso-go"
)

// Struct to handle calls to the database
type Database struct {
	connection *sql.DB
	salt       string
	hasher     hash.Hash
	user       UserRepo
	event      EventRepo
}

type Connection struct {
	Connection  *sql.DB
	HashingSalt string
	Hasher      hash.Hash
}

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type User struct {
	User_ID   int    `json:"user_id"`
	Name      string `json:"name"`
	Family_ID int    `json:"family_id"`
}

type Event struct {
	Event_ID int    `json:"event_id"`
	Name     string `json:"name"`
	Start    string `json:"start_time"`
	Duration string `json:"duration"`
	User_ID  int    `json:"user_id"`
}

func New(hashingSalt int) *Database{
	var Database 
}

func NewDatabaseConnection(saltingSeed int) *Connection {
	conn, err := sql.Open("turso", "./internal/FamilySync.db")
	if err != nil {
		panic(err)
	}
	fmt.Println("Database connected.")

	return &Connection{
		Connection:  conn,
		HashingSalt: strconv.Itoa(saltingSeed),
		Hasher:      sha256.New(),
	}

}

func (c *Connection) HashCredential(notSecure Credentials) (Secure_Username, Secure_Password string) {
	saltedUser := c.HashingSalt + notSecure.Username
	saltedPass := c.HashingSalt + notSecure.Password

	c.Hasher.Write([]byte(saltedUser))
	Secure_Username = fmt.Sprintf("%x", c.Hasher.Sum(nil))

	c.Hasher.Write([]byte(saltedPass))
	Secure_Password = fmt.Sprintf("%x", c.Hasher.Sum(nil))
	return
}

func (c *Connection) GetByCredentials(NotSecure Credentials) (*User, error) {
	var user User
	hashedU, hashedP := c.HashCredential(NotSecure)
	st, err := c.Connection.Prepare("Select * FROM users WHERE user_id=(SELECT user_id FROM credentials WHERE username = ? AND password = ? LIMIT 1)")
	if err != nil {
		return nil, err
	}
	defer st.Close()
	scanErr := st.QueryRow(hashedU, hashedP).Scan(&user)
	if scanErr != nil {
		return nil, scanErr
	}
	return &user, nil
}
