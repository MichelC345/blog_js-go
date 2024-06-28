package handlers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	models "github.com/MichelC345/blog_js-go/tree/main/Server/models"
	"net/http"
	"github.com/MichelC345/blog_js-go/tree/main/Server/dbconfig"
	"github.com/lib/pq"
)

type (
	EditPostBody = models.EditPostBody
)

func UpdatePost(c *gin.Context) {
	fmt.Println("executando função de editar post...")
	var (
		rqBody EditPostBody
	)
	if err := c.BindJSON(&rqBody); err != nil {
		panic(err)
	}
	if (len(rqBody.Title) == 0 || len(rqBody.Content) == 0 || len(rqBody.Tags) == 0) {
		c.String(http.StatusInternalServerError, "Todos os campos devem estar preenchidos.")
	}else if (len(rqBody.Title) < 4) {
		c.String(http.StatusInternalServerError, "O título deve ter ao menos 4 caracteres.")
	}else if (len(rqBody.Content) < 10) {
		c.String(http.StatusInternalServerError, "O conteúdo do post deve ter ao menos 10 caracteres.")
	}else if (len(rqBody.Tags) < 1 || len(rqBody.Tags) != rqBody.TagsOrigSize) {
		c.String(http.StatusInternalServerError, 
			"Deve haver ao menos uma tag. Obs: cada tag deve ter ao menos 4 caracteres e não pode conter espaços.")
	}else {
		db, err := dbconfig.ConectaDB()
		if (err != nil) {
			panic(err)
		}
		defer db.Close()

		_, err = db.Query(`UPDATE public.dadosblogjs SET title = $1, content = $2, tags = $3 WHERE id = $4`,
		rqBody.Title, rqBody.Content, pq.Array(rqBody.Tags), c.Param("id"))
		if (err != nil) {
			panic(err)
		}
		fmt.Println("post editado com sucesso", rqBody, c.Param("id"))
		c.Status(http.StatusOK)
	}
}