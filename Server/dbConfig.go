package main

import (
	"fmt"
	//"log"
	"os"
	"database/sql"

	//"github.com/Valgard/godotenv"
	"github.com/joho/godotenv"
)

/*const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "sEnhAlegAL1.23"
	dbname   = "blogjs-db"
) */

func main() {
	err = godotenv.Load()
	if (err != nil) {
		panic(err)
	}
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_DATABASE")

	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
    "password=%s dbname=%s sslmode=disable",
    host, port, user, password, dbname)

	db, err = sql.Open("postgres", psqlInfo)

	if err != nil {
		panic(err)
	}
	defer db.Close()

	err = db.Ping()
	if (err != nil) {
		panic(err)
	}
	
	fmt.Println("Conexão ao banco de dados feita com sucesso.")
}