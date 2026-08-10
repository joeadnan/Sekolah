import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { createClient } from "@libsql/client";

type SortOrder = "asc" | "desc";
type Primitive = string | number | boolean | Date | null;
type Row = Record<string, any>;
type WhereInput = Record<string, unknown> | undefined;
type OrderByInput = Record<string, SortOrder> | undefined;
type SelectInput = Record<string, boolean> | undefined;
type IncludeInput = Record<string, boolean> | undefined;

type FindManyArgs = {
  where?: WhereInput;
  orderBy?: OrderByInput;
  skip?: number;
  take?: number;
  select?: SelectInput;
  include?: IncludeInput;
};

type FindOneArgs = {
  where: WhereInput;
  select?: SelectInput;
  include?: IncludeInput;
};

type CreateArgs = {
  data: Row;
  select?: SelectInput;
  include?: IncludeInput;
};

type UpdateArgs = {
  where: WhereInput;
  data: Row;
  select?: SelectInput;
  include?: IncludeInput;
};

type DeleteArgs = {
  where: WhereInput;
};

type UpsertArgs = {
  where: WhereInput;
  update: Row;
  create: Row;
  select?: SelectInput;
  include?: IncludeInput;
};

export type DbDelegate = {
  findMany: (args?: FindManyArgs) => Promise<Row[]>;
  findUnique: (args: FindOneArgs) => Promise<Row | null>;
  findFirst: (args?: FindManyArgs) => Promise<Row | null>;
  count: (args?: { where?: WhereInput }) => Promise<number>;
  create: (args: CreateArgs) => Promise<Row>;
  update: (args: UpdateArgs) => Promise<Row>;
  delete: (args: DeleteArgs) => Promise<Row>;
  upsert: (args: UpsertArgs) => Promise<Row>;
};

type RelationMeta = {
  model: string;
  localKey: string;
};

type ModelMeta = {
  table: string;
  columns: readonly string[];
  booleanFields?: readonly string[];
  relations?: Record<string, RelationMeta>;
};

const timestampColumns = ["createdAt", "updatedAt"] as const;

const modelMap = {
  siteSetting: {
    table: "SiteSetting",
    columns: [
      "id",
      "schoolName",
      "tagline",
      "logoText",
      "about",
      "vision",
      "mission",
      "address",
      "phone",
      "whatsapp",
      "email",
      "principalName",
      "establishedYear",
      "instagramUrl",
      "facebookUrl",
      "youtubeUrl",
      ...timestampColumns,
    ],
  },
  teacher: {
    table: "Teacher",
    columns: [
      "id",
      "nip",
      "fullName",
      "position",
      "education",
      "email",
      "phone",
      "address",
      "photoUrl",
      "joinDate",
      "status",
      ...timestampColumns,
    ],
  },
  classRoom: {
    table: "ClassRoom",
    columns: [
      "id",
      "name",
      "gradeLevel",
      "academicYear",
      "capacity",
      "homeroomTeacherId",
      ...timestampColumns,
    ],
    relations: {
      homeroomTeacher: { model: "teacher", localKey: "homeroomTeacherId" },
    },
  },
  subject: {
    table: "Subject",
    columns: ["id", "code", "name", "description", "teacherId", ...timestampColumns],
    relations: {
      teacher: { model: "teacher", localKey: "teacherId" },
    },
  },
  student: {
    table: "Student",
    columns: [
      "id",
      "nisn",
      "fullName",
      "gender",
      "birthPlace",
      "birthDate",
      "email",
      "phone",
      "address",
      "classRoomId",
      "guardianName",
      "guardianPhone",
      "status",
      ...timestampColumns,
    ],
    relations: {
      classRoom: { model: "classRoom", localKey: "classRoomId" },
    },
  },
  attendance: {
    table: "Attendance",
    columns: ["id", "studentId", "date", "status", "note", ...timestampColumns],
    relations: {
      student: { model: "student", localKey: "studentId" },
    },
  },
  grade: {
    table: "Grade",
    columns: ["id", "studentId", "subjectId", "semester", "score", "note", ...timestampColumns],
    relations: {
      student: { model: "student", localKey: "studentId" },
      subject: { model: "subject", localKey: "subjectId" },
    },
  },
  announcement: {
    table: "Announcement",
    columns: ["id", "title", "content", "startDate", "endDate", "priority", "isActive", ...timestampColumns],
    booleanFields: ["isActive"],
  },
  event: {
    table: "Event",
    columns: ["id", "title", "location", "startDate", "endDate", "description", "isActive", ...timestampColumns],
    booleanFields: ["isActive"],
  },
  newsPost: {
    table: "NewsPost",
    columns: [
      "id",
      "title",
      "slug",
      "category",
      "excerpt",
      "content",
      "coverImageUrl",
      "status",
      "publishedAt",
      ...timestampColumns,
    ],
  },
  facility: {
    table: "Facility",
    columns: ["id", "name", "iconClass", "description", "imageUrl", "isActive", ...timestampColumns],
    booleanFields: ["isActive"],
  },
  extracurricular: {
    table: "Extracurricular",
    columns: ["id", "name", "coach", "schedule", "description", "isActive", ...timestampColumns],
    booleanFields: ["isActive"],
  },
  gallery: {
    table: "Gallery",
    columns: ["id", "title", "category", "imageUrl", "description", "isFeatured", ...timestampColumns],
    booleanFields: ["isFeatured"],
  },
  download: {
    table: "Download",
    columns: ["id", "title", "category", "description", "fileUrl", "isActive", ...timestampColumns],
    booleanFields: ["isActive"],
  },
  admissionApplication: {
    table: "AdmissionApplication",
    columns: [
      "id",
      "fullName",
      "uniform",
      "gender",
      "religion",
      "birthPlace",
      "birthDate",
      "age",
      "familyCardNumber",
      "nik",
      "heightCm",
      "weightKg",
      "motherName",
      "motherNik",
      "address",
      "village",
      "district",
      "status",
      "note",
      ...timestampColumns,
    ],
  },
  contactMessage: {
    table: "ContactMessage",
    columns: ["id", "name", "email", "phone", "subject", "message", "status", ...timestampColumns],
  },
} as const satisfies Record<string, ModelMeta>;

