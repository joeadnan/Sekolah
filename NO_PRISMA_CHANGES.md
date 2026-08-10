# Perubahan: Turso SQLite Tanpa Prisma

Project ini sudah diubah agar tidak menggunakan Prisma.

## File yang diganti / ditambahkan

- `lib/db.ts` — koneksi dan query langsung ke Turso memakai `@libsql/client`.
- `database/schema.sql` — schema SQLite/Turso untuk semua tabel.
- `database/seed.ts` — seed data memakai database layer langsung.
- `scripts/apply-turso-schema.mjs` — menjalankan schema SQL ke Turso.
- `package.json` — dependency Prisma dihapus.

## Dependency yang dipakai

```json
"@libsql/client": "0.8.1"
```

## Dependency yang dihapus

```txt
prisma
@prisma/client
@prisma/adapter-libsql
```

## Script baru

```bash
npm run db:schema:apply
npm run db:seed
npm run db:setup
```

## Urutan install dan run

```bash
npm install
npm run db:schema:apply
npm run db:seed
npm run dev
```

## Build Vercel

Build command cukup:

```bash
npm run build
```

Tidak perlu `prisma generate`.
