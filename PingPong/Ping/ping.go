package main

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type pack struct {
	Title string `json:"title"`
	Ping  int16  `json:"ping"`
	Pong  int16  `json:"pong"`
}

var message = pack{
	Title: "From ping", Ping: 0, Pong: 0,
}

func main() {
	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()
	router.Use(cors.Default())
	router.GET("/ping", getPing)
	router.GET("/", getCurrent)
	router.POST("/pong", postPong)
	router.Run(":80")
}

func getCurrent(c *gin.Context) {
	c.JSON(http.StatusOK, message)
}

func getPing(c *gin.Context) {
	message.Ping++
	c.JSON(http.StatusOK, message)
}

func postPong(c *gin.Context) {
	var received pack
	if err := c.BindJSON(&received); err != nil {
		return
	}
	message.Pong = received.Pong
	c.JSON(http.StatusOK, message)
}
