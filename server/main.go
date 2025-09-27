package main

import (
	"log"
	"my-portfolio/handlers"
	"net/http"
)

func main() {
    http.HandleFunc("/upload", handlers.UploadHandler)
    http.HandleFunc("/download", handlers.DownloadHandler)

    log.Println("Server berjalan di :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
