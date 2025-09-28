package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func Connect() {
	// ganti user, password, dbname sesuai Laragon
	user := "root"
	password := ""
	host := "127.0.0.1"
	port := "3306"
	dbname := "my_portfolio"

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", user, password, host, port, dbname)

	var err error
	DB, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Gagal koneksi ke database: %v", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatalf("Database tidak bisa di-ping: %v", err)
	}

	log.Println("Berhasil terkoneksi ke database MySQL")
}

func Migrate() {
	query := `
	CREATE TABLE IF NOT EXISTS project (
		id VARCHAR(36) PRIMARY KEY,
		name VARCHAR(255),
		description TEXT,
		longDescription TEXT,
		size BIGINT,
		uploadDate DATETIME,
		tags VARCHAR(255),
		downloadCount INT DEFAULT 0,
		status VARCHAR(50) DEFAULT 'Processing',
		fileUrl VARCHAR(255)
	);`

	_, err := DB.Exec(query)
	if err != nil {
		log.Fatalf("Gagal membuat tabel: %v", err)
	}

	log.Println("Tabel project siap digunakan")
}

