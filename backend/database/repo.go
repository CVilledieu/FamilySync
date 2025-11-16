package database

type UserRepo struct{}
type EventRepo struct{}

func new() *UserRepo {
	var repo UserRepo

	return &repo
}
