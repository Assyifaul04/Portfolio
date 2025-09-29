package handlers

import (
	"database/sql"
	"encoding/json"
	"my-portfolio/db"
	"net/http"
	"time"

	
)

// Struct project
type Project struct {
	ID            string    `json:"id"`
	Name          string    `json:"name"`
	Description   string    `json:"description"`
	LongDesc      string    `json:"longDescription"`
	Size          int64     `json:"size"`
	UploadDate    time.Time `json:"uploadDate"`
	Tags          []string  `json:"tags"`
	DownloadCount int       `json:"downloadCount"`
	Status        string    `json:"status"`
	FileUrl       string    `json:"fileUrl"`
}

// List semua project
func ListHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query(`
		SELECT id, name, description, longDescription, size, uploadDate, tags, downloadCount, status, fileUrl 
		FROM project
		ORDER BY uploadDate DESC
	`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var projects []Project
	for rows.Next() {
		var p Project
		var tagsStr string
		var longDesc sql.NullString

		err := rows.Scan(
			&p.ID, &p.Name, &p.Description, &longDesc, &p.Size,
			&p.UploadDate, &tagsStr, &p.DownloadCount, &p.Status, &p.FileUrl,
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if longDesc.Valid {
			p.LongDesc = longDesc.String
		} else {
			p.LongDesc = ""
		}

		if tagsStr != "" {
			if err := json.Unmarshal([]byte(tagsStr), &p.Tags); err != nil {
				p.Tags = []string{tagsStr}
			}
		} else {
			p.Tags = []string{}
		}

		projects = append(projects, p)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(projects)
}

// Ambil detail project by ID
func ProjectDetailHandler(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Path[len("/project/"):]
	if id == "" {
		http.Error(w, "Project ID required", http.StatusBadRequest)
		return
	}

	var p Project
	var tagsStr string
	var longDesc sql.NullString

	err := db.DB.QueryRow(`
		SELECT id, name, description, longDescription, size, uploadDate, tags, downloadCount, status, fileUrl
		FROM project
		WHERE id = ?
	`, id).Scan(&p.ID, &p.Name, &p.Description, &longDesc, &p.Size, &p.UploadDate, &tagsStr, &p.DownloadCount, &p.Status, &p.FileUrl)

	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Project not found", http.StatusNotFound)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	if longDesc.Valid {
		p.LongDesc = longDesc.String
	} else {
		p.LongDesc = ""
	}

	if tagsStr != "" {
		if err := json.Unmarshal([]byte(tagsStr), &p.Tags); err != nil {
			p.Tags = []string{tagsStr}
		}
	} else {
		p.Tags = []string{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}
