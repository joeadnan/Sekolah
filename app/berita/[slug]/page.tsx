import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicLayout } from "@/components/PublicLayout";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const post = await db.newsPost.findUnique({
    where: {
      slug,
    },
  });

  if (!post || post.status !== "published") {
    notFound();
  }

  const paragraphs = String(post.content || "")
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <PublicLayout>
      <section className="section section-soft">
        <div className="container" style={{ maxWidth: 860 }}>
          <Link href="/berita" className="btn btn-sm btn-outline">
            ← Kembali ke Berita
          </Link>

          <div style={{ marginTop: 24 }}>
            <span className="badge">{post.category}</span>

            <h1 className="section-title" style={{ marginTop: 18 }}>
              {post.title}
            </h1>

            <p className="section-desc">
              Dipublikasikan pada {formatDate(post.publishedAt)}
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          {post.coverImageUrl ? (
            <img
              className="gallery-image"
              style={{ height: 420, width: "100%" }}
              src={post.coverImageUrl}
              alt={post.title}
            />
          ) : null}

          <article className="card card-pad" style={{ marginTop: 24 }}>
            {paragraphs.map((paragraph, index) => (
              <p
                key={`${post.slug}-paragraph-${index}`}
                className="section-desc"
              >
                {paragraph}
              </p>
            ))}
          </article>
        </div>
      </section>
    </PublicLayout>
  );
}