type ModelName = keyof typeof modelMap;
type Client = ReturnType<typeof createClient>;

let clientInstance: Client | undefined;
let envLoaded = false;

function loadLocalEnvFile(fileName: string) {
  const envPath = join(process.cwd(), fileName);

  if (!existsSync(envPath)) return;

  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...rest] = trimmed.split("=");

    if (process.env[key]) continue;

    const value = rest
      .join("=")
      .trim()
      .replace(/^[\'"]|[\'"]$/g, "");

    process.env[key] = value;
  }
}

function loadLocalEnv() {
  if (envLoaded) return;
  envLoaded = true;

  if (process.env.VERCEL) return;

  loadLocalEnvFile(".env.local");
  loadLocalEnvFile(".env");
}

function getDatabaseConfig() {
  loadLocalEnv();

  const databaseUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!databaseUrl) {
    throw new Error(
      "TURSO_DATABASE_URL belum diisi. Tambahkan di .env.local untuk lokal dan di Vercel Environment Variables untuk production.",
    );
  }

  if (!databaseUrl.startsWith("libsql://") && !databaseUrl.startsWith("https://")) {
    throw new Error(
      "TURSO_DATABASE_URL harus memakai URL Turso, contoh: libsql://nama-database-nama-org.turso.io",
    );
  }

  if (!authToken) {
    throw new Error(
      "TURSO_AUTH_TOKEN belum diisi. Tambahkan di .env.local untuk lokal dan di Vercel Environment Variables untuk production.",
    );
  }

  return { databaseUrl, authToken };
}

export function getClient() {
  if (!clientInstance) {
    const { databaseUrl, authToken } = getDatabaseConfig();
    clientInstance = createClient({ url: databaseUrl, authToken });
  }

  return clientInstance;
}

export async function closeDb() {
  if (!clientInstance) return;

  const close = (clientInstance as unknown as { close?: () => void | Promise<void> }).close;

  if (typeof close === "function") {
    await close.call(clientInstance);
  }

  clientInstance = undefined;
}

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function toSqlValue(value: unknown): Primitive {
  if (value === undefined) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "boolean") return value ? 1 : 0;
  if (value === null || typeof value === "string" || typeof value === "number") return value;
  return String(value);
}

function normalizeBooleanValue(value: unknown): boolean | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "bigint") return value === BigInt(1);
  return value === "1" || value === "true";
}

function normalizeRow(meta: ModelMeta, row: Row): Row {
  const normalized: Row = { ...row };

  for (const field of meta.booleanFields ?? []) {
    if (field in normalized) {
      normalized[field] = normalizeBooleanValue(normalized[field]);
    }
  }

  return normalized;
}

function getMeta(modelName: string): ModelMeta {
  const meta = (modelMap as Record<string, ModelMeta>)[modelName];

  if (!meta) throw new Error(`Model ${modelName} tidak tersedia di database layer.`);

  return meta;
}

