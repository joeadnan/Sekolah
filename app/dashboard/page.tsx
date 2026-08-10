import Link from "next/link";
import { db } from "@/lib/db";
import { resources } from "@/lib/admin-config";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function DashboardPage() {
  const [students, teachers, classes, subjects, admissions, messages, news, latestAdmissions] = await Promise.all([
    db.student.count(),
    db.teacher.count(),
    db.classRoom.count(),
    db.subject.count(),
    db.admissionApplication.count(),
    db.contactMessage.count({ where: { status: "new" } }),
    db.newsPost.count(),
    db.admissionApplication.findMany({ orderBy: { createdAt: "desc" }, take: 5 })
  ]);

  const kpis = [
    ["Siswa", students, "👥", "/dashboard/students"],
    ["Guru", teachers, "👩‍🏫", "/dashboard/teachers"],
    ["Kelas", classes, "🏫", "/dashboard/classes"],
    ["Mapel", subjects, "📚", "/dashboard/subjects"],
    ["PPDB", admissions, "📝", "/dashboard/admissions"],
    ["Pesan Baru", messages, "✉️", "/dashboard/messages"],
    ["Berita", news, "📰", "/dashboard/news"]
  ] as const;

  return (
    <div className="grid gap-md">
      <div className="flex-between wrap">
        <div>
          <h2 className="section-title">Ringkasan Dashboard</h2>
          <p className="section-desc">Pantau data website, akademik, PPDB, dan pesan kontak.</p>
        </div>
        <Link href="/dashboard/admissions/export/csv" className="btn btn-success">Download PPDB CSV</Link>
      </div>

      <div className="dashboard-grid">
        {kpis.map(([label, value, icon, href]) => (
          <Link href={href} key={label} className="card kpi-card">
            <div className="flex-between">
              <span className="kpi-label">{label}</span>
              <span>{icon}</span>
            </div>
            <div className="kpi-value">{value}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-2">
        <div className="card table-card">
          <div className="table-toolbar">
            <h3 className="mt-0">Pendaftaran PPDB Terbaru</h3>
          </div>
          <div className="table-responsive">
            <table>
              <thead><tr><th>Nama</th><th>NIK</th><th>Status</th><th>Tanggal</th></tr></thead>
              <tbody>
                {latestAdmissions.map((item) => (
                  <tr key={item.id}>
                    <td>{item.fullName}</td>
                    <td>{item.nik}</td>
                    <td>{item.status}</td>
                    <td>{formatDate(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card card-pad">
          <h3 className="mt-0">Menu Cepat</h3>
          <div className="grid gap-sm">
            {resources.filter((item) => ["students", "teachers", "news", "admissions", "messages", "settings"].includes(item.resource)).map((item) => (
              <Link key={item.resource} className="btn btn-outline" href={`/dashboard/${item.resource}`}>{item.icon} Kelola {item.title}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
