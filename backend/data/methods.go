package data

import (
	"fmt"
	"strconv"
)

func (c *Connection) ValidateUser(username, password string) bool {
	var exists bool
	hashUser := c.hashingFunction(username)
	hashPass := c.hashingFunction(password)
	stmt, _ := c.Connection.Prepare("SELECT EXISTS(SELECT 1 FROM users WHERE username=? AND password=?)")
	defer stmt.Close()
	err := stmt.QueryRow(hashUser, hashPass).Scan(&exists)
	return err != nil
}
func (c *Connection) hashingFunction(s string) int {
	convStr, _ := strconv.Atoi(s)
	hashed := convStr + c.Salt
	return hashed
}

func (c *Connection) GetUser(user, password string) interface{} {
	var name string
	fmt.Printf("%s\n%s\n", user, password)
	stmt, _ := c.Connection.Prepare("SELECT name FROM users WHERE username=? AND password=?")
	defer stmt.Close()
	err := stmt.QueryRow(user, password).Scan(&name)
	if err != nil || name == "" {
		return nil
	}
	fmt.Println(name)
	return name
}

func (c *Connection) GetUserFamily(fam_id int) []UserData {
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
	return rtnData
}

func (c *Connection) GetEvents(user_id int) []EventsData {
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
	return rtnData
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
