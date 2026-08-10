import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminResourceForm } from "@/components/AdminResourceForm";
import { getResourceConfig } from "@/lib/admin-config";
import { getDelegate, getFormOptionMap } from "@/lib/admin-data";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Params = Promise<{ resource: string; id: string }>;

export default async function ResourceEditPage({ params }: { params: Params }) {
  const { resource, id } = await params;
  const config = getResourceConfig(resource);
  if (!config) notFound();

  const delegate = getDelegate(config.model);
  const [record, options] = await Promise.all([
    delegate.findUnique({ where: { id: Number(id) } }),
    getFormOptionMap(config)
  ]);

  if (!record) notFound();

  return (
    <div className="grid gap-md">
      <div className="flex-between wrap">
        <div>
          <Link href={`/dashboard/${resource}`} className="btn btn-sm btn-outline">← Kembali</Link>
          <h2 className="section-title" style={{ marginTop: 16 }}>Edit {config.singular}</h2>
          <p className="section-desc">Perbarui data yang sudah ada.</p>
        </div>
      </div>
      <AdminResourceForm resource={resource} config={config} record={record} options={options} />
    </div>
  );
}
