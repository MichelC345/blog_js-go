package handlers

import (
	"github.com/gin-gonic/gin"
	"fmt"
	models "github.com/MichelC345/blog_js-go/tree/main/Server/models"
	"github.com/MichelC345/blog_js-go/tree/main/Server/dbconfig"
	"net/http"
	"time"
	"github.com/lib/pq"
)

//type Post = models.Post
type (
	CreatePostBody    = models.CreatePostBody
	CreateCommentBody = models.CreateCommentBody
)


func CreatePost(c *gin.Context) {
	fmt.Println("executando função de criar post...")

	//obtém-se os dados do post como JSON
	var (
		rqBody CreatePostBody
		id int
	)
	if err := c.BindJSON(&rqBody); err != nil {
		panic(err)
	}
	
	//verifica entrada
	fmt.Println("verificando erros...")
	if (len(rqBody.Title) == 0 || len(rqBody.Content) == 0 || len(rqBody.Tags) == 0 || len(rqBody.Author) == 0) {
		c.String(http.StatusInternalServerError, "Preencha todos os campos.")
	}else if (len(rqBody.Title) < 4) {
		c.String(http.StatusInternalServerError, "O título deve ter ao menos 4 caracteres.")
	}else if (len(rqBody.Content) < 10) {
		c.String(http.StatusInternalServerError, "O conteúdo do post deve ter ao menos 10 caracteres.")
	}else if (len(rqBody.Tags) < 1 || len(rqBody.Tags) != rqBody.TagsOrigSize) {
		c.String(http.StatusInternalServerError, 
			"Adicione ao menos uma tag. Obs: cada tag deve ter ao menos 4 caracteres e não pode conter espaços.")
	}else if (len(rqBody.Author) < 4) {
		c.String(http.StatusInternalServerError, 
			"O nome do usuário deve ter ao menos 4 caracteres e não pode conter espaços.")
	}else {
		//conecta com o banco de dados
		db, err := dbconfig.ConectaDB()
		if (err != nil) {
			panic(err)
		}
		defer db.Close()

		date := time.Now()

		//insere os dados
		rows, err := db.Query(`INSERT INTO public.dadosblogjs (title, content, date, tags, author)
		VALUES ($1, $2, $3, $4, $5) RETURNING id`, rqBody.Title, rqBody.Content, date, pq.Array(rqBody.Tags), rqBody.Author)
		if (err != nil) {
			panic(err)
		}
		//obtém o id gerado e retorna resposta informando o id
		rows.Next()
		if err = rows.Scan(&id);err != nil {
			panic(err)
		}
		fmt.Println("criação de post feita com sucesso", rqBody)
		c.JSON(http.StatusOK, map[string]interface{}{
			"id": id,
		})
	}
}

func CreateComment(c *gin.Context) {
	fmt.Println("executando função de criar comentário...")
	var (
		rqBody CreateCommentBody
	)
	if err := c.BindJSON(&rqBody);err != nil {
		panic(err)
	}
	if (len(rqBody.Author) == 0 || len(rqBody.Content) == 0) {
		c.String(http.StatusInternalServerError, "Preencha todos os campos.")
	}else if (len(rqBody.Author) < 4) {
		c.String(http.StatusInternalServerError, 
			"O nome do usuário deve ter ao menos 4 caracteres e não pode conter espaços.")
	}else if (len(rqBody.Content) < 4) {
		c.String(http.StatusInternalServerError, 
			"O comentário deve ter ao menos 10 caracteres.")
	}else {
		//conecta com o banco de dados
		db, err := dbconfig.ConectaDB()
		if (err != nil) {
			panic(err)
		}
		defer db.Close()

		
		//insere os dados e retorna status positivo
		date, postId := time.Now(), c.Param("id")
		if _, err := db.Query(`INSERT INTO public.comentarios (author, content, date, "postId")
		VALUES ($1, $2, $3, $4) RETURNING id`, rqBody.Author, rqBody.Content, date, postId);err != nil {
			panic(err)
		}
		fmt.Println("comentário inserido com sucesso", rqBody, "no post", postId)
		c.Status(http.StatusOK)
	}
}