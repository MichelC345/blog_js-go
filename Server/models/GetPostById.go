package models

import (
	"fmt"
	"github.com/MichelC345/blog_js-go/tree/main/Server/dbconfig"
	"github.com/lib/pq"
)

func GetPostById(id string) (post Post, err error) {
	fmt.Println("obtendo post pelo id...")
	db, err := dbconfig.ConectaDB()
	if (err != nil) {
		panic(err)
	}
	defer db.Close()

	rows, err := db.Query(`SELECT * FROM public.dadosblogjs WHERE id = $1`, id)
	if (err != nil) {
		return
	}
	var p Post
	rows.Next()
	err = rows.Scan(&p.Title, &p.Content, &p.Date, pq.Array(&p.Tags), &p.Id, &p.Author)
	return p, err
}