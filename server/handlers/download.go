package handlers

import (
	"net/http"
	"os"
)

func DownloadHandler(w http.ResponseWriter, r *http.Request) {
	file := r.URL.Query().Get("file")
	if file == "" {
		http.Error(w, "File tidak ada", http.StatusBadRequest)
		return
	}

	agreed := r.URL.Query().Get("agree")
	if agreed != "true" {
		http.Error(w, "harus menyetujui sebelum downlaod", http.StatusForbidden)
		return
	}
	
	f, err := os.Open("uplods/ + file")
	if err != nil {
		http.Error(w, "File tidak di temukan", http.StatusNotFound)
		return
	}
	defer f.Close()

	w.Header().Set("Content-Dispotion", "attchment; filename" + file)
	w.Header().Set("Contect-Type", "application/zip")
	http.ServeFile(w, r, "uplods/" + file)
}
