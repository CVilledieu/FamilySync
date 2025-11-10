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
	Event_ID int    `json:"event_id"`
	Name     string `json:"name"`
	Start    string `json:"start"`
	Duration string `json:"duration"`
	User_ID  int    `json:"user_id"`
}

func (c *Connection) ValidateUser(username, password string) bool {
	var exists bool
	hashUser := c.hashingFunction(username)
	hashPass := c.hashingFunction(password)
	stmt, _ := c.Connection.Prepare("SELECT EXISTS(SELECT 1 FROM users WHERE username=? AND password=?)")
	defer stmt.Close()
	err := stmt.QueryRow(hashUser, hashPass).Scan(&exists)
	return err != nil
}
func (c *Connection) hashingFunction(s string) string {
	//convStr, _ := strconv.Atoi(s)
	//hashed := convStr + c.Salt
	return s
}

func (c *Connection) GetUser(username, password string) *UserData {
	user := UserData{}
	hashUser := c.hashingFunction(username)
	hashPass := c.hashingFunction(password)

	stmt, _ := c.Connection.Prepare("SELECT user_id, name, family_id FROM users WHERE username=? AND password=?")
	defer stmt.Close()

	err := stmt.QueryRow(hashUser, hashPass).Scan(&user.User_ID, &user.Name, &user.Family_ID)
	if err != nil {
		fmt.Printf("Error caught in Query: %s", err)
		return nil
	}
	fmt.Println(user)
	return &user
}

func (c *Connection) GetUserFamily(fam_id int) *[]UserData {
	rtnData := []UserData{}
	stmt, _ := c.Connection.Prepare("SELECT name, user_id FROM users WHERE family_id=?")
	defer stmt.Close()
	for {
		member := UserData{}
		err := stmt.QueryRow(fam_id).Scan(&member.Name, &member.User_ID)
		if err == nil {
			break
		}
		rtnData = append(rtnData, member)
	}
	return &rtnData
}

func (c *Connection) GetEvents(user_id int) *[]EventsData {
	rtnData := []EventsData{}
	st, _ := c.Connection.Prepare("SELECT * FROM events WHERE user_id=?")
	defer st.Close()
	for {
		event := EventsData{}
		err := st.QueryRow(user_id).Scan(&event)
		if err == nil {
			break
		}
		rtnData = append(rtnData, event)
	}
	return &rtnData
}

//Instead of righting multpile methods passing the key parts in to be
// func (c *Connection) GetData(columns, table, conditional string) interface{} {
// 	rtnData := []interface{}
// 	queryString := fmt.Sprintf("Select %s FROM %s WHERE %s", columns, table, conditional)
// 	stmt, _ := c.Connection.Prepare(queryString)
// 	defer stmt.Close()
// 	for {
// 		data := interface
// 		err := stmt.QueryRow(columns, table, conditional).Scan(&rtnData)
// 		if err == nil {
// 			break
// 		}
// 		rtnData = append(rtnData, data)
// 	}
// 	return rtnData
// }

// type Select_Request struct {
// 	Table string
// 	Columns []string
// 	Conditionals []string

// }
