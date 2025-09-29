package handlers

import (
	"net/http"
	"os"
	"path/filepath"
	"my-portfolio/db"
)

func DownloadHandler(w http.ResponseWriter, r *http.Request) {
    id := r.URL.Query().Get("id")
    if id == "" {
        http.Error(w, "File tidak ada", http.StatusBadRequest)
        return
    }

    agree := r.URL.Query().Get("agree")
    if agree != "true" {
        http.Error(w, "Harus menyetujui syarat sebelum download", http.StatusForbidden)
        return
    }

    // Ambil nama file dari database
    var fileUrl string
    err := db.DB.QueryRow("SELECT fileUrl FROM project WHERE id = ?", id).Scan(&fileUrl)
    if err != nil {
        http.Error(w, "File tidak ditemukan", http.StatusNotFound)
        return
    }

    // fileUrl = "/uploads/filename.zip" → ambil filename
    filename := filepath.Base(fileUrl)
    path := filepath.Join("uploads", filename)

    if _, err := os.Stat(path); os.IsNotExist(err) {
        http.Error(w, "File tidak ditemukan", http.StatusNotFound)
        return
    }

    // Update download count
    _, _ = db.DB.Exec("UPDATE project SET downloadCount = downloadCount + 1 WHERE id = ?", id)

    w.Header().Set("Content-Disposition", "attachment; filename="+filename)
    w.Header().Set("Content-Type", "application/zip")

    http.ServeFile(w, r, path)
}

