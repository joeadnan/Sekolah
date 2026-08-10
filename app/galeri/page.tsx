import { PublicLayout } from "@/components/PublicLayout";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function GalleryPage() {
  const gallery = await db.gallery.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <PublicLayout>
      <section className="section section-soft">
        <div className="container">
          <span className="badge section-kicker">Galeri</span>
          <h1 className="section-title">Galeri Sekolah</h1>
          <p className="section-desc">Dokumentasi kegiatan, fasilitas, dan prestasi sekolah.</p>
        </div>
      </section>
      <section className="section">
        <div className="container grid grid-3">
          {gallery.map((item) => (
            <article key={item.id} className="card card-pad">
              <img className="gallery-image" src={item.imageUrl} alt={item.title} />
              <span className="badge mt-md">{item.category}</span>
              <h3>{item.title}</h3>
              <p className="text-muted mb-0">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
