// package main

// import (
// 	"log"
// 	"net/http"
// 	"os"
// 	"github.com/joho/godotenv"
// 	"github.com/99designs/gqlgen/graphql/handler"
// 	"github.com/99designs/gqlgen/graphql/playground"
// 	"github.com/jordywiraarta/golang-graphql/graph"
// 	"github.com/jordywiraarta/golang-graphql/graph/generated"
// )

// const defaultPort = "8000"

// func main() {
// 	port := os.Getenv("PORT")
// 	if port == "" {
// 		port = defaultPort
// 	}

// 	err := godotenv.Load(); if err != nil {
// 		log.Fatal("Error loading .env file")
// 	}

// 	Database := graph.Connect()
//    	srv := handler.NewDefaultServer(
//        generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{DB: Database}}))

// 	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
// 	http.Handle("/query", srv)

// 	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
// 	log.Fatal(http.ListenAndServe(":"+port, nil))
// }

package main

import (
	"log"
	"net/http"
	"os"
	"github.com/jordywiraarta/golang-graphql/graph"
	"github.com/jordywiraarta/golang-graphql/graph/model"
	"github.com/jordywiraarta/golang-graphql/graph/generated"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const defaultPort = "8080"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	dsn := "host=localhost user=postgres password=postgres dbname=linkhedin_db port=5000 sslmode=disable TimeZone=Asia/Shanghai"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil{
		panic(err)
	}

	db.AutoMigrate(&model.User{})

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{
		DB: db,
	}}))

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
