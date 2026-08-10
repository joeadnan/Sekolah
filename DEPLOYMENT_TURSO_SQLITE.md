# Panduan Deploy Vercel + Turso SQLite Tanpa Prisma

## 1. Isi .env.local

```env
TURSO_DATABASE_URL="libsql://nama-database-nama-org.turso.io"
TURSO_AUTH_TOKEN="isi-token-turso-kamu"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin12345"
SESSION_SECRET="string-random-panjang-minimal-32-karakter"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 2. Setup database Turso

```bash
npm install
npm run db:schema:apply
npm run db:seed
```

## 3. Test local

```bash
npm run dev
```

## 4. Test build

```bash
npm run build
```

## 5. Vercel Environment Variables

Di Vercel, isi:

```env
TURSO_DATABASE_URL="libsql://nama-database-nama-org.turso.io"
TURSO_AUTH_TOKEN="isi-token-turso-kamu"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin12345"
SESSION_SECRET="string-random-panjang-minimal-32-karakter"
NEXT_PUBLIC_APP_URL="https://domain-vercel-kamu.vercel.app"
```

## 6. Deploy / Redeploy

Setelah environment variables lengkap, lakukan deploy atau redeploy.

## Catatan

Project ini tidak menggunakan Prisma. Build command cukup:

```bash
npm run build
```

Tidak perlu:

```bash
prisma generate
prisma migrate
prisma db push
```
