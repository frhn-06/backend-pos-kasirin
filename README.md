# POS Kasirin — Backend

Backend REST API untuk aplikasi **POS Kasirin**, sebuah aplikasi Point of Sale yang dirancang untuk membantu kedai toko dalam mengelola produk, transaksi, pengguna, dan laporan penjualan.

Backend ini juga menerapkan konsep **multi-store / multi-tenant**, sehingga satu sistem dapat digunakan oleh berbagai kedai dengan data yang tetap terisolasi.

## ✨ Features

* 🔐 Authentication & Authorization
* 🏪 Multi-store / Multi-tenant
* 👥 Role Owner & Cashier
* 📦 Management Product & Category
* 🛒 Order & Transaction Management
* 🧾 Transaction History
* 📊 Sales Report
* 📅 Sales Report berdasarkan periode
* 🏆 Best Selling Product Report
* 📥 Export Report to Excel
* 🖼️ Image Upload
* 📧 Email Service
* 📖 API Documentation dengan Swagger

## 🛠️ Tech Stack

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT
* Cloudinary
* Nodemailer
* Swagger
* ExcelJS

## 🔐 Authentication

Aplikasi menggunakan **JWT (JSON Web Token)** untuk authentication dan authorization.

JWT digunakan untuk mengidentifikasi pengguna yang sedang login serta menentukan hak akses berdasarkan role.

Role yang tersedia:

* **Owner**
* **Cashier**

Setiap endpoint yang membutuhkan autentikasi akan melakukan validasi terhadap token sebelum request diproses.

## 🏪 Multi-Store Architecture

POS Kasirin dirancang menggunakan konsep **multi-store / multi-tenant**.

Artinya, satu aplikasi dapat digunakan oleh berbagai toko, dengan data setiap toko tetap terisolasi.

Sebagai contoh:

```text
Store A
├── Users
├── Products
├── Categories
└── Transactions

Store B
├── Users
├── Products
├── Categories
└── Transactions
```

Data dari Store A tidak dapat diakses oleh Store B.

Pendekatan ini memungkinkan aplikasi dikembangkan sebagai satu sistem yang dapat digunakan oleh banyak kedai tanpa mencampurkan data antar kedai.

## 📖 API Documentation

API tersedia dan dapat dipelajari melalui **Swagger API Documentation**.

```text
[https://backend-pos-kasirin.vercel.app/api-docs]
```

Swagger digunakan untuk mendokumentasikan endpoint API serta membantu proses testing dan eksplorasi API.

## 🔗 Frontend

Backend ini digunakan oleh frontend POS Kasirin yang dibangun menggunakan Next.js, React.js, dan TypeScript.

📂 **Frontend Repository**

[POS Kasirin — Frontend](https://github.com/frhn-06/frontend-pos-kasirin)

## ⚙️ Installation

Clone repository:

```bash
[git clone BACKEND_REPOSITORY_URL](https://github.com/frhn-06/backend-pos-kasirin.git)
```

Masuk ke folder project:

```bash
cd pos-kasirin-backend
```

Install dependencies:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Server akan berjalan sesuai konfigurasi port yang digunakan pada project.

## 🔑 Environment Variables

Buat file `.env` pada root project.

Contoh:

```env
PORT=
DATABASE_URL=
JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASSWORD=
```

> Sesuaikan nama environment variable dengan konfigurasi yang digunakan pada project.

**Jangan memasukkan nilai secret atau credential asli ke dalam repository.**

## 📚 About This Project

POS Kasirin merupakan project **Full-Stack Web Development** yang dibuat untuk mengimplementasikan kebutuhan aplikasi Point of Sale secara lebih lengkap.

Pada sisi backend, project ini mencakup proses authentication dan authorization, pengelolaan data produk dan kategori, transaksi penjualan, laporan, export data, upload gambar, serta integrasi layanan eksternal.

Salah satu fokus utama project ini adalah penerapan **multi-store / multi-tenant architecture**, sehingga satu aplikasi dapat digunakan oleh berbagai toko dengan data yang tetap terisolasi.

Project ini juga menjadi sarana untuk memperdalam pemahaman mengenai **REST API, database management, authentication, authorization, data isolation, dan integrasi antara frontend dengan backend**.
