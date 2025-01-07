package main

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/rs/cors"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// URL represents the URL model
type URL struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	LongURL  string `json:"long_url"`
	ShortURL string `json:"short_url"`
}

var db *gorm.DB

func main() {
	// Initialize Gin router
	router := gin.Default()

	// Enable CORS middleware using rs/cors
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, // Allow frontend origin
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
	})

	// Use CORS middleware with Gin
	// Gin middleware signature is: func(c *gin.Context)
	// So we use corsHandler.HandlerFunc to wrap the CORS handler
	router.Use(func(c *gin.Context) {
		corsHandler.HandlerFunc(c.Writer, c.Request) // this is the correct signature
		c.Next()
	})

	// Connect to the database
	var err error
	db, err = gorm.Open(sqlite.Open("urls.db"), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database!")
	}

	// Migrate the schema
	db.AutoMigrate(&URL{})

	// Define routes
	router.POST("/shorten", shortenURL)
	router.GET("/sh/:shortURL", redirectURL)
	router.GET("/expand/:shortURL", expandURL)

	// Start the server
	router.Run(":8080")
}

// shortenURL handles the creation of a short URL
func shortenURL(c *gin.Context) {
	var input struct {
		LongURL string `json:"long_url"`
	}

	// Parse JSON input
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Generate a short URL (for simplicity, use the length of the current DB)
	var count int64
	db.Model(&URL{}).Count(&count)
	shortURL := "short" + string(rune('A'+count))

	// Save to database
	url := URL{LongURL: input.LongURL, ShortURL: shortURL}
	db.Create(&url)

	c.JSON(http.StatusOK, gin.H{"short_url": shortURL})
}

// expandURL handles retrieving the original URL
func redirectURL(c *gin.Context) {
	shortURL := c.Param("shortURL")

	var url URL
	result := db.Where("short_url = ?", shortURL).First(&url)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
		return
	}
	if !hasScheme(url.LongURL) {
		url.LongURL = "http://" + url.LongURL
	}

	// c.JSON(http.StatusOK, gin.H{"long_url": url.LongURL})
	c.Redirect(http.StatusMovedPermanently, url.LongURL)
}

func hasScheme(url string) bool {
	return strings.HasPrefix(url, "http://") || strings.HasPrefix(url, "https://")
}

func expandURL(c *gin.Context) {
	shortURL := c.Param("shortURL")

	var url URL
	result := db.Where("short_url = ?", shortURL).First(&url)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
		return
	}
	if !hasScheme(url.LongURL) {
		url.LongURL = "http://" + url.LongURL
	}

	c.JSON(http.StatusOK, gin.H{"long_url": url.LongURL})
}
