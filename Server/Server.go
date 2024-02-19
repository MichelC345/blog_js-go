package main

import (
	"fmt"
	//"github.com/MichelC345/blog_js-go/tree/main/Server/dbconfig"
	"github.com/gin-gonic/gin"
	"github.com/MichelC345/blog_js-go/tree/main/Server/handlers"
)

//Referência: https://stackoverflow.com/questions/29418478/go-gin-framework-cors
func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {

        c.Header("Access-Control-Allow-Origin", "*")
        c.Header("Access-Control-Allow-Credentials", "true")
        c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
        c.Header("Access-Control-Allow-Methods", "POST,HEAD,PATCH, OPTIONS, GET, PUT")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}

func main() {
	router := gin.Default() //cria uma variável para armazenar grupos de rotas

	//utiliza o CORS
	router.Use(CORSMiddleware())

	//define as rotas e as funções que cada uma irá utilizar
	router.GET("/posts", handlers.FindAllPosts)
	router.GET("/posts/:id", handlers.FindPostById)
	router.GET("/comments/:id", handlers.FindComments)
	router.POST("/create", handlers.CreatePost)
	router.POST("/posts/:id/createComment", handlers.CreateComment)
	router.DELETE("/posts/:id/remove", handlers.DeletePost)
	router.PUT("/posts/:id/edit", handlers.UpdatePost)

	if err := router.Run(":8080"); err != nil { //busca iniciar na porta 8080, verificando se já há alguma execução
		panic(err)
	}else {
		fmt.Println("Servidor iniciado na porta 8080.")
	}
}