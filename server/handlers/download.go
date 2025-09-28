package handlers

import (
	"net/http"
	"os"
	"path/filepath"
	"my-portfolio/db"
)

func DownloadHandler(w http.ResponseWriter, r *http.Request) {
	file := r.URL.Query().Get("file")
	if file == "" {
		http.Error(w, "File tidak ada", http.StatusBadRequest)
		return
	}

	agree := r.URL.Query().Get("agree")
	if agree != "true" {
		http.Error(w, "Harus menyetujui syarat sebelum download", http.StatusForbidden)
		return
	}

	path := filepath.Join("uploads", file)

	if _, err := os.Stat(path); os.IsNotExist(err) {
		http.Error(w, "File tidak ditemukan", http.StatusNotFound)
		return
	}

	// Update download count
	_, _ = db.DB.Exec("UPDATE project SET downloadCount = downloadCount + 1 WHERE fileUrl = ?", "/uploads/"+file)

	w.Header().Set("Content-Disposition", "attachment; filename="+file)
	w.Header().Set("Content-Type", "application/zip")

	http.ServeFile(w, r, path)
}
