"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearSessionCookie, requireAdmin, setSessionCookie } from "@/lib/auth";
import { getResourceConfig } from "@/lib/admin-config";
import type { FieldConfig } from "@/lib/admin-config";
import { getDelegate } from "@/lib/admin-data";
import { db } from "@/lib/db";
import { slugify } from "@/lib/format";

function textValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function parseField(field: FieldConfig, formData: FormData) {
  if (field.type === "boolean") return formData.get(field.name) === "on";
  const raw = textValue(formData, field.name);

  if (!raw) {
    if (field.required && field.type === "number") return 0;
    return field.required ? raw : null;
  }

  if (field.type === "number") return Number(raw);
  if (field.type === "date" || field.type === "datetime") return new Date(raw);
  if (field.type === "select" && field.relation) return Number(raw);
  return raw;
}

function parseResourceData(resource: string, formData: FormData) {
  const config = getResourceConfig(resource);
  if (!config) throw new Error("Resource tidak ditemukan");

  const data: Record<string, unknown> = {};
  for (const field of config.formFields) {
    data[field.name] = parseField(field, formData);
  }

  if (resource === "teachers") {
    if (!data.position) data.position = "Guru";
    if (!data.status) data.status = "active";
  }

  if (resource === "facilities" && !data.iconClass) data.iconClass = "building";

  if (resource === "news") {
    const title = String(data.title ?? "");
    const inputSlug = String(data.slug ?? "");
    data.slug = inputSlug || `${slugify(title)}-${Date.now().toString(36)}`;
    if (!data.publishedAt) data.publishedAt = new Date();
  }

  if (resource === "announcements" && !data.startDate) data.startDate = new Date();
  if (resource === "events" && !data.startDate) data.startDate = new Date();

  return { config, data };
}

export async function loginAction(formData: FormData) {
  const username = textValue(formData, "username");
  const password = textValue(formData, "password");

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";

  if (username !== adminUsername || password !== adminPassword) {
    redirect("/login?error=1");
  }

  await setSessionCookie(username);
  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}

export async function saveResourceAction(resource: string, id: number | null, formData: FormData) {
  await requireAdmin();
  const { config, data } = parseResourceData(resource, formData);
  const delegate = getDelegate(config.model);

  try {
    if (id) {
      await delegate.update({ where: { id }, data });
    } else {
      await delegate.create({ data });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menyimpan data";
    redirect(`/dashboard/${resource}?error=${encodeURIComponent(message)}`);
  }

  revalidatePath(`/dashboard/${resource}`);
  revalidatePath("/");
  redirect(`/dashboard/${resource}?saved=1`);
}

export async function deleteResourceAction(resource: string, id: number) {
  await requireAdmin();
  const config = getResourceConfig(resource);
  if (!config) throw new Error("Resource tidak ditemukan");

  try {
    await getDelegate(config.model).delete({ where: { id } });
  } catch {
    redirect(`/dashboard/${resource}?error=${encodeURIComponent("Data tidak bisa dihapus karena masih dipakai data lain.")}`);
  }

  revalidatePath(`/dashboard/${resource}`);
  revalidatePath("/");
  redirect(`/dashboard/${resource}?deleted=1`);
}

export async function submitAdmissionAction(formData: FormData) {
  const required = [
    "fullName",
    "uniform",
    "gender",
    "religion",
    "birthPlace",
    "birthDate",
    "age",
    "familyCardNumber",
    "nik",
    "motherName",
    "motherNik",
    "address",
    "village",
    "district"
  ];

  for (const name of required) {
    if (!textValue(formData, name)) redirect("/ppdb?error=Lengkapi%20semua%20field%20wajib");
  }

  try {
    await db.admissionApplication.create({
      data: {
        fullName: textValue(formData, "fullName"),
        uniform: textValue(formData, "uniform"),
        gender: textValue(formData, "gender"),
        religion: textValue(formData, "religion"),
        birthPlace: textValue(formData, "birthPlace"),
        birthDate: new Date(textValue(formData, "birthDate")),
        age: Number(textValue(formData, "age")),
        familyCardNumber: textValue(formData, "familyCardNumber"),
        nik: textValue(formData, "nik"),
        heightCm: textValue(formData, "heightCm") ? Number(textValue(formData, "heightCm")) : null,
        weightKg: textValue(formData, "weightKg") ? Number(textValue(formData, "weightKg")) : null,
        motherName: textValue(formData, "motherName"),
        motherNik: textValue(formData, "motherNik"),
        address: textValue(formData, "address"),
        village: textValue(formData, "village"),
        district: textValue(formData, "district"),
        status: "new"
      }
    });
  } catch {
    redirect("/ppdb?error=NIK%20sudah%20terdaftar%20atau%20data%20tidak%20valid");
  }

  revalidatePath("/dashboard/admissions");
  redirect("/ppdb?success=1");
}

export async function submitContactAction(formData: FormData) {
  const name = textValue(formData, "name");
  const subject = textValue(formData, "subject");
  const message = textValue(formData, "message");

  if (!name || !subject || !message) redirect("/kontak?error=Lengkapi%20nama,%20subjek,%20dan%20pesan");

  await db.contactMessage.create({
    data: {
      name,
      email: textValue(formData, "email") || null,
      phone: textValue(formData, "phone") || null,
      subject,
      message,
      status: "new"
    }
  });

  revalidatePath("/dashboard/messages");
  redirect("/kontak?success=1");
}
