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
	Quiz     string `json:"quiz"`
	Solution string `json:"solution"`
}

type quiz struct {
	ID   int    `json:"id"`
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
	router.POST("/solve", postSolve)
	router.POST("/check", postCheck)
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
}

func postSolve(c *gin.Context) {
	var sudoku sudoku
	c.BindJSON(&sudoku)
	var quiz [][]int = make([][]int, 9)
	for i := 0; i < 9; i++ {
		quiz[i] = make([]int, 9)
		for j := 0; j < 9; j++ {
			quiz[i][j] = int(sudoku.Quiz[i*9+j]) - 48
		}
	}
	for i := 0; i < 9; i++ {
		var dictx = make(map[int]int)
		var dicty = make(map[int]int)
		for j := 0; j < 9; j++ {
			dictx[quiz[i][j]]++
			dicty[quiz[j][i]]++
		}
		for k := 1; k < 10; k++ {
			if dictx[k] > 1 || dicty[k] > 1 {
				c.JSON(http.StatusOK, gin.H{"quiz": sudoku.Quiz, "solution": "Invalid"})
				return
			}
		}
	}
	for i := 0; i < 9; i += 3 {
		for j := 0; j < 9; j += 3 {
			var dict = make(map[int]int)
			for k := 0; k < 9; k++ {
				dict[quiz[i+k/3][j+k%3]]++
			}
			for k := 1; k < 10; k++ {
				if dict[k] > 1 {
					c.JSON(http.StatusOK, gin.H{"quiz": sudoku.Quiz, "solution": "Invalid"})
					return
				}
			}
		}
	}
	bodyBytes, _ := json.Marshal(sudoku)
	res, err := http.Post("http://pythonsolver:8000", "application/json", bytes.NewBuffer(bodyBytes))
	if err != nil {
		log.Fatal(err)
	}
	defer res.Body.Close()
	bodyBytes, _ = ioutil.ReadAll(res.Body)
	json.Unmarshal(bodyBytes, &sudoku)
	if sudoku.Solution == sudoku.Quiz {
		c.JSON(http.StatusOK, gin.H{"quiz": sudoku.Quiz, "solution": "No Solution Found"})
		return
	}
	c.JSON(http.StatusOK, sudoku)
}

func postCheck(c *gin.Context) {
	var sudoku sudoku
	c.BindJSON(&sudoku)
	var quiz [][]int = make([][]int, 9)
	for i := 0; i < 9; i++ {
		quiz[i] = make([]int, 9)
		for j := 0; j < 9; j++ {
			quiz[i][j] = int(sudoku.Quiz[i*9+j]) - 48
		}
	}
	for i := 0; i < 9; i++ {
		var dictx = make(map[int]int)
		var dicty = make(map[int]int)
		for j := 0; j < 9; j++ {
			dictx[quiz[i][j]]++
			dicty[quiz[j][i]]++
		}
		for k := 1; k < 10; k++ {
			if dictx[k] != 1 || dicty[k] != 1 {
				c.JSON(http.StatusOK, gin.H{"quiz": sudoku.Quiz, "solution": "Invalid"})
				return
			}
		}
	}
	for i := 0; i < 9; i += 3 {
		for j := 0; j < 9; j += 3 {
			var dict = make(map[int]int)
			for k := 0; k < 9; k++ {
				dict[quiz[i+k/3][j+k%3]]++
			}
			for k := 1; k < 10; k++ {
				if dict[k] != 1 {
					c.JSON(http.StatusOK, gin.H{"quiz": sudoku.Quiz, "solution": "Invalid"})
					return
				}
			}
		}
	}
	c.JSON(http.StatusOK, gin.H{"quiz": sudoku.Quiz, "solution": "Solution Found"})
}
