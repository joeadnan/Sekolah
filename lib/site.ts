import { db } from "@/lib/db";

export async function getSiteSetting() {
  return db.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      schoolName: "SD Negeri Baluk",
      tagline: "Berkarakter, Berprestasi, dan Siap Masa Depan",
      logoText: "SD",
    },
  });
}

export async function getPublicStats() {
  const [students, teachers, classes, subjects] = await Promise.all([
    db.student.count({ where: { status: "active" } }),
    db.teacher.count({ where: { status: "active" } }),
    db.classRoom.count(),
    db.subject.count(),
  ]);

  return { students, teachers, classes, subjects };
}
