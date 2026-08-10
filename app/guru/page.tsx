import { PublicLayout } from "@/components/PublicLayout";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function TeachersPage() {
  const teachers = await db.teacher.findMany({ where: { status: "active" }, orderBy: { fullName: "asc" } });

  return (
    <PublicLayout>
      <section className="section section-soft">
        <div className="container">
          <span className="badge section-kicker">Guru & Staff</span>
          <h1 className="section-title">Tenaga Pendidik</h1>
          <p className="section-desc">Daftar guru dan staff aktif di sekolah.</p>
        </div>
      </section>
      <section className="section">
        <div className="container grid grid-3">
          {teachers.map((teacher) => (
            <article key={teacher.id} className="card card-pad feature-card">
              <div className="icon-box">👩‍🏫</div>
              <h3>{teacher.fullName}</h3>
              <p className="text-muted">{teacher.position}</p>
              <p>{teacher.education || "Pendidikan belum diatur"}</p>
              <p className="text-muted mb-0">{teacher.email || "-"}</p>
            </article>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
