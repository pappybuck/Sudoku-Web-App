package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

type sudoku struct {
	Quiz string `json:"quiz"`
	Solution string `json:"solution"`
}

var db *sql.DB

func main() {
	connection, err := sql.Open("sqlite3", "./sudoku.db")
	if err != nil {
		log.Fatal(err)
	}
	db = connection
	defer connection.Close()
	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()
	router.Use(cors.Default())
	router.GET("/all", getAll)
	router.Run(":8081")
}

func getAll(c *gin.Context) {
	row, err := db.Query("SELECT * FROM sudoku ORDER BY RANDOM() LIMIT 1")
	if err != nil {
		log.Fatal(err)
	}
	defer row.Close()
	var sudoku sudoku
	row.Next()
	err = row.Scan(&sudoku.Quiz, &sudoku.Solution)
	if err != nil {
		log.Fatal(err)
	}
	bodyBytes, _ := json.Marshal(sudoku)
	res, err := http.Post("http://pythonsolver:8000", "application/json", bytes.NewBuffer(bodyBytes))
	if err != nil {
		log.Fatal(err)
	}
	defer res.Body.Close()
	bodyBytes, _ = ioutil.ReadAll(res.Body)
	json.Unmarshal(bodyBytes, &sudoku)
	c.JSON(http.StatusOK, sudoku)
}
