# My Portfolio 🚀

Portfolio Website menggunakan **Next.js + Tailwind + shadcn/ui**  
Backend dengan **Golang**, database & storage menggunakan **Supabase**.

---

## ✨ Fitur
- ✍️ Profile & About Section
- 📂 Project showcase
- 📬 Contact form
- ⬆️ Upload file `.zip` (hanya admin)
- ⬇️ Download file dengan syarat izin dari pemilik
- 🔐 Metadata file tersimpan di Supabase

---

## 📦 Tech Stack
- [Next.js 14](https://nextjs.org/) (App Router)
- [TailwindCSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Golang](https://go.dev/) HTTP server
- [Supabase](https://supabase.com/) (Database & Storage)

---

## ⚙️ Setup Project

### 1. Clone Repo
```bash
git clone https://github.com/username/my-portfolio.git
cd my-portfolio

2. Setup Backend (Golang)
cd server
go mod tidy
go run main.go
Backend akan berjalan di http://localhost:8080


3. Setup Frontend (Next.js)
cd src/app
npm install
npm run dev
Frontend akan berjalan di http://localhost:3000


