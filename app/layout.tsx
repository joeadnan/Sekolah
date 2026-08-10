import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "School Website Fullstack Next.js",
  description: "Website sekolah dan dashboard manajemen berbasis Next.js dan Turso/libSQL tanpa Prisma."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
