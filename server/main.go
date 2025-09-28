package main

import (
	"log"
	"my-portfolio/db"
	"my-portfolio/handlers"
	"net/http"
)

// Middleware CORS
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	db.Connect()
	db.Migrate()

	mux := http.NewServeMux()
	mux.HandleFunc("/upload", handlers.UploadHandler)
	mux.HandleFunc("/download", handlers.DownloadHandler)
	mux.HandleFunc("/list", handlers.ListHandler)

	handler := enableCORS(mux)

	log.Println("Server berjalan di :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
