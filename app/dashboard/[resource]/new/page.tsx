import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminResourceForm } from "@/components/AdminResourceForm";
import { getResourceConfig } from "@/lib/admin-config";
import { getFormOptionMap } from "@/lib/admin-data";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Params = Promise<{ resource: string }>;

export default async function ResourceCreatePage({ params }: { params: Params }) {
  const { resource } = await params;
  const config = getResourceConfig(resource);
  if (!config) notFound();
  const options = await getFormOptionMap(config);

  return (
    <div className="grid gap-md">
      <div className="flex-between wrap">
        <div>
          <Link href={`/dashboard/${resource}`} className="btn btn-sm btn-outline">← Kembali</Link>
          <h2 className="section-title" style={{ marginTop: 16 }}>Tambah {config.singular}</h2>
          <p className="section-desc">Isi form untuk menambahkan data baru.</p>
        </div>
      </div>
      <AdminResourceForm resource={resource} config={config} options={options} />
    </div>
  );
}
