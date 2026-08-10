import { db } from "@/lib/db";
import type { FieldConfig, ResourceConfig } from "@/lib/admin-config";

export type AdminOptionMap = Record<string, { value: string; label: string }[]>;

export async function getRelationOptions(field: FieldConfig) {
  if (!field.relation) return field.options ?? [];

  if (field.relation === "teacher") {
    const rows = await db.teacher.findMany({ orderBy: { fullName: "asc" }, select: { id: true, fullName: true, nip: true } });
    return rows.map((row) => ({ value: String(row.id), label: `${row.fullName} (${row.nip})` }));
  }

  if (field.relation === "classRoom") {
    const rows = await db.classRoom.findMany({ orderBy: { gradeLevel: "asc" }, select: { id: true, name: true, academicYear: true } });
    return rows.map((row) => ({ value: String(row.id), label: `${row.name} - ${row.academicYear}` }));
  }

  if (field.relation === "student") {
    const rows = await db.student.findMany({ orderBy: { fullName: "asc" }, select: { id: true, fullName: true, nisn: true } });
    return rows.map((row) => ({ value: String(row.id), label: `${row.fullName} (${row.nisn})` }));
  }

  if (field.relation === "subject") {
    const rows = await db.subject.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, code: true } });
    return rows.map((row) => ({ value: String(row.id), label: `${row.name} (${row.code})` }));
  }

  return [];
}

export async function getFormOptionMap(config: ResourceConfig): Promise<AdminOptionMap> {
  const entries = await Promise.all(
    config.formFields.map(async (field) => {
      if (field.type !== "select") return [field.name, []] as const;
      return [field.name, await getRelationOptions(field)] as const;
    })
  );

  return Object.fromEntries(entries);
}

export function getDelegate(modelName: string) {
  return (db as unknown as Record<string, unknown>)[modelName] as {
    findMany: (args?: Record<string, unknown>) => Promise<Record<string, unknown>[]>;
    findUnique: (args: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
    findFirst: (args?: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
    count: (args?: Record<string, unknown>) => Promise<number>;
    create: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
    update: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
    delete: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
  };
}
