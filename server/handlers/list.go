package handlers

import (
	"encoding/json"
	"net/http"
	"my-portfolio/db"
)

type Project struct {
	ID            string   `json:"id"`
	Name          string   `json:"name"`
	Description   string   `json:"description"`
	LongDesc      string   `json:"longDescription"`
	Size          int      `json:"size"`
	UploadDate    string   `json:"uploadDate"`
	Tags          []string `json:"tags"`
	DownloadCount int      `json:"downloadCount"`
	Status        string   `json:"status"`
	FileUrl       string   `json:"fileUrl"`
}

func ListHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query("SELECT id, name, description, longDescription, size, uploadDate, tags, downloadCount, status, fileUrl FROM project ORDER BY uploadDate DESC")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var projects []Project
	for rows.Next() {
		var p Project
		var tags string
		err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.LongDesc, &p.Size, &p.UploadDate, &tags, &p.DownloadCount, &p.Status, &p.FileUrl)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		p.Tags = []string{}
		if tags != "" {
			p.Tags = append(p.Tags, tags)
		}

		projects = append(projects, p)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(projects)
}
