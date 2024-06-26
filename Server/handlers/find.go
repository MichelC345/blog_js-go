package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"github.com/MichelC345/blog_js-go/tree/main/Server/models"
	"log"
	"fmt"
)

func FindAllPosts(c *gin.Context) {
	fmt.Println("encontrando todos os posts...")
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

func FindPostById(c *gin.Context) {
	fmt.Println("find post by id...")
	//log.Println("teste")
	//c.String(http.StatusNotFound, "falha teste")
	id := c.Param("id")
	post, err := models.GetPostById(id)
	if (err != nil) {
		c.String(http.StatusNotFound, "Falha encontrada no armazenamento de dados.")
		log.Printf("Falha encontrada no armazenamento de dados: %v\n", err)
	}else {
		c.JSON(http.StatusOK, post)
	}
}

func FindComments(c *gin.Context) {
	log.Println("encontrando comentários...")
	id := c.Param("id")
	com, err := models.GetComment(id)
	if (err != nil) {
		c.String(http.StatusNotFound, "Falha encontrada no armazenamento de dados.")
		log.Printf("Falha encontrada no armazenamento de dados: %v\n", err)
	}else {
		c.JSON(http.StatusOK, com)
	}
}