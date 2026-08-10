import { PublicLayout } from "@/components/PublicLayout";
import { getPublicStats, getSiteSetting } from "@/lib/site";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function ProfilePage() {
  const [setting, stats] = await Promise.all([
    getSiteSetting(),
    getPublicStats(),
  ]);

  const missions: string[] = String(setting.mission || "")
    .split("\n")
    .map((mission: string) => mission.trim())
    .filter(Boolean);

  return (
    <PublicLayout>
      <section className="section section-soft">
        <div className="container grid grid-2" style={{ alignItems: "center" }}>
          <div>
            <span className="badge section-kicker">Profil Sekolah</span>

            <h1 className="section-title">{setting.schoolName}</h1>

            <p className="section-desc">
              {setting.about || "Profil sekolah belum diatur."}
            </p>
          </div>

          <div className="card card-pad">
            <div className="grid grid-2 text-center">
              <div>
                <div className="stat-number">{stats.students}</div>
                <p className="text-muted">Siswa</p>
              </div>

              <div>
                <div className="stat-number">{stats.teachers}</div>
                <p className="text-muted">Guru</p>
              </div>

              <div>
                <div className="stat-number">{stats.classes}</div>
                <p className="text-muted">Kelas</p>
              </div>

              <div>
                <div className="stat-number">
                  {setting.establishedYear || "-"}
                </div>
                <p className="text-muted">Berdiri</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2">
          <div className="card card-pad">
            <span className="badge">Visi</span>

            <h2>Visi Sekolah</h2>

            <p className="text-muted">
              {setting.vision || "Visi sekolah belum diatur."}
            </p>
          </div>

          <div className="card card-pad">
            <span className="badge">Misi</span>

            <h2>Misi Sekolah</h2>

            {missions.length ? (
              <ul>
                {missions.map((mission: string, index: number) => (
                  <li key={`mission-${index}`}>{mission}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">Misi sekolah belum diatur.</p>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