function buildSingleCondition(meta: ModelMeta, field: string, value: unknown, args: Primitive[]): string | null {
  if (!meta.columns.includes(field)) return null;

  const column = quoteIdentifier(field);

  if (value && typeof value === "object" && !(value instanceof Date)) {
    const objectValue = value as Record<string, unknown>;

    if ("contains" in objectValue) {
      args.push(`%${String(objectValue.contains ?? "")}%`);
      return `${column} LIKE ?`;
    }
  }

  if (value === null) return `${column} IS NULL`;

  args.push(toSqlValue(value));
  return `${column} = ?`;
}

function buildWhereClause(meta: ModelMeta, where: WhereInput, args: Primitive[]): string {
  if (!where || !Object.keys(where).length) return "";

  const clauses: string[] = [];

  for (const [field, value] of Object.entries(where)) {
    if (field === "OR" && Array.isArray(value)) {
      const orClauses = value
        .map((item) => buildWhereClause(meta, item as WhereInput, args).replace(/^ WHERE /, ""))
        .filter(Boolean);

      if (orClauses.length) clauses.push(`(${orClauses.join(" OR ")})`);
      continue;
    }

    if (value && typeof value === "object" && !(value instanceof Date) && !meta.columns.includes(field)) {
      const compound = value as Record<string, unknown>;
      const subClauses = Object.entries(compound)
        .map(([compoundField, compoundValue]) => buildSingleCondition(meta, compoundField, compoundValue, args))
        .filter((clause): clause is string => Boolean(clause));

      if (subClauses.length) clauses.push(`(${subClauses.join(" AND ")})`);
      continue;
    }

    const clause = buildSingleCondition(meta, field, value, args);
    if (clause) clauses.push(clause);
  }

  return clauses.length ? ` WHERE ${clauses.join(" AND ")}` : "";
}

function buildOrderByClause(meta: ModelMeta, orderBy: OrderByInput) {
  if (!orderBy) return "";

  const [field, order] = Object.entries(orderBy)[0] ?? [];
  if (!field || !meta.columns.includes(field)) return "";

  const direction = String(order).toLowerCase() === "desc" ? "DESC" : "ASC";
  return ` ORDER BY ${quoteIdentifier(field)} ${direction}`;
}

function getSelectedColumns(meta: ModelMeta, select?: SelectInput) {
  if (!select) return "*";

  const selected = Object.entries(select)
    .filter(([, enabled]) => enabled)
    .map(([field]) => field)
    .filter((field) => meta.columns.includes(field));

  return selected.length ? selected.map(quoteIdentifier).join(", ") : "*";
}

async function execute(sql: string, args: Primitive[] = []) {
  return getClient().execute({ sql, args });
}

export async function executeSql(sql: string, args: Primitive[] = []) {
  return execute(sql, args);
}

async function findByModelName(modelName: ModelName, args?: FindManyArgs): Promise<Row[]> {
  const meta = getMeta(modelName);
  const sqlArgs: Primitive[] = [];
  const columns = getSelectedColumns(meta, args?.select);
  const whereClause = buildWhereClause(meta, args?.where, sqlArgs);
  const orderByClause = buildOrderByClause(meta, args?.orderBy);
  const limitClause = typeof args?.take === "number" ? " LIMIT ?" : "";
  const offsetClause = typeof args?.skip === "number" ? " OFFSET ?" : "";

  if (typeof args?.take === "number") sqlArgs.push(args.take);
  if (typeof args?.skip === "number") sqlArgs.push(args.skip);

  const result = await execute(
    `SELECT ${columns} FROM ${quoteIdentifier(meta.table)}${whereClause}${orderByClause}${limitClause}${offsetClause}`,
    sqlArgs,
  );

  const rows: Row[] = (result.rows as Row[]).map((row: Row) => normalizeRow(meta, row));

  if (args?.include) {
    const include = args.include;
    return Promise.all(rows.map((row: Row) => applyIncludes(modelName, row, include)));
  }

  return rows;
}

async function applyIncludes(modelName: ModelName, row: Row, include: IncludeInput): Promise<Row> {
  const meta = getMeta(modelName);
  const relations = meta.relations ?? {};
  const output: Row = { ...row };

  for (const [relationName, enabled] of Object.entries(include ?? {})) {
    if (!enabled) continue;

    const relation = relations[relationName];
    if (!relation) continue;

    const localValue = output[relation.localKey];
    output[relationName] = localValue
      ? await getDelegate(relation.model as ModelName).findUnique({ where: { id: Number(localValue) } })
      : null;
  }

  return output;
}

function prepareInsertData(meta: ModelMeta, data: Row): Row {
  const prepared: Row = {};
  const now = new Date().toISOString();

  for (const [field, value] of Object.entries(data)) {
    if (meta.columns.includes(field) && value !== undefined) prepared[field] = value;
  }

  if (meta.columns.includes("createdAt") && prepared.createdAt === undefined) prepared.createdAt = now;
  if (meta.columns.includes("updatedAt") && prepared.updatedAt === undefined) prepared.updatedAt = now;

  return prepared;
}

