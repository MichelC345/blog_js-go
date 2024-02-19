package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"github.com/MichelC345/blog_js-go/tree/main/Server/models"
	"log"
	//"fmt"
)

func FindAllPosts(c *gin.Context) {
	posts, err := models.GetAllPosts()
	if (err != nil) {
		c.String(http.StatusNotFound, "Falha encontrada no armazenamento de dados.")
		log.Printf("Falha encontrada no armazenamento de dados: %v\n", err)
	}else {
		//c.String(http.StatusOK, "Esta é a função de retornar todos os posts...")
		//fmt.Println(posts[0])
		c.JSON(http.StatusOK, posts)
	}
}

func FindPostById(c *gin.Context) {}

func FindComments(c *gin.Context) {}