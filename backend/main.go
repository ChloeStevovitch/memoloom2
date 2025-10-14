package main

import (
	"net/http"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type page struct {
	HTML string `json:"html"`
}

type book struct {
	Title   string       `json:"title"`
	Content map[int]page `json:"content"`
}

type user struct {
	Name  string       `json:"name"`
	Shelf map[int]book `json:"shelf"`
}

var pages = map[int]page{
	0:  {HTML: "TITRE page 0 sheet 0 "},
	1:  {HTML: "Introduction to Go page 1 sheet 0 "},
	2:  {HTML: "Variables and Types page 2 sheet 1"},
	3:  {HTML: "Control Structures page 3 sheet 1"},
	4:  {HTML: "Functions page 4 sheet 2"},
	5:  {HTML: "Structs and Interfaces page 5 sheet 2"},
	6:  {HTML: "Concurrency in Go page 6 sheet 3"},
	7:  {HTML: "Error Handling page 7 sheet 3"},
	8:  {HTML: "Standard Library page 8 sheet 4"},
	9:  {HTML: "Testing in Go page 9 sheet 4"},
	10: {HTML: "Testing in Go page 10 sheet 5"},
	11: {HTML: "Building Web Applications page 11 sheet 5"},
}

var book1 = book{
	Title:   "The Go Programming Language",
	Content: pages,
}
var book2 = book{
	Title:   "Learning Go",
	Content: pages,
}
var users = []user{
	0: {Name: "Alice", Shelf: map[int]book{0: book1, 1: book2}},
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

	// router.GET("/api/getBook", getBook)
	// router.GET("/api/getBooks", getBooks)
	router.GET("/api/getPage/:id", getPageById)
	router.PUT("/api/updatePage/:id", updatePageById)
	router.GET("/api/getBookLength", getBookLength)
	// router.PUT("/api/updateBook", updateBook)
	router.Run("localhost:8080")
}
func getBookLength(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, len(users[0].Shelf[0].Content))
}

//	func getBooks(c *gin.Context) {
//		c.IndentedJSON(http.StatusOK, users[0].Shelf)
//	}
//
//	func getBook(c *gin.Context) {
//		c.IndentedJSON(http.StatusOK, users[0].Shelf[0])
//	}
func getPageById(c *gin.Context) {
	id := c.Param("id")
	pageId, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page ID"})
		return
	}
	c.IndentedJSON(http.StatusOK, users[0].Shelf[0].Content[pageId])
}
func updatePageById(c *gin.Context) {
	id := c.Param("id")
	pageId, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page ID"})
		return
	}
	var newPage page
	if err := c.BindJSON(&newPage); err != nil {
		return
	}
	users[0].Shelf[0].Content[pageId] = newPage
	c.IndentedJSON(http.StatusOK, newPage)
}
