# 📋 Task Management App

<p align="center">
  Aplikasi manajemen proyek dan tugas modern berbasis web full-stack, dirancang untuk memudahkan tracking progres kerja dengan antarmuka yang bersih, responsif, dan performa tinggi.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-v0.45-C5F74F?style=for-the-badge&logo=drizzle" alt="Drizzle ORM" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
</p>

---

## 📑 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Prasyarat](#-prasyarat)
- [Panduan Instalasi & Menjalankan](#-panduan-instalasi--menjalankan)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Konfigurasi Environment](#3-konfigurasi-environment)
  - [4. Siapkan Database PostgreSQL](#4-siapkan-database-postgresql)
  - [5. Jalankan Migrasi Database](#5-jalankan-migrasi-database)
  - [6. Jalankan Server](#6-jalankan-server)
- [Skema & Relasi Database](#-skema--relasi-database)
- [Drizzle Studio (Database GUI)](#-drizzle-studio-database-gui)
- [Struktur Direktori](#-struktur-direktori)
- [Daftar Perintah (Scripts)](#-daftar-perintah-scripts)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Fitur Utama

- 🔐 **Autentikasi Pengguna**: Sistem pendaftaran dan login aman dengan enkripsi kata sandi (bcrypt) dan session berbasis JWT (`jose`).
- 📁 **Manajemen Proyek**: Kelola proyek dengan label warna yang dapat disesuaikan untuk membedakan kategori pekerjaan.
- ✅ **Tracking Tugas Komprehensif**: Tambah, perbarui, dan filter tugas dengan status progres (`TODO`, `IN_PROGRESS`, `DONE`) dan tingkat prioritas (`LOW`, `MEDIUM`, `HIGH`).
- 📅 **Tenggat Waktu (Due Dates)**: Pantau batas waktu pengerjaan setiap tugas agar tidak terlewat.
- 📊 **Visualisasi & Statistik**: Integrasi grafik visual (Recharts) untuk melihat ringkasan produktivitas tugas.
- 🌓 **Tema Gelap & Terang**: Tampilan modern yang nyaman di mata dengan dukungan Dark Mode (`next-themes`).
- ⚡ **Validasi Aman**: Validasi form end-to-end menggunakan React Hook Form dan skema Zod.

---

## 🛠️ Tech Stack

| Kategori | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) | Framework React modern untuk frontend & API backend |
| **Bahasa** | [TypeScript](https://www.typescriptlang.org/) | Pengetikan statis untuk keandalan kode |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) | Framework CSS berbasis utility |
| **Database** | [PostgreSQL](https://www.postgresql.org) | Database relasional yang andal dan scalable |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team) | Type-safe ORM & query builder performa tinggi |
| **Form & Validasi** | [React Hook Form](https://react-hook-form.com) & [Zod](https://zod.dev) | Pengelolaan input dan validasi data |
| **Visualisasi** | [Recharts](https://recharts.org) | Komponen grafik interaktif |
| **Icons & Feedback** | [Lucide React](https://lucide.dev) & [Sonner](https://sonner.emilkowal.ski/) | Set ikon modern dan notifikasi toast |

---

## 📋 Prasyarat

Sebelum menjalankan project di komputer lokal, pastikan telah menginstal:

1. **Node.js**: Versi `18.18+` atau `20+` (disarankan) &rarr; [Download Node.js](https://nodejs.org)
2. **Package Manager**: `npm`, `pnpm`, `yarn`, atau `bun`
3. **PostgreSQL**: Dapat menggunakan PostgreSQL lokal atau via Docker container

---

## 🚀 Panduan Instalasi & Menjalankan

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi di lingkungan lokal:

### 1. Clone Repository

```bash
git clone <url-repository-kamu>
cd taskmanagement
```

### 2. Install Dependencies

```bash
npm install
```
*(atau gunakan `pnpm install` / `yarn install` / `bun install`)*

### 3. Konfigurasi Environment

Duplikat file template `.env.example` menjadi `.env.local`:

**Linux / macOS:**
```bash
cp .env.example .env.local
```

**Windows (PowerShell):**
```powershell
copy .env.example .env.local
```

Buka file `.env.local` lalu sesuaikan isinya:

```env
# URL koneksi ke PostgreSQL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskflow

# Secret key untuk JWT / session (minimal 32 karakter)
JWT_SECRET=super_secret_jwt_key_silakan_ganti_dengan_string_acak
```

> 💡 **Tips:** Untuk membuat string acak yang aman untuk `JWT_SECRET`, jalankan:
> ```bash
> openssl rand -base64 32
> ```

---

### 4. Siapkan Database PostgreSQL

Pilih salah satu metode yang paling mudah bagi kamu:

#### Opsi A: Menggunakan Docker (Paling Praktis)
Jika memiliki Docker, kamu bisa menjalankan PostgreSQL secara instan tanpa install database lokal:

```bash
docker run --name taskflow-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=taskflow -p 5432:5432 -d postgres:16-alpine
```

#### Opsi B: Menggunakan PostgreSQL Lokal
Jika menggunakan PostgreSQL lokal (pgAdmin / DBeaver / terminal `psql`):

```sql
CREATE DATABASE taskflow;
```

---

### 5. Jalankan Migrasi Database

Sinkronkan skema tabel ke dalam database kamu:

```bash
# 1. Generate migrasi dari schema (src/lib/db/schema.ts)
npm run db:generate

# 2. Terapkan migrasi ke database PostgreSQL
npm run db:migrate
```

> ⚡ **Alternatif Cepat (Development Push):**
> Kamu juga bisa langsung menyelaraskan skema tanpa file migrasi menggunakan:
> ```bash
> npm run db:push
> ```

---

### 6. Jalankan Server

Jalankan server Next.js pada mode development:

```bash
npm run dev
```

Buka browser dan akses:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🗄️ Skema & Relasi Database

Aplikasi ini menggunakan 3 entitas tabel utama yang saling terhubung:

```
┌──────────────┐         ┌────────────────┐         ┌──────────────┐
│    users     │ 1 ──── n│    projects    │ 1 ──── n│    tasks     │
├──────────────┤         ├────────────────┤         ├──────────────┤
│ id (PK)      │         │ id (PK)        │         │ id (PK)      │
│ name         │         │ name           │         │ title        │
│ email        │         │ description    │         │ description  │
│ password     │         │ color          │         │ status       │
│ createdAt    │         │ userId (FK)    │         │ priority     │
│ updatedAt    │         │ createdAt      │         │ dueDate      │
└──────────────┘         │ updatedAt      │         │ projectId(FK)│
                         └────────────────┘         │ userId (FK)  │
                                                    │ createdAt    │
                                                    │ updatedAt    │
                                                    └──────────────┘
```

- **`users`**: Menyimpan akun pengguna terdaftar.
- **`projects`**: Mengelompokkan tugas berdasarkan ruang lingkup/proyek milik user (`ON DELETE CASCADE`).
- **`tasks`**: Menyimpan detail tugas dengan atribut:
  - **Status**: `TODO` | `IN_PROGRESS` | `DONE`
  - **Prioritas**: `LOW` | `MEDIUM` | `HIGH`
  - **Due Date**: Tenggat waktu pengerjaan tugas

---

## 🖥️ Drizzle Studio (Database GUI)

Drizzle menyediakan antarmuka visual berbasis web untuk memeriksa, menambah, mengedit, dan menghapus data database secara langsung:

```bash
npm run db:studio
```

Akses GUI database di: **[https://local.drizzle.team](https://local.drizzle.team)**

---

## 📂 Struktur Direktori

```
taskmanagement/
├── src/
│   ├── app/                      # Next.js App Router (Halaman & Layout)
│   │   ├── layout.tsx            # Root layout & providers
│   │   ├── page.tsx              # Halaman beranda utama
│   │   └── globals.css           # Styling global & konfigurasi tema Tailwind
│   └── lib/
│       └── db/
│           ├── schema.ts         # Definisi tabel & relasi database (Drizzle)
│           └── migrations/       # Hasil generate file migrasi SQL
├── public/                       # Aset statis publik (ikon, gambar)
├── .env.example                  # Template konfigurasi environment
├── drizzle.config.ts             # Konfigurasi Drizzle ORM
├── next.config.ts                # Konfigurasi Next.js
├── package.json                  # Daftar dependencies & script
├── postcss.config.mjs            # Konfigurasi PostCSS
└── tsconfig.json                 # Konfigurasi TypeScript
```

---

## 📜 Daftar Perintah (Scripts)

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan local development server di `http://localhost:3000` |
| `npm run build` | Melakukan compile dan build aplikasi untuk tahap produksi |
| `npm run start` | Menjalankan server aplikasi production hasil build |
| `npm run lint` | Menjalankan pengecekan ESLint untuk menjaga kualitas kode |
| `npm run db:generate` | Membuat berkas migrasi SQL baru berdasarkan perubahan di `schema.ts` |
| `npm run db:migrate` | Menerapkan migrasi tertunda ke database PostgreSQL |
| `npm run db:push` | Mendorong perubahan skema langsung ke database (prototyping cepat) |
| `npm run db:studio` | Membuka Drizzle Studio di browser untuk eksplorasi data |

---

## ❓ Troubleshooting

<details>
<summary><b>1. Error: Connection refused pada DATABASE_URL (PostgreSQL)</b></summary>

- Pastikan service PostgreSQL sudah berjalan di komputer kamu.
- Jika menggunakan Docker, periksa container aktif dengan `docker ps`.
- Pastikan port `5432` belum diblokir oleh firewall atau digunakan oleh instance database lain.
- Cek kembali username, password, dan port pada `DATABASE_URL` di file `.env.local`.
</details>

<details>
<summary><b>2. Error: Database "taskflow" does not exist</b></summary>

Database belum dibuat di PostgreSQL. Buat terlebih dahulu dengan mengeksekusi:
```sql
CREATE DATABASE taskflow;
```
atau pastikan nama database di `DATABASE_URL` sesuai dengan database yang sudah ada.
</details>

<details>
<summary><b>3. Port 3000 sudah digunakan (Port in use)</b></summary>

Jalankan development server pada port alternatif (misal `3001`):
```bash
npm run dev -- -p 3001
```
</details>

<details>
<summary><b>4. Masalah cache / dependensi bermasalah</b></summary>

Jika mengalami error modul tidak ditemukan setelah pembaruan branch:
```bash
# Windows (PowerShell)
Remove-Item -Recurse -Force node_modules, .next
npm install

# Linux / macOS
rm -rf node_modules .next
npm install
```
</details>

---

## 📄 Lisensi

Didistribusikan di bawah lisensi MIT. Lihat berkas `LICENSE` untuk informasi lebih lanjut.