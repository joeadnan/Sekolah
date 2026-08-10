import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteResourceAction } from "@/app/actions";
import { getChoiceLabel, getResourceConfig } from "@/lib/admin-config";
import { getDelegate } from "@/lib/admin-data";
import { formatDate, getNestedValue, truncate } from "@/lib/format";
import type { ResourceConfig, TableField } from "@/lib/admin-config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Params = Promise<{ resource: string }>;
type SearchParams = Promise<{ q?: string; page?: string; saved?: string; deleted?: string; error?: string }>;

const PAGE_SIZE = 10;

function buildWhere(config: ResourceConfig, keyword: string) {
  if (!keyword || !config.searchableFields.length) return undefined;
  return {
    OR: config.searchableFields.map((field) => ({ [field]: { contains: keyword } }))
  };
}

function displayValue(record: Record<string, unknown>, field: TableField) {
  const value = getNestedValue(record, field.name);
  if (value === null || value === undefined || value === "") return "-";
  if (field.type === "date") return formatDate(value as Date | string);
  if (field.type === "datetime") return formatDate(value as Date | string);
  if (field.type === "boolean") return value ? "Ya" : "Tidak";
  if (field.type === "choice") return getChoiceLabel(field.choices, value);
  if (typeof value === "string" && value.length > 90) return truncate(value, 90);
  return String(value);
}

export default async function ResourceListPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const [{ resource }, search] = await Promise.all([params, searchParams]);
  const config = getResourceConfig(resource);
  if (!config) notFound();

  const keyword = search.q?.trim() || "";
  const page = Math.max(Number(search.page || 1), 1);
  const where = buildWhere(config, keyword);
  const delegate = getDelegate(config.model);
  const [records, total] = await Promise.all([
    delegate.findMany({
      where,
      include: config.include,
      orderBy: config.orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE
    }),
    delegate.count({ where })
  ]);

  const pages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  return (
    <div className="grid gap-md">
      <div className="card card-pad">
        <div className="flex-between wrap">
          <div>
            <span className="badge">{config.icon} {config.singular}</span>
            <h2 className="section-title" style={{ marginTop: 12 }}>{config.title}</h2>
            <p className="section-desc">{config.description}</p>
          </div>
          <div className="flex-center wrap">
            {resource === "admissions" ? <Link href="/dashboard/admissions/export/csv" className="btn btn-success">Download CSV</Link> : null}
            <Link href={`/dashboard/${resource}/new`} className="btn btn-primary">Tambah {config.singular}</Link>
          </div>
        </div>
      </div>

      {search.saved ? <div className="alert alert-success">Data berhasil disimpan.</div> : null}
      {search.deleted ? <div className="alert alert-success">Data berhasil dihapus.</div> : null}
      {search.error ? <div className="alert alert-danger">{decodeURIComponent(search.error)}</div> : null}

      <div className="card table-card">
        <div className="table-toolbar">
          <form className="search-form">
            <input className="form-control" name="q" defaultValue={keyword} placeholder={`Cari ${config.title.toLowerCase()}...`} />
            <button className="btn btn-primary" type="submit">Cari</button>
          </form>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                {config.tableFields.map((field) => <th key={field.name}>{field.label}</th>)}
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={String(record.id)}>
                  {config.tableFields.map((field) => <td key={field.name}>{displayValue(record, field)}</td>)}
                  <td className="action-cell">
                    <div className="flex-center" style={{ justifyContent: "flex-end" }}>
                      <Link href={`/dashboard/${resource}/${record.id}/edit`} className="btn btn-sm btn-outline">Edit</Link>
                      <form action={deleteResourceAction.bind(null, resource, Number(record.id))}>
                        <button className="btn btn-sm btn-danger" type="submit">Hapus</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!records.length ? <div className="empty-state">Data belum tersedia.</div> : null}
        <div className="pagination">
          {page > 1 ? <Link className="btn btn-sm btn-outline" href={`/dashboard/${resource}?page=${page - 1}&q=${encodeURIComponent(keyword)}`}>Sebelumnya</Link> : null}
          <span>Halaman {page} / {pages}</span>
          {page < pages ? <Link className="btn btn-sm btn-outline" href={`/dashboard/${resource}?page=${page + 1}&q=${encodeURIComponent(keyword)}`}>Berikutnya</Link> : null}
        </div>
      </div>
    </div>
  );
}
