import Link from "next/link";
import { saveResourceAction } from "@/app/actions";
import type { AdminOptionMap } from "@/lib/admin-data";
import type { ResourceConfig } from "@/lib/admin-config";
import { formatDateInput, formatDateTimeInput } from "@/lib/format";

type Props = {
  resource: string;
  config: ResourceConfig;
  record?: Record<string, unknown> | null;
  options: AdminOptionMap;
};

function getValue(record: Record<string, unknown> | null | undefined, fieldName: string) {
  if (!record) return "";
  const value = record[fieldName];
  if (value === null || value === undefined) return "";
  return value;
}

export function AdminResourceForm({ resource, config, record, options }: Props) {
  const id = typeof record?.id === "number" ? record.id : null;

  return (
    <form action={saveResourceAction.bind(null, resource, id)} className="card form-card">
      <div className="form-grid">
        {config.formFields.map((field) => {
          const rawValue = getValue(record, field.name);
          const common = {
            id: field.name,
            name: field.name,
            required: field.required,
            placeholder: field.placeholder,
            className: "form-control"
          };

          if (field.type === "textarea") {
            return (
              <div key={field.name} className="form-group form-full">
                <label className="form-label" htmlFor={field.name}>{field.label}{field.required ? " *" : ""}</label>
                <textarea {...common} defaultValue={String(rawValue ?? "")} />
                {field.help ? <span className="field-help">{field.help}</span> : null}
              </div>
            );
          }

          if (field.type === "select") {
            const fieldOptions = options[field.name] ?? field.options ?? [];
            return (
              <div key={field.name} className="form-group">
                <label className="form-label" htmlFor={field.name}>{field.label}{field.required ? " *" : ""}</label>
                <select id={field.name} name={field.name} className="form-select" required={field.required} defaultValue={String(rawValue ?? "")}>
                  <option value="" disabled={field.required}>- Pilih -</option>
                  {fieldOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {field.help ? <span className="field-help">{field.help}</span> : null}
              </div>
            );
          }

          if (field.type === "boolean") {
            return (
              <div key={field.name} className="form-group checkbox-row">
                <input id={field.name} name={field.name} type="checkbox" defaultChecked={record ? Boolean(rawValue) : field.name === "isActive"} />
                <label className="form-label" htmlFor={field.name}>{field.label}</label>
              </div>
            );
          }

          const inputType = field.type === "datetime" ? "datetime-local" : field.type;
          const value = field.type === "date" ? formatDateInput(rawValue as Date | string | null) : field.type === "datetime" ? formatDateTimeInput(rawValue as Date | string | null) : String(rawValue ?? "");

          return (
            <div key={field.name} className="form-group">
              <label className="form-label" htmlFor={field.name}>{field.label}{field.required ? " *" : ""}</label>
              <input {...common} type={inputType} defaultValue={value} />
              {field.help ? <span className="field-help">{field.help}</span> : null}
            </div>
          );
        })}
      </div>

      <div className="flex-between wrap mt-md">
        <Link href={`/dashboard/${resource}`} className="btn btn-outline">Kembali</Link>
        <button type="submit" className="btn btn-primary">Simpan {config.singular}</button>
      </div>
    </form>
  );
}
