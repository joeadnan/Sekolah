import { PublicLayout } from "@/components/PublicLayout";
import { db } from "@/lib/db";
import { truncate } from "@/lib/format";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AcademicsPage() {
  const [classes, subjects, facilities, extracurriculars, downloads] =
    await Promise.all([
      db.classRoom.findMany({
        include: { homeroomTeacher: true },
        orderBy: { gradeLevel: "asc" },
      }),
      db.subject.findMany({
        include: { teacher: true },
        orderBy: { name: "asc" },
      }),
      db.facility.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      }),
      db.extracurricular.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      }),
      db.download.findMany({
        where: { isActive: true },
        orderBy: { title: "asc" },
      }),
    ]);

  return (
    <PublicLayout>
      <section className="section section-soft">
        <div className="container">
          <span className="badge section-kicker">Akademik</span>
          <h1 className="section-title">Informasi Akademik</h1>
          <p className="section-desc">
            Kelas, mata pelajaran, fasilitas, ekstrakurikuler, dan dokumen
            sekolah.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Daftar Kelas</h2>
          <div className="grid grid-3 mt-md">
            {classes.map((item: any) => (
              <div className="card card-pad" key={item.id}>
                <span className="badge">Tingkat {item.gradeLevel}</span>
                <h3>{item.name}</h3>
                <p className="text-muted">Tahun Ajaran: {item.academicYear}</p>
                <p className="text-muted">Kapasitas: {item.capacity} siswa</p>
                <p className="mb-0">
                  Wali Kelas: {item.homeroomTeacher?.fullName || "-"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <h2 className="section-title">Mata Pelajaran</h2>
          <div className="grid grid-3 mt-md">
            {subjects.map((item: any) => (
              <div className="card card-pad" key={item.id}>
                <span className="badge">{item.code}</span>
                <h3>{item.name}</h3>
                <p className="text-muted">{truncate(item.description, 130)}</p>
                <p className="mb-0">Guru: {item.teacher?.fullName || "-"}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2">
          <div>
            <h2 className="section-title">Fasilitas</h2>
            <div className="grid mt-md">
              {facilities.map((item: any) => (
                <div className="card card-pad" key={item.id}>
                  <h3>{item.name}</h3>
                  <p className="text-muted mb-0">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="section-title">Ekstrakurikuler</h2>
            <div className="grid mt-md">
              {extracurriculars.map((item: any) => (
                <div className="card card-pad" key={item.id}>
                  <h3>{item.name}</h3>
                  <p className="text-muted">
                    Pembina: {item.coach || "-"} •{" "}
                    {item.schedule || "Jadwal belum diatur"}
                  </p>
                  <p className="mb-0">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {downloads.length ? (
        <section className="section section-soft">
          <div className="container">
            <h2 className="section-title">Download Dokumen</h2>
            <div className="grid grid-3 mt-md">
              {downloads.map((item: any) => (
                <a
                  key={item.id}
                  className="card card-pad"
                  href={item.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="badge">{item.category || "Dokumen"}</span>
                  <h3>{item.title}</h3>
                  <p className="text-muted mb-0">{item.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </PublicLayout>
  );
}
