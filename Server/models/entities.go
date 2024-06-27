package models

import "time"

//aqui estão definidas como serão os tipos de variáveis a serem inseridas ou recebidas do banco de dados
//os nomes das variáveis devem ser em maiúsculo para que possam ser exportadas!
type Post struct {
	Id int `json:"id"`
	Title string `json:"title"`
	Content string `json:"content"`
	Tags []string `json:"tags"`
	Date time.Time `json:"date"`
	Author string `json:"author"`
}

type Comment struct {
	Id int `json:"id"`
	Author string `json:"author"`
	Content string `json:"content"`
	Date time.Time `json:"date"`
	PostId int `json:"postId"`
}

type CreatePostBody struct {
	Title string `json:"title"`
	Content string `json:"content"`
	Tags []string `json:"tags"`
	TagsOrigSize int `json:"tagsOriginalSize"`
	Author string `json:"author"`
}