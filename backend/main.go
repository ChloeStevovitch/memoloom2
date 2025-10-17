package main

import (
	"net/http"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// page represents a single page with Canva content
type page struct {
	Canva string `json:"canva"`
}

const canvaExample = `{"version":"6.7.1","objects":[{"fontSize":40,"fontWeight":"normal","fontFamily":"Times New Roman","fontStyle":"normal","lineHeight":1.16,"text":"test","charSpacing":0,"textAlign":"left","styles":[],"pathStartOffset":0,"pathSide":"left","pathAlign":"baseline","underline":false,"overline":false,"linethrough":false,"textBackgroundColor":"","direction":"ltr","textDecorationThickness":66.667,"minWidth":20,"splitByGrapheme":false,"type":"Textbox","version":"6.7.1","originX":"left","originY":"top","left":199.7266,"top":285.9,"width":55.5469,"height":45.2,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0}]}`

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
		Canva: canvaExample,
	},
	1: {
		Canva: canvaExample,
	},
	2: {
		Canva: canvaExample,
	},
	3: {
		Canva: canvaExample,
	},
	4: {
		Canva: canvaExample,
	},
	5: {
		Canva: canvaExample,
	},
	6: {
		Canva: canvaExample,
	},
	7: {
		Canva: canvaExample,
	},
	8: {
		Canva: canvaExample,
	},
	9: {
		Canva: canvaExample,
	},
	10: {
		Canva: canvaExample,
	},
	11: {
		Canva: canvaExample,
	},
	12: {
		Canva: canvaExample,
	},
	13: {
		Canva: canvaExample,
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
