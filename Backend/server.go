package main

import (
	"database/sql"
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

type quiz struct {
	ID int `json:"id"`
	Quiz string `json:"quiz"`
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
	router.GET("/getRandom", getQuiz)
	//router.POST("/solve", solve)
	router.Run(":8081")
}

func getQuiz(c *gin.Context) {
	row, err := db.Query("SELECT ROWID, quizzes FROM sudoku ORDER BY RANDOM() LIMIT 1")
	if err != nil {
		log.Fatal(err)
	}
	defer row.Close()
	var quiz quiz
	row.Next()
	err = row.Scan(&quiz.ID, &quiz.Quiz)
	if err != nil {
		log.Fatal(err)
	}
	c.JSON(http.StatusOK, quiz)
	// res, err := http.Post("http://pythonsolver:8000", "application/json", bytes.NewBuffer(bodyBytes))
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// defer res.Body.Close()
	// bodyBytes, _ = ioutil.ReadAll(res.Body)
	// json.Unmarshal(bodyBytes, &sudoku)
	// c.JSON(http.StatusOK, sudoku)
}
