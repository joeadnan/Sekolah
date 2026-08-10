import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CSV_HEADERS = [
  "Nama Lengkap",
  "Seragam",
  "Jenis Kelamin",
  "Agama",
  "Tempat Lahir",
  "Tanggal Lahir",
  "Umur",
  "No KK",
  "NIK",
  "Tinggi Badan",
  "Berat Badan",
  "Nama Ibu",
  "NIK Ibu",
  "Alamat",
  "Desa/Kelurahan",
  "Kecamatan",
  "Status",
  "Catatan",
  "Tanggal Daftar",
];

function escapeCsv(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);

  return `"${text
    .replace(/"/g, '""')
    .replace(/\r?\n|\r/g, " ")
    .trim()}"`;
}

function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
}

function formatDateTime(value: Date | string | null | undefined): string {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString();
}

function createCsvRow(values: unknown[]): string {
  return values.map(escapeCsv).join(",");
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;
    const session = sessionToken ? verifySessionToken(sessionToken) : null;

    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const rows = await db.admissionApplication.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        fullName: true,
        uniform: true,
        gender: true,
        religion: true,
        birthPlace: true,
        birthDate: true,
        age: true,
        familyCardNumber: true,
        nik: true,
        heightCm: true,
        weightKg: true,
        motherName: true,
        motherNik: true,
        address: true,
        village: true,
        district: true,
        status: true,
        note: true,
        createdAt: true,
      },
    });

    const csvRows = rows.map((row) =>
      createCsvRow([
        row.fullName,
        row.uniform,
        row.gender,
        row.religion,
        row.birthPlace,
        formatDate(row.birthDate),
        row.age,
        row.familyCardNumber,
        row.nik,
        row.heightCm,
        row.weightKg,
        row.motherName,
        row.motherNik,
        row.address,
        row.village,
        row.district,
        row.status,
        row.note,
        formatDateTime(row.createdAt),
      ]),
    );

    const csv = [createCsvRow(CSV_HEADERS), ...csvRows].join("\r\n");
    const fileDate = new Date().toISOString().slice(0, 10);

    return new Response(`\uFEFF${csv}`, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="data-ppdb-${fileDate}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[ADMISSION_EXPORT_CSV_ERROR]", error);

    return NextResponse.json(
      {
        message: "Gagal export data PPDB.",
      },
      {
        status: 500,
      },
    );
  }
}
