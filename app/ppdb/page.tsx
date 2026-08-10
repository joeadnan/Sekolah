import { PublicLayout } from "@/components/PublicLayout";
import { StatusAlert } from "@/components/StatusAlert";
import { submitAdmissionAction } from "@/app/actions";
import { genderOptions, religionOptions, uniformOptions } from "@/lib/admin-config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SearchParams = Promise<{ success?: string; error?: string }>;

export default async function AdmissionPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  return (
    <PublicLayout>
      <section className="section section-soft">
        <div className="container">
          <span className="badge section-kicker">PPDB Online</span>
          <h1 className="section-title">Form Pendaftaran Peserta Didik Baru</h1>
          <p className="section-desc">Lengkapi data calon siswa dengan benar. Data akan masuk ke dashboard admin dan dapat diunduh sebagai CSV.</p>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 920 }}>
          <StatusAlert
            success={params.success ? "Pendaftaran berhasil dikirim. Admin sekolah akan memproses data kamu." : undefined}
            error={params.error}
          />
          <form action={submitAdmissionAction} className="card form-card">
            <div className="form-grid">
              <Input name="fullName" label="Nama Lengkap" required />
              <Select name="uniform" label="Seragam" options={uniformOptions} required />
              <Select name="gender" label="Jenis Kelamin" options={genderOptions} required />
              <Select name="religion" label="Agama" options={religionOptions} required />
              <Input name="birthPlace" label="Tempat Lahir" required />
              <Input name="birthDate" label="Tanggal Lahir" type="date" required />
              <Input name="age" label="Umur" type="number" required />
              <Input name="familyCardNumber" label="No. KK" required />
              <Input name="nik" label="NIK" required />
              <Input name="heightCm" label="Tinggi Badan (cm)" type="number" />
              <Input name="weightKg" label="Berat Badan (kg)" type="number" />
              <Input name="motherName" label="Nama Ibu" required />
              <Input name="motherNik" label="NIK Ibu" required />
              <div className="form-group form-full">
                <label className="form-label" htmlFor="address">Alamat *</label>
                <textarea id="address" name="address" required />
              </div>
              <Input name="village" label="Desa/Kelurahan" required />
              <Input name="district" label="Kecamatan" required />
            </div>
            <div className="mt-md">
              <button className="btn btn-primary" type="submit">Kirim Pendaftaran</button>
            </div>
          </form>
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

function Select({ name, label, options, required = false }: { name: string; label: string; options: { value: string; label: string }[]; required?: boolean }) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={name}>{label}{required ? " *" : ""}</label>
      <select id={name} name={name} className="form-select" required={required} defaultValue="">
        <option value="" disabled>Pilih {label}</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </div>
  );
}
