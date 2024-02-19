package models

import (
	//"fmt"
	"github.com/MichelC345/blog_js-go/tree/main/Server/dbconfig"
	"github.com/lib/pq"
)

func GetAllPosts() (posts []Post, err error) {
	db, err := dbconfig.ConectaDB()
	if (err != nil) {
		panic(err)
	}
	defer db.Close()

	rows, err := db.Query(`SELECT * FROM public.dadosblogjs ORDER BY date DESC`)
	if (err != nil) {
		return
	}
	//fmt.Println(rows)
	for rows.Next() {
		var p Post
		//err = rows.Scan(&p.id, &p.title, &p.content, &p.tags, &p.date, &p.author)
		err = rows.Scan(&p.Title, &p.Content, &p.Date, pq.Array(&p.Tags), &p.Id, &p.Author) //o scan deve respeitar a ordem das colunas da tabela
		/*fmt.Println("autor", p.author)
		teste := []string(p.tags)
		fmt.Printf("tags (tam %d): ", teste, len(teste))
		for i := 0;i < len(p.tags);i++ {
			fmt.Printf("%s ", teste[i])
		}
		fmt.Println() */
		if (err != nil) {
			continue
		}
		posts = append(posts, p)
	}
	//fmt.Println(posts)
	return posts, err
}