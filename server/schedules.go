package api

type Event struct {
	Time  string
	Title string
	Desc  string
}

type Epoch struct {
	Date   string
	Events []Event
}

type Calendar struct {
	Name   string
	Epochs []Epoch
}
