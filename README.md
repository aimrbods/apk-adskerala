# APK Directory

Platform direktori aplikasi Android berbasis **Cloudflare Pages Functions**, **Cloudflare Workers/KV**, **Google Sheets**, dan **Google Drive**.

Website menampilkan informasi aplikasi Android seperti nama aplikasi, deskripsi, versi, ukuran, developer, kategori, icon, screenshot, dan link APK.

## 🚀 Arsitektur

Google Sheets
    │
    │ CSV
    ▼
Cloudflare Worker API
    │
    ▼
Cloudflare KV
    │
    ▼
Cloudflare Pages Functions
    │
    ├── /
    │
    └── /aplikasi/[slug]
    │
    ▼
Website APK Directory

File APK, icon, dan screenshot disimpan di Google Drive.

---

## 📁 Struktur Project

```text
APK-DIRECTORY/
│
├── functions/
│   ├── index.js
│   │
│   └── aplikasi/
│       └── [slug].js
│
├── lib/
│   ├── api.js
│   ├── config.js
│   ├── render.js
│   └── seo.js
│
├── .gitignore
└── README.md
