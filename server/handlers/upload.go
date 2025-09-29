package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"my-portfolio/db"
	"net/http"
	"os"
	"time"

	"github.com/google/uuid"
)


type UploadResponse  struct {
	Message string `json:"message"`
	FileUrl string `json:"fileUrl"`
}

func UploadHandler(w http.ResponseWriter,  r *http.Request){
	if r.Method != http.MethodPost {
		http.Error(w, "Method no allowed", http.StatusMethodNotAllowed)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	if len(header.Filename) < 4 || header.Filename[len(header.Filename)-4: ] != ".zip"{
		http.Error(w, "File harus .zip", http.StatusBadRequest)
		return
	}

	os.MkdirAll("uploads", os.ModePerm)
	dstPath := "uploads/" + header.Filename
	dst, err := os.Create(dstPath)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer dst.Close()
	if _, err = io.Copy(dst, file); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	id := uuid.New().String()
	name := header.Filename
	size := header.Size
	uploadDate := time.Now().Format("2006-01-02 15:04:05")
	tags := r.FormValue("tags")
	status := "Processing"
	fileUrl := "/uploads/" + name
	description := r.FormValue("description")
	downloadCount := 0
	longDescription := r.FormValue("longDescription")
	if longDescription == "" {
		longDescription = "" // default
	}
	

	// simpan ke database
	_, err = db.DB.Exec(`
    INSERT INTO project (id, name, size, uploadDate, tags, status, fileUrl, description, longDescription, downloadCount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id, name, size, uploadDate, tags, status, fileUrl, description, longDescription, downloadCount,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Insert failed", http.StatusInternalServerError)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(UploadResponse{
		Message: fmt.Sprintf("File %s berhasil di-upload", name),
		FileUrl: fileUrl,
	})
}