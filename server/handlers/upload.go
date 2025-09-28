package handlers

import (
	"database/sql"
	"fmt"
	"io"
	"net/http"
	"os"
	"my-portfolio/db"
	"time"

	"github.com/google/uuid"
)

func UploadHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	if len(header.Filename) < 4 || header.Filename[len(header.Filename)-4:] != ".zip" {
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

	_, err = io.Copy(dst, file)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Simpan metadata ke database
	id := uuid.New().String()
	uploadDate := time.Now().Format("2006-01-02 15:04:05")
	tags := "React,Next.js"
	status := "Processing"
	size := header.Size
	fileUrl := "/uploads/" + header.Filename

	_, err = db.DB.Exec(`
		INSERT INTO project (id, name, size, uploadDate, tags, status, fileUrl)
		VALUES (?, ?, ?, ?, ?, ?, ?)`,
		id, header.Filename, size, uploadDate, tags, status, fileUrl)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Insert failed", http.StatusInternalServerError)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"message":"File %s berhasil di-upload","fileUrl":"%s"}`, header.Filename, fileUrl)
}
