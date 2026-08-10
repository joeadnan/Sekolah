import Link from "next/link";
import { PublicLayout } from "@/components/PublicLayout";
import { db } from "@/lib/db";
import { formatDate, truncate } from "@/lib/format";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SearchParams = Promise<{ q?: string }>;

export default async function NewsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const keyword = params.q?.trim() || "";
  const posts = await db.newsPost.findMany({
    where: {
      status: "published",
      ...(keyword ? { OR: [{ title: { contains: keyword } }, { excerpt: { contains: keyword } }, { content: { contains: keyword } }] } : {})
    },
    orderBy: { publishedAt: "desc" }
  });

  return (
    <PublicLayout>
      <section className="section section-soft">
        <div className="container">
          <span className="badge section-kicker">Berita</span>
          <h1 className="section-title">Berita & Artikel Sekolah</h1>
          <p className="section-desc">Update kegiatan, prestasi, dan informasi terbaru dari sekolah.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <form className="search-form" style={{ marginBottom: 28 }}>
            <input className="form-control" name="q" placeholder="Cari berita..." defaultValue={keyword} />
            <button className="btn btn-primary">Cari</button>
          </form>
          <div className="grid grid-3">
            {posts.map((post) => (
              <article key={post.id} className="card table-card">
                {post.coverImageUrl ? <img className="news-image" src={post.coverImageUrl} alt={post.title} /> : null}
                <div className="news-body">
                  <div className="flex-between wrap">
                    <span className="badge">{post.category}</span>
                    <small className="text-muted">{formatDate(post.publishedAt)}</small>
                  </div>
                  <h3><Link href={`/berita/${post.slug}`}>{post.title}</Link></h3>
                  <p className="text-muted">{truncate(post.excerpt || post.content, 140)}</p>
                  <Link href={`/berita/${post.slug}`} className="btn btn-sm btn-primary">Baca Selengkapnya</Link>
                </div>
              </article>
            ))}
          </div>
          {!posts.length ? <div className="empty-state">Berita belum tersedia.</div> : null}
        </div>
      </section>
    </PublicLayout>
  );
}
