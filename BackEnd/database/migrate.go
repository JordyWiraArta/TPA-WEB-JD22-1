package database

import "github.com/jordywiraarta/golang-graphql/graph/model"

func MigrateTable() {
	db := GetDB()
	db.AutoMigrate(&model.User{})
	db.AutoMigrate(&model.Post{})
	db.AutoMigrate(&model.Education{})
	db.AutoMigrate(&model.Experience{})
	db.AutoMigrate(&model.Comment{})
	db.AutoMigrate(&model.JobPost{})
	db.AutoMigrate(&model.LikedPost{})
	db.AutoMigrate(&model.LikedComment{});
}