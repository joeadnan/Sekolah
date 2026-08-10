import { PublicLayout } from "@/components/PublicLayout";
import { StatusAlert } from "@/components/StatusAlert";
import { submitContactAction } from "@/app/actions";
import { getSiteSetting } from "@/lib/site";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SearchParams = Promise<{ success?: string; error?: string }>;

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const [params, setting] = await Promise.all([searchParams, getSiteSetting()]);

  return (
    <PublicLayout>
      <section className="section section-soft">
        <div className="container">
          <span className="badge section-kicker">Kontak</span>
          <h1 className="section-title">Hubungi Sekolah</h1>
          <p className="section-desc">Kirim pertanyaan atau pesan melalui form kontak.</p>
        </div>
      </section>
      <section className="section">
        <div className="container grid grid-2">
          <div className="card card-pad">
            <h2>Informasi Kontak</h2>
            <p>📍 {setting.address || "Alamat belum diatur"}</p>
            <p>☎️ {setting.phone || "-"}</p>
            <p>💬 {setting.whatsapp || "-"}</p>
            <p>✉️ {setting.email || "-"}</p>
          </div>
          <div>
            <StatusAlert success={params.success ? "Pesan berhasil dikirim." : undefined} error={params.error} />
            <form action={submitContactAction} className="card form-card">
              <div className="form-grid">
                <Input name="name" label="Nama" required />
                <Input name="phone" label="No. HP" />
                <Input name="email" label="Email" type="email" />
                <Input name="subject" label="Subjek" required />
                <div className="form-group form-full">
                  <label className="form-label" htmlFor="message">Pesan *</label>
                  <textarea id="message" name="message" required />
                </div>
              </div>
              <div className="mt-md"><button className="btn btn-primary">Kirim Pesan</button></div>
            </form>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function Input({ name, label, type = "text", required = false }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={name}>{label}{required ? " *" : ""}</label>
      <input className="form-control" id={name} name={name} type={type} required={required} />
    </div>
  );
}
