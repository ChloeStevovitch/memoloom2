package main

import (
	"net/http"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// page represents a single page with Delta content
type page struct {
	Delta string `json:"delta"`
}

// book represents a book containing multiple pages
type book struct {
	Title   string       `json:"title"`
	Content map[int]page `json:"content"`
}

// user represents a user with a shelf of books
type user struct {
	Name  string       `json:"name"`
	Shelf map[int]book `json:"shelf"`
}

var pages = map[int]page{
	0: {
		Delta: `{"ops":[{"retain":12},{"insert":"White","attributes":{"color":"#fff"}},{"delete":4}]}`,
	},
	1: {
		Delta: `{"ops":[{"insert":" "}]}`,
	},
	2: {
		Delta: `{"ops":[{"insert":"Gandalf","attributes":{"bold":true}},{"insert":" the "},{"insert":"Grey","attributes":{"color":"#ccc"}}]}`,
	},
	3: {
		Delta: `{"ops":[{"insert":"Control","attributes":{"bold":true}},{"insert":" Structures","attributes":{"color":"#ccc"}},{"insert":" page 3 sheet 1"}]}`,
	},
	4: {
		Delta: `{"ops":[{"insert":"Functions","attributes":{"bold":true}},{"insert":" page 4 sheet 2"}]}`,
	},
	5: {
		Delta: `{"ops":[{"insert":"Structs and Interfaces","attributes":{"bold":true}},{"insert":" page 5 sheet 2"}]}`,
	},
	6: {
		Delta: `{"ops":[{"insert":"Concurrency in Go","attributes":{"bold":true}},{"insert":" page 6 sheet 3"}]}`,
	},
	7: {
		Delta: `{"ops":[{"insert":"Error Handling","attributes":{"bold":true}},{"insert":" page 7 sheet 3"}]}`,
	},
	8: {
		Delta: `{"ops":[{"insert":"Standard Library","attributes":{"bold":true}},{"insert":" page 8 sheet 4"}]}`,
	},
	9: {
		Delta: `{"ops":[{"insert":"Testing in Go","attributes":{"bold":true}},{"insert":" page 9 sheet 4"}]}`,
	},
	10: {
		Delta: `{"ops":[{"insert":"Testing in Go","attributes":{"bold":true}},{"insert":" page 10 sheet 5"}]}`,
	},
	11: {
		Delta: `{"ops":[{"insert":"Building Web Applications","attributes":{"bold":true}},{"insert":" page 11 sheet 5"}]}`,
	},
	12: {
		Delta: `{"ops":[]}`,
	},
	13: {
		Delta: `{"ops":[]}`,
	},
}

var (
	book1 = book{
		Title:   "The Go Programming Language",
		Content: pages,
	}

	book2 = book{
		Title:   "Learning Go",
		Content: pages,
	}

	users = []user{
		{
			Name: "Alice",
			Shelf: map[int]book{
				0: book1,
				1: book2,
			},
		},
	}
)

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

	// API Routes
	router.GET("/api/getPage/:id", getPageById)
	router.PUT("/api/updatePage/:id", updatePageById)
	router.GET("/api/getBookLength", getBookLength)

	// Commented routes for future use
	// router.GET("/api/getBook", getBook)
	// router.GET("/api/getBooks", getBooks)
	// router.PUT("/api/updateBook", updateBook)

	router.Run("localhost:8080")
}

// getBookLength returns the number of pages in the first book
func getBookLength(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, len(users[0].Shelf[0].Content))
}

// getPageById retrieves a specific page by its ID
func getPageById(c *gin.Context) {
	id := c.Param("id")
	pageID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page ID"})
		return
	}

	page, exists := users[0].Shelf[0].Content[pageID]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Page not found"})
		return
	}

	c.IndentedJSON(http.StatusOK, page)
}

// updatePageById updates a specific page by its ID
func updatePageById(c *gin.Context) {
	id := c.Param("id")
	pageID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page ID"})
		return
	}

	var newPage page
	if err := c.BindJSON(&newPage); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}

	users[0].Shelf[0].Content[pageID] = newPage
	c.IndentedJSON(http.StatusOK, newPage)
}

// Commented out functions for future use:
//
// func getBooks(c *gin.Context) {
// 	c.IndentedJSON(http.StatusOK, users[0].Shelf)
// }
//
// func getBook(c *gin.Context) {
// 	c.IndentedJSON(http.StatusOK, users[0].Shelf[0])
// }
