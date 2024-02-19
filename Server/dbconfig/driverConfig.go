package dbconfig

import (
	"fmt"
	//"log"
	"os"
	"database/sql"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq" //o "_" indica que isto ainda deve ser importado mesmo que não esteja diretamente referenciado
)


func ConectaDB() (*sql.DB, error) {
	err := godotenv.Load()
	if (err != nil) {
		return nil, err
	}
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_DATABASE")

	connectStr := fmt.Sprintf("host=%s port=%s user=%s "+
    "password=%s dbname=%s sslmode=disable",
    host, port, user, password, dbname)

	db, err := sql.Open("postgres", connectStr)

	if err != nil {
		return nil, err
	}

	err = db.Ping() //testa se há conexão
	if (err != nil) {
		return nil, err
	}
	
	fmt.Println("Conexão ao banco de dados feita com sucesso.")
	if (err != nil) {
		return nil, err
	}
	return db, err
}