function prepareUpdateData(meta: ModelMeta, data: Row): Row {
  const prepared: Row = {};

  for (const [field, value] of Object.entries(data)) {
    if (field === "id") continue;
    if (meta.columns.includes(field) && value !== undefined) prepared[field] = value;
  }

  if (meta.columns.includes("updatedAt")) prepared.updatedAt = new Date().toISOString();

  return prepared;
}

function getDelegate(modelName: ModelName): DbDelegate {
  const meta = getMeta(modelName);

  return {
    async findMany(args?: FindManyArgs) {
      return findByModelName(modelName, args);
    },

    async findUnique(args: FindOneArgs) {
      const rows = await findByModelName(modelName, { ...args, take: 1 });
      return rows[0] ?? null;
    },

    async findFirst(args?: FindManyArgs) {
      const rows = await findByModelName(modelName, { ...args, take: 1 });
      return rows[0] ?? null;
    },

    async count(args?: { where?: WhereInput }) {
      const sqlArgs: Primitive[] = [];
      const whereClause = buildWhereClause(meta, args?.where, sqlArgs);
      const result = await execute(
        `SELECT COUNT(*) AS count FROM ${quoteIdentifier(meta.table)}${whereClause}`,
        sqlArgs,
      );

      return Number((result.rows[0] as Row | undefined)?.count ?? 0);
    },

    async create(args: CreateArgs) {
      const data = prepareInsertData(meta, args.data);
      const fields = Object.keys(data).filter((field) => meta.columns.includes(field));
      const placeholders = fields.map(() => "?").join(", ");
      const values = fields.map((field) => toSqlValue(data[field]));

      const result = await execute(
        `INSERT INTO ${quoteIdentifier(meta.table)} (${fields.map(quoteIdentifier).join(", ")}) VALUES (${placeholders})`,
        values,
      );

      const insertedId = Number(result.lastInsertRowid ?? data.id);
      const row = await this.findUnique({ where: { id: insertedId }, select: args.select, include: args.include });

      if (!row) throw new Error(`Gagal membuat data ${meta.table}.`);

      return row;
    },

    async update(args: UpdateArgs) {
      const data = prepareUpdateData(meta, args.data);
      const fields = Object.keys(data).filter((field) => meta.columns.includes(field));

      if (!fields.length) {
        const existing = await this.findUnique({ where: args.where, select: args.select, include: args.include });
        if (!existing) throw new Error(`Data ${meta.table} tidak ditemukan.`);
        return existing;
      }

      const values = fields.map((field) => toSqlValue(data[field]));
      const whereArgs: Primitive[] = [];
      const whereClause = buildWhereClause(meta, args.where, whereArgs);

      if (!whereClause) throw new Error("WHERE clause wajib untuk update.");

      await execute(
        `UPDATE ${quoteIdentifier(meta.table)} SET ${fields
          .map((field) => `${quoteIdentifier(field)} = ?`)
          .join(", ")}${whereClause}`,
        [...values, ...whereArgs],
      );

      const row = await this.findUnique({ where: args.where, select: args.select, include: args.include });

      if (!row) throw new Error(`Data ${meta.table} tidak ditemukan setelah update.`);

      return row;
    },

    async delete(args: DeleteArgs) {
      const existing = await this.findUnique({ where: args.where });
      if (!existing) throw new Error(`Data ${meta.table} tidak ditemukan.`);

      const whereArgs: Primitive[] = [];
      const whereClause = buildWhereClause(meta, args.where, whereArgs);

      if (!whereClause) throw new Error("WHERE clause wajib untuk delete.");

      await execute(`DELETE FROM ${quoteIdentifier(meta.table)}${whereClause}`, whereArgs);
      return existing;
    },

    async upsert(args: UpsertArgs) {
      const existing = await this.findUnique({ where: args.where, select: args.select, include: args.include });

      if (existing) {
        if (Object.keys(args.update).length) {
          return this.update({ where: args.where, data: args.update, select: args.select, include: args.include });
        }

        return existing;
      }

      return this.create({ data: { ...args.where, ...args.create }, select: args.select, include: args.include });
    },
  };
}

export const db = Object.fromEntries(
  Object.keys(modelMap).map((modelName) => [modelName, getDelegate(modelName as ModelName)]),
) as Record<ModelName, DbDelegate>;

export function getDataModel(modelName: string): DbDelegate {
  return getDelegate(modelName as ModelName);
}
