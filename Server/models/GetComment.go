package models

import (
	"fmt"
	"github.com/MichelC345/blog_js-go/tree/main/Server/dbconfig"
	//"github.com/lib/pq"
)

func GetComment(id string) (coms []Comment, err error) {
	fmt.Println("puxando comentários...")
	db, err := dbconfig.ConectaDB()
	if (err != nil) {
		panic(err)
	}
	defer db.Close()

	rows, err := db.Query(`SELECT * FROM public.comentarios WHERE "postId" = $1`, id)
	if (err != nil) {
		return
	}
	for rows.Next(){
		var com Comment
		err = rows.Scan(&com.Id, &com.Author, &com.Content, &com.Date, &com.PostId)
		fmt.Println(com)
		if (err != nil) {
			continue
		}
		coms = append(coms, com)
	}
	return coms, err
} 