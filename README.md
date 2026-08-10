# School Website Next.js + Turso SQLite

Project website sekolah fullstack berbasis **Next.js App Router** dan **Turso/libSQL**.

Versi ini **sudah tidak menggunakan Prisma**. Semua query database memakai `@libsql/client` langsung melalui file:

```txt
lib/db.ts
```

## Fitur

- Website publik sekolah
- Profil sekolah
- Berita dan artikel
- Guru dan staff
- Akademik, kelas, mapel, fasilitas, ekskul, download dokumen
- Galeri
- PPDB online
- Form kontak
- Dashboard admin
- CRUD data akademik dan website
- Export data PPDB ke CSV

## Environment Local

Buat file `.env.local` di root project:

```env
TURSO_DATABASE_URL="libsql://nama-database-nama-org.turso.io"
TURSO_AUTH_TOKEN="isi-token-turso-kamu"

ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin12345"
SESSION_SECRET="ganti-dengan-string-random-panjang-minimal-32-karakter"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Jalankan di Local

```bash
npm install
npm run db:schema:apply
npm run db:seed
npm run dev
```

Buka:

```txt
http://localhost:3000
```

Login admin:

```txt
/admin atau /login
username: admin
password: admin12345
```

## Deploy ke Vercel

Tambahkan environment variable berikut di Vercel:

```env
TURSO_DATABASE_URL="libsql://nama-database-nama-org.turso.io"
TURSO_AUTH_TOKEN="isi-token-turso-kamu"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin12345"
SESSION_SECRET="ganti-dengan-string-random-panjang-minimal-32-karakter"
NEXT_PUBLIC_APP_URL="https://domain-vercel-kamu.vercel.app"
```

Lalu deploy/redeploy project.

## Script Penting

```bash
npm run dev              # Jalankan local development
npm run build            # Build production
npm run db:schema:apply  # Buat tabel di Turso dari database/schema.sql
npm run db:seed          # Isi data awal
npm run db:setup         # Schema + seed
```

## Catatan Database

- Schema SQL ada di `database/schema.sql`.
- Seed data ada di `database/seed.ts`.
- Koneksi Turso ada di `lib/db.ts`.
- Tidak ada `schema.prisma`, `prisma generate`, atau Prisma Client.
