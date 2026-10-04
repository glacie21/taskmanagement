# 📋 Task Management App

Aplikasi manajemen tugas berbasis web yang dibangun dengan **Next.js**, **PostgreSQL**, dan **Drizzle ORM**. Aplikasi ini memungkinkan pengguna untuk mengelola proyek dan tugas secara efisien dengan fitur autentikasi, prioritas tugas, dan status progres.

---

## 🛠️ Tech Stack

| Teknologi | Keterangan |
|---|---|
| [Next.js 16](https://nextjs.org) | Framework React full-stack |
| [PostgreSQL](https://www.postgresql.org) | Database relasional |
| [Drizzle ORM](https://orm.drizzle.team) | ORM & query builder untuk TypeScript |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first CSS framework |
| [React Hook Form](https://react-hook-form.com) | Manajemen form |
| [Zod](https://zod.dev) | Validasi schema |
| [Recharts](https://recharts.org) | Visualisasi data / chart |
| [Lucide React](https://lucide.dev) | Ikon |

---

## ✅ Prasyarat

Sebelum memulai, pastikan kamu sudah menginstall:

- **Node.js** versi 18 atau lebih baru → [Download Node.js](https://nodejs.org)
- **PostgreSQL** yang sedang berjalan secara lokal atau remote → [Download PostgreSQL](https://www.postgresql.org/download/)
- **npm**, **yarn**, **pnpm**, atau **bun** (package manager)

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Clone Repository

```bash
git clone <url-repository-kamu>
cd taskmanagement
```

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
# atau
pnpm install
```

### 3. Konfigurasi Environment Variables

Buat file `.env.local` di root project, lalu isi variabel berikut:

```env
# URL koneksi ke database PostgreSQL kamu
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskflow

# Secret key untuk JWT / session (ganti dengan string acak yang panjang dan aman)
JWT_SECRET=ganti_dengan_secret_key_yang_panjang_dan_aman
```

> **Tips:** Kamu bisa menggunakan `openssl rand -base64 32` di terminal untuk menghasilkan `JWT_SECRET` yang aman.

> **Penting:** Jangan pernah commit file `.env.local` ke repository. File ini sudah terdaftar di `.gitignore`.

### 4. Setup Database

Pastikan PostgreSQL sudah berjalan dan database `taskflow` sudah dibuat:

```sql
-- Jalankan perintah ini di PostgreSQL client (psql / pgAdmin / DBeaver, dll.)
CREATE DATABASE taskflow;
```

Kemudian jalankan migrasi untuk membuat tabel-tabel yang diperlukan:

```bash
# Generate file migrasi dari schema
npx drizzle-kit generate

# Terapkan migrasi ke database
npx drizzle-kit migrate
```

> **Catatan:** Schema database berada di `src/lib/db/schema.ts`. Tabel yang akan dibuat: `users`, `projects`, dan `tasks`.

### 5. Jalankan Development Server

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser kamu. Aplikasi siap digunakan! 🎉

---

## 📂 Struktur Project

```
taskmanagement/
├── src/
│   ├── app/                  # Halaman & routing (Next.js App Router)
│   │   ├── layout.tsx        # Layout utama aplikasi
│   │   ├── page.tsx          # Halaman utama (/)
│   │   └── globals.css       # Style global
│   └── lib/
│       └── db/
│           ├── schema.ts     # Definisi tabel database (Drizzle)
│           └── migrations/   # File migrasi database (auto-generated)
├── drizzle.config.ts         # Konfigurasi Drizzle ORM
├── next.config.ts            # Konfigurasi Next.js
├── .env.local                # Environment variables (buat sendiri, jangan di-commit!)
└── package.json
```

---

## 🗄️ Skema Database

Aplikasi ini memiliki 3 tabel utama:

- **`users`** – Data akun pengguna (nama, email, password terenkripsi)
- **`projects`** – Proyek milik pengguna (nama, deskripsi, warna label)
- **`tasks`** – Tugas dalam proyek (judul, status, prioritas, tenggat waktu)

**Status tugas yang tersedia:** `TO DO` | `IN_PROGRESS` | `DONE`

**Prioritas tugas yang tersedia:** `LOW` | `MEDIUM` | `HIGH`

---

## 📜 Daftar Script

| Script | Perintah | Keterangan |
|---|---|---|
| Development | `npm run dev` | Jalankan server development |
| Build | `npm run build` | Build untuk production |
| Start | `npm run start` | Jalankan server production (setelah build) |
| Lint | `npm run lint` | Periksa kualitas kode |
| DB Generate | `npx drizzle-kit generate` | Generate file migrasi baru |
| DB Migrate | `npx drizzle-kit migrate` | Terapkan migrasi ke database |
| DB Studio | `npx drizzle-kit studio` | Buka Drizzle Studio (GUI database browser) |

---

## ❓ Troubleshooting

**Koneksi database gagal?**
- Pastikan PostgreSQL sedang berjalan (`pg_ctl status` atau cek di Windows Services)
- Periksa kembali nilai `DATABASE_URL` di file `.env.local`
- Pastikan database `taskflow` sudah dibuat

**Error saat migrasi?**
- Jalankan `npx drizzle-kit generate` terlebih dahulu sebelum `migrate`
- Pastikan user PostgreSQL memiliki hak akses ke database

**Port 3000 sudah dipakai?**
- Ganti port dengan `npm run dev -- -p 3001`

**Module not found / dependency error?**
- Hapus folder `node_modules` dan file `package-lock.json`, lalu jalankan ulang `npm install`