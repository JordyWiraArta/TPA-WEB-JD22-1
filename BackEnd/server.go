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
	"github.com/gorilla/mux"
	"github.com/jordywiraarta/golang-graphql/graph"
	"github.com/jordywiraarta/golang-graphql/graph/model"
	"github.com/jordywiraarta/golang-graphql/graph/generated"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/jordywiraarta/golang-graphql/database"
)

const defaultPort = "8080"

func MyCors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	 w.Header().Set("Access-Control-Allow-Origin", "*")
	 w.Header().Add("Access-Control-Allow-Headers", "Content-Type,AccessToken,X-CSRF-Token, Authorization, Token")
	 w.Header().Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	 w.Header().Set("content-type", "application/json;charset=UTF-8")
	 if r.Method == "OPTIONS" {
	  w.WriteHeader(http.StatusNoContent)
	  return
	 }
	 next.ServeHTTP(w, r)
	})
   }

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	db := database.GetDB()
	database.MigrateTable()
	db.AutoMigrate(&model.User{})
	router := mux.NewRouter();
	router.Use(MyCors);
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{
		DB: db,
	}}))

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
