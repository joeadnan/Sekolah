import { closeDb, db } from "../lib/db";

const today = new Date();
const addDays = (days: number) => new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
const dateOnly = (year: number, month: number, day: number) => new Date(Date.UTC(year, month - 1, day));

async function main() {
  const setting = await db.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      schoolName: "SMA Cerdas Nusantara",
      tagline: "Berkarakter, Berprestasi, dan Siap Masa Depan",
      logoText: "SCN",
      principalName: "Drs. Ahmad Hidayat, M.Pd.",
      establishedYear: 2008,
      phone: "(021) 555-1234",
      whatsapp: "0812-3456-7890",
      email: "info@sma-cerdas.sch.id",
      address: "Jl. Pendidikan No. 10, Jakarta, Indonesia",
      about:
        "SMA Cerdas Nusantara adalah sekolah yang berfokus pada pembelajaran aktif, penguatan karakter, dan penguasaan teknologi. Sekolah menyediakan lingkungan belajar yang aman, kolaboratif, dan mendorong siswa untuk berkembang sesuai minat dan potensi masing-masing.",
      vision:
        "Menjadi sekolah unggul yang menghasilkan peserta didik berkarakter, berprestasi, kreatif, dan siap menghadapi perubahan zaman.",
      mission:
        "Menyelenggarakan pembelajaran yang aktif dan menyenangkan.\nMengembangkan karakter disiplin, jujur, tanggung jawab, dan peduli.\nMendorong prestasi akademik dan non-akademik.\nMemanfaatkan teknologi untuk mendukung tata kelola sekolah."
    }
  });

  const teachersData = [
    ["TCH001", "Siti Rahmawati, S.Pd.", "Guru Matematika", "S1 Pendidikan Matematika"],
    ["TCH002", "Budi Santoso, S.Kom.", "Guru Informatika", "S1 Teknik Informatika"],
    ["TCH003", "Nur Aisyah, S.Pd.", "Guru Bahasa Indonesia", "S1 Pendidikan Bahasa"],
    ["TCH004", "Rizky Pratama, M.Pd.", "Wakil Kurikulum", "S2 Manajemen Pendidikan"],
    ["TCH005", "Dewi Lestari, S.Pd.", "Guru Bahasa Inggris", "S1 Pendidikan Bahasa Inggris"],
    ["TCH006", "Agus Maulana, S.Pd.", "Guru PJOK", "S1 Pendidikan Olahraga"]
  ] as const;

  const teachers = [];
  for (let index = 0; index < teachersData.length; index++) {
    const [nip, fullName, position, education] = teachersData[index];
    const teacher = await db.teacher.upsert({
      where: { nip },
      update: {},
      create: {
        nip,
        fullName,
        position,
        education,
        email: `guru${index + 1}@sma-cerdas.sch.id`,
        phone: `0812-0000-00${String(index + 1).padStart(2, "0")}`,
        joinDate: dateOnly(2020, 7, 1),
        status: "active"
      }
    });
    teachers.push(teacher);
  }

  const classData = [
    ["X IPA 1", 10],
    ["X IPS 1", 10],
    ["XI IPA 1", 11],
    ["XII IPA 1", 12]
  ] as const;

  const classes = [];
  for (let index = 0; index < classData.length; index++) {
    const [name, gradeLevel] = classData[index];
    const classRoom = await db.classRoom.upsert({
      where: { name },
      update: {},
      create: {
        name,
        gradeLevel,
        academicYear: "2026/2027",
        capacity: 36,
        homeroomTeacherId: teachers[index % teachers.length].id
      }
    });
    classes.push(classRoom);
  }

  const subjectData = [
    ["MAT", "Matematika", teachers[0].id],
    ["INF", "Informatika", teachers[1].id],
    ["BIN", "Bahasa Indonesia", teachers[2].id],
    ["BIG", "Bahasa Inggris", teachers[4].id],
    ["PJOK", "Pendidikan Jasmani", teachers[5].id]
  ] as const;

  const subjects = [];
  for (const [code, name, teacherId] of subjectData) {
    const subject = await db.subject.upsert({
      where: { code },
      update: {},
      create: {
        code,
        name,
        teacherId,
        description: `Mata pelajaran ${name} untuk penguatan kompetensi siswa.`
      }
    });
    subjects.push(subject);
  }

  const studentsData = [
    ["0061110001", "Andi Prasetyo", "M"],
    ["0061110002", "Citra Maharani", "F"],
    ["0061110003", "Fajar Ramadhan", "M"],
    ["0061110004", "Nadia Putri", "F"],
    ["0061110005", "Raka Wijaya", "M"],
    ["0061110006", "Maya Salsabila", "F"],
    ["0061110007", "Dimas Saputra", "M"],
    ["0061110008", "Anisa Fitri", "F"]
  ] as const;

  const students = [];
  for (let index = 0; index < studentsData.length; index++) {
    const [nisn, fullName, gender] = studentsData[index];
    const student = await db.student.upsert({
      where: { nisn },
      update: {},
      create: {
        nisn,
        fullName,
        gender,
        birthPlace: "Jakarta",
        birthDate: dateOnly(2010, 1, Math.min(index + 1, 28)),
        classRoomId: classes[index % classes.length].id,
        guardianName: `Wali ${fullName}`,
        guardianPhone: `0813-1111-22${String(index).padStart(2, "0")}`,
        address: "Jakarta",
        status: "active"
      }
    });
    students.push(student);
  }

  const statuses = ["present", "present", "present", "sick", "permit", "present", "absent", "present"];
  for (let index = 0; index < students.length; index++) {
    const day = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    await db.attendance.upsert({
      where: { studentId_date: { studentId: students[index].id, date: day } },
      update: {},
      create: { studentId: students[index].id, date: day, status: statuses[index], note: "" }
    });
  }

  const scoreBase = [88, 91, 84, 79, 86, 90, 82, 87];
  for (let studentIndex = 0; studentIndex < students.length; studentIndex++) {
    for (let subjectIndex = 0; subjectIndex < subjects.slice(0, 3).length; subjectIndex++) {
      await db.grade.upsert({
        where: {
          studentId_subjectId_semester: {
            studentId: students[studentIndex].id,
            subjectId: subjects[subjectIndex].id,
            semester: "1"
          }
        },
        update: {},
        create: {
          studentId: students[studentIndex].id,
          subjectId: subjects[subjectIndex].id,
          semester: "1",
          score: scoreBase[studentIndex] - subjectIndex,
          note: "Nilai semester berjalan"
        }
      });
    }
  }

  const facilities = [
    ["Laboratorium Komputer", "computer", "Ruang praktik komputer untuk mendukung pembelajaran digital dan coding."],
    ["Perpustakaan Digital", "book", "Perpustakaan dengan koleksi buku fisik dan referensi digital."],
    ["Lapangan Olahraga", "sport", "Area olahraga untuk futsal, basket, upacara, dan kegiatan siswa."],
    ["Ruang UKS", "health", "Ruang kesehatan sekolah untuk penanganan awal siswa."],
    ["Ruang Seni", "art", "Fasilitas untuk seni musik, rupa, dan kegiatan kreatif."],
    ["Kantin Sehat", "food", "Kantin sekolah dengan pilihan makanan yang bersih dan sehat."]
  ] as const;

  for (const [name, iconClass, description] of facilities) {
    const existing = await db.facility.findFirst({ where: { name } });
    if (!existing) await db.facility.create({ data: { name, iconClass, description, isActive: true } });
  }

  const extracurriculars = [
    ["Pramuka", "Kak Rizky", "Jumat, 15.00", "Kegiatan pembentukan karakter, kepemimpinan, dan kemandirian siswa."],
    ["Futsal", "Pak Agus", "Rabu, 16.00", "Latihan teknik dasar, kerja sama tim, dan kompetisi internal."],
    ["English Club", "Bu Dewi", "Selasa, 15.30", "Kegiatan penguatan speaking, debate, storytelling, dan public speaking."],
    ["Coding Club", "Pak Budi", "Kamis, 15.30", "Belajar logika pemrograman, website, dan pembuatan aplikasi sederhana."]
  ] as const;

  for (const [name, coach, schedule, description] of extracurriculars) {
    const existing = await db.extracurricular.findFirst({ where: { name } });
    if (!existing) await db.extracurricular.create({ data: { name, coach, schedule, description, isActive: true } });
  }

  const announcements = [
    ["Pembukaan PPDB Tahun Ajaran 2026/2027", "Pendaftaran peserta didik baru telah dibuka. Calon siswa dapat mengisi formulir PPDB online melalui website sekolah.", today, "important"],
    ["Jadwal Ujian Tengah Semester", "Ujian Tengah Semester akan dilaksanakan sesuai kalender akademik. Siswa diminta mempersiapkan diri dengan baik.", addDays(3), "normal"]
  ] as const;
  for (const [title, content, startDate, priority] of announcements) {
    const existing = await db.announcement.findFirst({ where: { title } });
    if (!existing) await db.announcement.create({ data: { title, content, startDate, priority, isActive: true } });
  }

  const events = [
    ["Masa Pengenalan Lingkungan Sekolah", "Aula Sekolah", addDays(7), "Kegiatan orientasi untuk siswa baru."],
    ["Class Meeting Semester Ganjil", "Lapangan Sekolah", addDays(30), "Lomba antar kelas untuk mempererat kebersamaan."],
    ["Seminar Literasi Digital", "Laboratorium Komputer", addDays(18), "Edukasi keamanan digital dan penggunaan internet sehat."]
  ] as const;
  for (const [title, location, startDate, description] of events) {
    const existing = await db.event.findFirst({ where: { title } });
    if (!existing) await db.event.create({ data: { title, location, startDate, description, isActive: true } });
  }

  const newsPosts = [
    ["Prestasi Siswa dalam Olimpiade Sains Kota", "prestasi", "Siswa SMA Cerdas Nusantara meraih prestasi dalam ajang olimpiade sains tingkat kota."],
    ["Kegiatan Literasi Pagi untuk Meningkatkan Minat Baca", "kegiatan", "Sekolah menjalankan program literasi pagi untuk membangun kebiasaan membaca siswa."],
    ["Pembelajaran Berbasis Proyek di Kelas Informatika", "berita", "Siswa membuat proyek website sederhana sebagai bagian dari pembelajaran teknologi."]
  ] as const;
  for (const [title, category, content] of newsPosts) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    await db.newsPost.upsert({
      where: { slug },
      update: {},
      create: {
        title,
        slug,
        category,
        excerpt: content,
        content:
          content +
          "\n\nKegiatan ini menjadi bagian dari komitmen sekolah untuk menghadirkan pembelajaran yang aktif, relevan, dan dekat dengan kebutuhan masa depan siswa.",
        status: "published",
        publishedAt: today,
        coverImageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop"
      }
    });
  }

  const galleryItems = [
    ["Kegiatan Belajar di Kelas", "kegiatan", "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop"],
    ["Perpustakaan Sekolah", "fasilitas", "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop"],
    ["Kegiatan Olahraga", "kegiatan", "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?q=80&w=1200&auto=format&fit=crop"],
    ["Prestasi Siswa", "prestasi", "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1200&auto=format&fit=crop"]
  ] as const;
  for (let index = 0; index < galleryItems.length; index++) {
    const [title, category, imageUrl] = galleryItems[index];
    const existing = await db.gallery.findFirst({ where: { title } });
    if (!existing) await db.gallery.create({ data: { title, category, imageUrl, description: title, isFeatured: index < 3 } });
  }

  const existingBrochure = await db.download.findFirst({ where: { title: "Brosur PPDB" } });
  if (!existingBrochure) {
    await db.download.create({
      data: {
        title: "Brosur PPDB",
        category: "PPDB",
        description: "Dokumen informasi penerimaan peserta didik baru.",
        fileUrl: "https://example.com/brosur-ppdb.pdf",
        isActive: true
      }
    });
  }
  const existingCalendar = await db.download.findFirst({ where: { title: "Kalender Akademik" } });
  if (!existingCalendar) {
    await db.download.create({
      data: {
        title: "Kalender Akademik",
        category: "Akademik",
        description: "Kalender kegiatan akademik sekolah.",
        fileUrl: "https://example.com/kalender-akademik.pdf",
        isActive: true
      }
    });
  }

  await db.admissionApplication.upsert({
    where: { nik: "3174010101120001" },
    update: {},
    create: {
      fullName: "Rafi Alfarizi",
      uniform: "M",
      gender: "M",
      religion: "islam",
      birthPlace: "Jakarta",
      birthDate: dateOnly(2012, 1, 1),
      age: 14,
      familyCardNumber: "3174010101010001",
      nik: "3174010101120001",
      heightCm: 145,
      weightKg: 38,
      motherName: "Ibu Siti Aminah",
      motherNik: "3174014101800002",
      address: "Jl. Pendidikan No. 12",
      village: "Cempaka Putih",
      district: "Cempaka Putih",
      status: "new"
    }
  });

  const existingMessage = await db.contactMessage.findFirst({ where: { name: "Ibu Rina", subject: "Informasi PPDB" } });
  if (!existingMessage) {
    await db.contactMessage.create({
      data: {
        name: "Ibu Rina",
        subject: "Informasi PPDB",
        phone: "0812-3333-4444",
        email: "rina@example.com",
        message: "Saya ingin bertanya mengenai syarat pendaftaran siswa baru.",
        status: "new"
      }
    });
  }

  console.log(`Seed selesai untuk ${setting.schoolName}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await closeDb();
  });
