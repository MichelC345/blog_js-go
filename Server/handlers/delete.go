package handlers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"github.com/MichelC345/blog_js-go/tree/main/Server/dbconfig"
)

func DeletePost(c *gin.Context) {
	fmt.Println("executando função de remover post...")
	db, err := dbconfig.ConectaDB()
	if (err != nil) {
		panic(err)
	}
	defer db.Close()

	//remove post
	_, err = db.Query(`DELETE FROM public.dadosblogjs WHERE id = $1`, c.Param("id"))
	if (err != nil) {
		panic(err)
	}

	//remove comentários do post
	_, err = db.Query(`DELETE FROM public.comentarios WHERE "postId" = $1`, c.Param("id"))
	if (err != nil) {
		panic(err)
	}

	fmt.Println("post", c.Param("id"), "removido com sucesso")
	c.Status(http.StatusOK)
}