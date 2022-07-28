package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

type pack struct {
	Title string `json:"title"`
	Ping  int16  `json:"ping"`
	Pong  int16  `json:"pong"`
}

func main() {
	var gets int64 = 0
	var posts int64 = 0
	i := 0
	for i < 100 {
		url := "http://ping:80"
		var message pack
		start := time.Now()
		resp, err := http.Get(url + "/ping")
		elapsed := time.Since(start).Microseconds()
		gets += elapsed
		if err != nil {
			fmt.Print("Line 25: ")
			log.Fatalln(err)
		}
		bodyByte, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			fmt.Print("Line 30: ")
			log.Fatalln(err)
		}
		json.Unmarshal(bodyByte, &message)
		fmt.Printf("Ping %d, Pong %d\n", message.Ping, message.Pong)
		fmt.Printf("GET request #%d took %v microseconds\n", i+1, elapsed)
		message.Pong++
		bodyByte, err = json.Marshal(message)
		if err != nil {
			fmt.Print("Line 38: ")
			log.Fatalln(err)
		}
		start = time.Now()
		_, err = http.Post(url+"/pong", "application/json",
			bytes.NewBuffer(bodyByte))
		elapsed = time.Since(start).Microseconds()
		posts += elapsed
		if err != nil {
			fmt.Print("Line 44: ")
			log.Fatalln(err)
		}
		fmt.Printf("POST request #%d took %v microseconds\n", i+1, elapsed)
		i++
	}
	fmt.Printf("GET average response time %v microsecnds\n", gets/int64(i))
	fmt.Printf("POST average response time %v microsecnds\n", posts/int64(i))
}
