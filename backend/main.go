package main

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type page struct {
	ID   string `json:"id"`
	Text string `json:"text"`
}

type book struct {
	ID      string `json:"id"`
	Title   string `json:"title"`
	Content []page `json:"content"`
}

type user struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Shelf []book `json:"shelf"`
}

var page1 = page{ID: "1", Text: "Introduction to Go"}
var page2 = page{ID: "2", Text: "Variables and Types"}
var page3 = page{ID: "3", Text: "Control Structures"}
var page4 = page{ID: "4", Text: "Functions"}
var page5 = page{ID: "5", Text: "Structs and Interfaces"}
var page6 = page{ID: "6", Text: "Concurrency in Go"}
var page7 = page{ID: "7", Text: "Error Handling"}
var page8 = page{ID: "8", Text: "Standard Library"}
var page9 = page{ID: "9", Text: "Testing in Go"}
var page10 = page{ID: "10", Text: "Building Web Applications"}

var pages = []page{page1, page2, page3, page4, page5, page6, page7, page8, page9, page10}
var book1 = book{
	ID:      "1",
	Title:   "The Go Programming Language",
	Content: pages,
}
var book2 = book{
	ID:      "2",
	Title:   "Learning Go",
	Content: pages,
}
var users = []user{
	{ID: "1", Name: "Alice", Shelf: []book{book1, book2}},
}

func main() {
	router := gin.Default()

	// Configuration CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	router.GET("/api/getBook", getBook)
	router.GET("/api/getBooks", getBooks)
	router.POST("/api/writeNewPage", postPage)
	router.Run("localhost:8080")
}

// postAlbums adds an album from JSON received in the request body.
func postPage(c *gin.Context) {
	var newPage page
	if err := c.BindJSON(&newPage); err != nil {
		return
	}
	pages = append(pages, newPage)
	c.IndentedJSON(http.StatusCreated, newPage)
}
func getBooks(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, users[0].Shelf)
}
func getBook(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, users[0].Shelf[0])
}
