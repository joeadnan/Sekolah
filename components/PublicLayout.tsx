import Link from "next/link";
import { getSiteSetting } from "@/lib/site";

const menus = [
  ["/", "Beranda"],
  ["/profil", "Profil"],
  ["/akademik", "Akademik"],
  ["/guru", "Guru"],
  ["/berita", "Berita"],
  ["/galeri", "Galeri"],
  ["/ppdb", "PPDB"],
  ["/kontak", "Kontak"]
] as const;

export async function PublicNavbar() {
  const setting = await getSiteSetting();

  return (
    <header className="public-navbar">
      <div className="container public-nav-inner">
        <Link href="/" className="flex-center">
          <span className="brand-mark">{setting.logoText}</span>
          <span>
            <span className="brand-title">{setting.schoolName}</span>
            <span className="brand-subtitle">Website Resmi Sekolah</span>
          </span>
        </Link>
        <nav className="nav-links">
          {menus.map(([href, label]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
          <Link href="/login" className="btn btn-sm btn-primary">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
}

export async function PublicFooter() {
  const setting = await getSiteSetting();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="flex-center" style={{ marginBottom: 14 }}>
              <span className="brand-mark">{setting.logoText}</span>
              <h3 className="footer-title">{setting.schoolName}</h3>
            </div>
            <p className="mb-0">{setting.tagline}</p>
          </div>
          <div>
            <h4 className="footer-title">Kontak</h4>
            <p>📍 {setting.address || "Alamat sekolah belum diatur"}</p>
            <p>☎️ {setting.phone || "-"}</p>
            <p>✉️ {setting.email || "-"}</p>
          </div>
          <div>
            <h4 className="footer-title">Menu</h4>
            <div className="grid gap-sm">
              <Link href="/profil">Profil Sekolah</Link>
              <Link href="/akademik">Akademik</Link>
              <Link href="/berita">Berita</Link>
              <Link href="/ppdb">PPDB Online</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom flex-between wrap">
          <span>© {new Date().getFullYear()} {setting.schoolName}. All rights reserved.</span>
          <span>Dibuat dengan Next.js Fullstack</span>
        </div>
      </div>
    </footer>
  );
}

export async function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNavbar />
      {children}
      <PublicFooter />
    </>
  );
}
