import Link from "next/link";
import { PublicLayout } from "@/components/PublicLayout";
import { db } from "@/lib/db";
import { getPublicStats, getSiteSetting } from "@/lib/site";
import { formatDate, truncate } from "@/lib/format";
import { getChoiceLabel, priorityOptions } from "@/lib/admin-config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function HomePage() {
  const [setting, stats, announcements, facilities, latestNews, gallery] =
    await Promise.all([
      getSiteSetting(),
      getPublicStats(),
      db.announcement.findMany({
        where: { isActive: true },
        orderBy: { startDate: "desc" },
        take: 3,
      }),
      db.facility.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        take: 6,
      }),
      db.newsPost.findMany({
        where: { status: "published" },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
      db.gallery.findMany({
        where: { isFeatured: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

  return (
    <PublicLayout>
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <span className="badge badge-warning">Website Resmi Sekolah</span>
            <h1 className="hero-title">{setting.schoolName}</h1>
            <p className="hero-lead">{setting.tagline}</p>
            <div className="flex gap-sm wrap">
              <Link href="/ppdb" className="btn btn-warning">
                Daftar PPDB
              </Link>
              <Link href="/profil" className="btn btn-outline-light">
                Lihat Profil
              </Link>
            </div>
          </div>
          {/* <div className="hero-card">
            <div className="placeholder-visual">
              <div>
                <div className="visual-icon">🎓</div>
                <h2>Smart School</h2>
                <p className="mb-0">Learning • Character • Achievement</p>
              </div>
            </div>
          </div> */}
        </div>
      </section>

      {/* <section className="section">
        <div className="container grid grid-4 text-center">
          <div className="card card-pad">
            <div className="stat-number">{stats.students}</div>
            <div className="text-muted">Siswa Aktif</div>
          </div>
          <div className="card card-pad">
            <div className="stat-number">{stats.teachers}</div>
            <div className="text-muted">Guru & Staff</div>
          </div>
          <div className="card card-pad">
            <div className="stat-number">{stats.classes}</div>
            <div className="text-muted">Kelas</div>
          </div>
          <div className="card card-pad">
            <div className="stat-number">{stats.subjects}</div>
            <div className="text-muted">Mata Pelajaran</div>
          </div>
        </div>
      </section> */}

      {announcements.length ? (
        <section className="section section-soft">
          <div className="container">
            <span className="badge section-kicker">Informasi</span>
            <div className="flex-between wrap" style={{ marginBottom: 26 }}>
              <h2 className="section-title">Pengumuman Terbaru</h2>
            </div>
            <div className="grid grid-3">
              {announcements.map((item) => (
                <article key={item.id} className="card card-pad feature-card">
                  <div className="flex-between wrap">
                    <span className="badge">
                      {getChoiceLabel(priorityOptions, item.priority)}
                    </span>
                    <small className="text-muted">
                      {formatDate(item.startDate)}
                    </small>
                  </div>
                  <h3>{item.title}</h3>
                  <p className="text-muted mb-0">
                    {truncate(item.content, 130)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container grid grid-2" style={{ alignItems: "center" }}>
          <div>
            <span className="badge section-kicker">Tentang</span>
            <h2 className="section-title">
              Membangun lingkungan belajar yang aman, modern, dan berprestasi.
            </h2>
            <p className="section-desc">
              {truncate(setting.about, 360) ||
                "Website ini menyediakan informasi sekolah sekaligus sistem manajemen akademik agar data siswa, guru, nilai, absensi, berita, agenda, galeri, dan PPDB dapat dikelola dengan rapi."}
            </p>
            <Link href="/profil" className="btn btn-primary">
              Selengkapnya
            </Link>
          </div>
          <div className="grid grid-2">
            {[
              [
                "🛡️",
                "Karakter",
                "Pembiasaan disiplin, tanggung jawab, dan kepedulian.",
              ],
              [
                "📈",
                "Prestasi",
                "Mendorong siswa aktif akademik dan non-akademik.",
              ],
              [
                "💻",
                "Digital",
                "Informasi dan data sekolah terkelola secara online.",
              ],
              [
                "🤝",
                "Kolaboratif",
                "Komunikasi sekolah, siswa, dan wali lebih mudah.",
              ],
            ].map(([icon, title, desc]) => (
              <div className="card card-pad" key={title}>
                <div className="icon-box">{icon}</div>
                <h3>{title}</h3>
                <p className="text-muted mb-0">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {facilities.length ? (
        <section className="section section-soft">
          <div className="container">
            <div className="text-center" style={{ marginBottom: 36 }}>
              <span className="badge section-kicker">Fasilitas</span>
              <h2 className="section-title">Fasilitas Sekolah</h2>
              <p className="section-desc">
                Fasilitas pendukung pembelajaran dan kegiatan siswa.
              </p>
            </div>
            <div className="grid grid-3">
              {facilities.map((facility) => (
                <article
                  className="card card-pad feature-card"
                  key={facility.id}
                >
                  <div className="icon-box">🏛️</div>
                  <h3>{facility.name}</h3>
                  <p className="text-muted mb-0">
                    {truncate(facility.description, 120)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container">
          <div className="flex-between wrap" style={{ marginBottom: 28 }}>
            <div>
              <span className="badge section-kicker">Update</span>
              <h2 className="section-title">Berita Terbaru</h2>
            </div>
            <Link href="/berita" className="btn btn-outline">
              Lihat Semua
            </Link>
          </div>
          <div className="grid grid-3">
            {latestNews.map((post) => (
              <article key={post.id} className="card table-card">
                {post.coverImageUrl ? (
                  <img
                    className="news-image"
                    src={post.coverImageUrl}
                    alt={post.title}
                  />
                ) : null}
                <div className="news-body">
                  <span className="badge">{post.category}</span>
                  <h3>
                    <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-muted">
                    {truncate(post.excerpt || post.content, 120)}
                  </p>
                  <Link
                    href={`/berita/${post.slug}`}
                    className="btn btn-sm btn-primary"
                  >
                    Baca
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {gallery.length ? (
        <section className="section section-soft">
          <div className="container">
            <div className="flex-between wrap" style={{ marginBottom: 28 }}>
              <div>
                <span className="badge section-kicker">Galeri</span>
                <h2 className="section-title">Dokumentasi Kegiatan</h2>
              </div>
              <Link href="/galeri" className="btn btn-outline">
                Lihat Galeri
              </Link>
            </div>
            <div className="grid grid-3">
              {gallery.map((item) => (
                <div key={item.id}>
                  <img
                    className="gallery-image"
                    src={item.imageUrl}
                    alt={item.title}
                  />
                  <h3>{item.title}</h3>
                  <p className="text-muted">{item.category}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </PublicLayout>
  );
}
