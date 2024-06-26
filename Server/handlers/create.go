package handlers

import (
	"github.com/gin-gonic/gin"
	"log"
	//"io"
	models "github.com/MichelC345/blog_js-go/tree/main/Server/models"
	"github.com/MichelC345/blog_js-go/tree/main/Server/dbconfig"
)

type Post = models.Post

func CreatePost(c *gin.Context) {
	log.Println("executando função de criar post...")
	//novo, err := io.ReadAll(c.Request.Body)
	var novo Post
	if err := c.BindJSON(&novo); err != nil {
		panic(err)
	}
	db, err := dbconfig.ConectaDB()
	if (err != nil) {
		panic(err)
	}
	defer db.Close()

	_, err = db.Query(`INSERT INTO public.dadosblogjs 
	VALUES ($1, $2, $3, $4, $5) RETURNING id`, novo.Title, novo.Content, novo.Date, novo.Tags, novo.Author)
	if (err != nil) {
		panic(err)
	}
}

func CreateComment(c *gin.Context) {}