export type Option = { label: string; value: string };
export type FieldType = "text" | "textarea" | "email" | "url" | "date" | "datetime" | "number" | "select" | "boolean";

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: Option[];
  relation?: "teacher" | "classRoom" | "student" | "subject";
  placeholder?: string;
  help?: string;
};

export type TableField = {
  name: string;
  label: string;
  type?: "date" | "datetime" | "boolean" | "choice";
  choices?: Option[];
};

export type ResourceConfig = {
  resource: string;
  model: string;
  title: string;
  singular: string;
  icon: string;
  description: string;
  orderBy?: Record<string, "asc" | "desc">;
  include?: Record<string, boolean>;
  searchableFields: string[];
  tableFields: TableField[];
  formFields: FieldConfig[];
};

export const genderOptions: Option[] = [
  { value: "M", label: "Laki-laki" },
  { value: "F", label: "Perempuan" }
];

export const activeOptions: Option[] = [
  { value: "active", label: "Aktif" },
  { value: "inactive", label: "Tidak Aktif" }
];

export const studentStatusOptions: Option[] = [
  { value: "active", label: "Aktif" },
  { value: "graduated", label: "Lulus" },
  { value: "transferred", label: "Pindah" },
  { value: "inactive", label: "Tidak Aktif" }
];

export const attendanceStatusOptions: Option[] = [
  { value: "present", label: "Hadir" },
  { value: "absent", label: "Alpa" },
  { value: "sick", label: "Sakit" },
  { value: "permit", label: "Izin" }
];

export const semesterOptions: Option[] = [
  { value: "1", label: "Semester 1" },
  { value: "2", label: "Semester 2" }
];

export const priorityOptions: Option[] = [
  { value: "normal", label: "Normal" },
  { value: "important", label: "Penting" },
  { value: "urgent", label: "Urgent" }
];

export const newsCategoryOptions: Option[] = [
  { value: "berita", label: "Berita Sekolah" },
  { value: "prestasi", label: "Prestasi" },
  { value: "kegiatan", label: "Kegiatan" },
  { value: "pengumuman", label: "Pengumuman" }
];

export const publishStatusOptions: Option[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" }
];

export const galleryCategoryOptions: Option[] = [
  { value: "kegiatan", label: "Kegiatan" },
  { value: "fasilitas", label: "Fasilitas" },
  { value: "prestasi", label: "Prestasi" },
  { value: "lainnya", label: "Lainnya" }
];

export const admissionStatusOptions: Option[] = [
  { value: "new", label: "Baru" },
  { value: "review", label: "Diproses" },
  { value: "accepted", label: "Diterima" },
  { value: "rejected", label: "Ditolak" }
];

export const contactStatusOptions: Option[] = [
  { value: "new", label: "Baru" },
  { value: "replied", label: "Dibalas" },
  { value: "closed", label: "Selesai" }
];

export const religionOptions: Option[] = [
  { value: "islam", label: "Islam" },
  { value: "kristen", label: "Kristen" },
  { value: "katolik", label: "Katolik" },
  { value: "hindu", label: "Hindu" },
  { value: "buddha", label: "Buddha" },
  { value: "konghucu", label: "Konghucu" },
  { value: "lainnya", label: "Lainnya" }
];

export const uniformOptions: Option[] = ["S", "M", "L", "XL", "XXL"].map((value) => ({ value, label: value }));

export const resources: ResourceConfig[] = [
  {
    resource: "settings",
    model: "siteSetting",
    title: "Pengaturan Website",
    singular: "Pengaturan",
    icon: "⚙️",
    description: "Kelola identitas, kontak, visi, misi, dan informasi umum website sekolah.",
    orderBy: { id: "asc" },
    searchableFields: ["schoolName", "tagline", "email"],
    tableFields: [
      { name: "schoolName", label: "Nama Sekolah" },
      { name: "tagline", label: "Tagline" },
      { name: "principalName", label: "Kepala Sekolah" },
      { name: "phone", label: "Telepon" },
      { name: "email", label: "Email" }
    ],
    formFields: [
      { name: "schoolName", label: "Nama Sekolah", type: "text", required: true },
      { name: "tagline", label: "Tagline", type: "text", required: true },
      { name: "logoText", label: "Teks Logo", type: "text", required: true },
      { name: "about", label: "Tentang Sekolah", type: "textarea" },
      { name: "vision", label: "Visi", type: "textarea" },
      { name: "mission", label: "Misi", type: "textarea" },
      { name: "principalName", label: "Kepala Sekolah", type: "text" },
      { name: "establishedYear", label: "Tahun Berdiri", type: "number" },
      { name: "address", label: "Alamat", type: "textarea" },
      { name: "phone", label: "Telepon", type: "text" },
      { name: "whatsapp", label: "WhatsApp", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "instagramUrl", label: "Instagram URL", type: "url" },
      { name: "facebookUrl", label: "Facebook URL", type: "url" },
      { name: "youtubeUrl", label: "YouTube URL", type: "url" }
    ]
  },
  {
    resource: "teachers",
    model: "teacher",
    title: "Guru & Staff",
    singular: "Guru",
    icon: "👩‍🏫",
    description: "Kelola data guru, staff, jabatan, pendidikan, dan kontak.",
    orderBy: { fullName: "asc" },
    searchableFields: ["nip", "fullName", "position", "education", "email"],
    tableFields: [
      { name: "nip", label: "NIP" },
      { name: "fullName", label: "Nama Lengkap" },
      { name: "position", label: "Jabatan" },
      { name: "education", label: "Pendidikan" },
      { name: "status", label: "Status", type: "choice", choices: activeOptions }
    ],
    formFields: [
      { name: "nip", label: "NIP", type: "text", required: true },
      { name: "fullName", label: "Nama Lengkap", type: "text", required: true },
      { name: "position", label: "Jabatan", type: "text" },
      { name: "education", label: "Pendidikan Terakhir", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "No. HP", type: "text" },
      { name: "address", label: "Alamat", type: "textarea" },
      { name: "photoUrl", label: "URL Foto", type: "url" },
      { name: "joinDate", label: "Tanggal Bergabung", type: "date" },
      { name: "status", label: "Status", type: "select", options: activeOptions, required: true }
    ]
  },
  {
    resource: "classes",
    model: "classRoom",
    title: "Kelas",
    singular: "Kelas",
    icon: "🏫",
    description: "Kelola kelas, tingkat, tahun ajaran, kapasitas, dan wali kelas.",
    include: { homeroomTeacher: true },
    orderBy: { gradeLevel: "asc" },
    searchableFields: ["name", "academicYear"],
    tableFields: [
      { name: "name", label: "Nama Kelas" },
      { name: "gradeLevel", label: "Tingkat" },
      { name: "academicYear", label: "Tahun Ajaran" },
      { name: "capacity", label: "Kapasitas" },
      { name: "homeroomTeacher.fullName", label: "Wali Kelas" }
    ],
    formFields: [
      { name: "name", label: "Nama Kelas", type: "text", required: true },
      { name: "gradeLevel", label: "Tingkat Kelas", type: "number", required: true },
      { name: "academicYear", label: "Tahun Ajaran", type: "text", required: true },
      { name: "capacity", label: "Kapasitas", type: "number", required: true },
      { name: "homeroomTeacherId", label: "Wali Kelas", type: "select", relation: "teacher" }
    ]
  },
  {
    resource: "subjects",
    model: "subject",
    title: "Mata Pelajaran",
    singular: "Mata Pelajaran",
    icon: "📚",
    description: "Kelola kode mata pelajaran, nama, deskripsi, dan guru pengampu.",
    include: { teacher: true },
    orderBy: { name: "asc" },
    searchableFields: ["code", "name", "description"],
    tableFields: [
      { name: "code", label: "Kode" },
      { name: "name", label: "Nama Mapel" },
      { name: "teacher.fullName", label: "Guru Pengampu" },
      { name: "description", label: "Deskripsi" }
    ],
    formFields: [
      { name: "code", label: "Kode Mapel", type: "text", required: true },
      { name: "name", label: "Nama Mata Pelajaran", type: "text", required: true },
      { name: "description", label: "Deskripsi", type: "textarea" },
      { name: "teacherId", label: "Guru Pengampu", type: "select", relation: "teacher" }
    ]
  },
  {
    resource: "students",
    model: "student",
    title: "Siswa",
    singular: "Siswa",
    icon: "👥",
    description: "Kelola data siswa, kelas, kontak, dan status akademik.",
    include: { classRoom: true },
    orderBy: { fullName: "asc" },
    searchableFields: ["nisn", "fullName", "email", "phone", "guardianName"],
    tableFields: [
      { name: "nisn", label: "NISN" },
      { name: "fullName", label: "Nama Lengkap" },
      { name: "gender", label: "JK", type: "choice", choices: genderOptions },
      { name: "classRoom.name", label: "Kelas" },
      { name: "guardianName", label: "Wali" },
      { name: "status", label: "Status", type: "choice", choices: studentStatusOptions }
    ],
    formFields: [
      { name: "nisn", label: "NISN", type: "text", required: true },
      { name: "fullName", label: "Nama Lengkap", type: "text", required: true },
      { name: "gender", label: "Jenis Kelamin", type: "select", options: genderOptions, required: true },
      { name: "birthPlace", label: "Tempat Lahir", type: "text" },
      { name: "birthDate", label: "Tanggal Lahir", type: "date" },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "No. HP", type: "text" },
      { name: "address", label: "Alamat", type: "textarea" },
      { name: "classRoomId", label: "Kelas", type: "select", relation: "classRoom" },
      { name: "guardianName", label: "Nama Wali/Orang Tua", type: "text" },
      { name: "guardianPhone", label: "No. HP Wali", type: "text" },
      { name: "status", label: "Status", type: "select", options: studentStatusOptions, required: true }
    ]
  },
  {
    resource: "attendances",
    model: "attendance",
    title: "Absensi",
    singular: "Absensi",
    icon: "✅",
    description: "Catat absensi harian siswa.",
    include: { student: true },
    orderBy: { date: "desc" },
    searchableFields: ["note"],
    tableFields: [
      { name: "student.fullName", label: "Siswa" },
      { name: "date", label: "Tanggal", type: "date" },
      { name: "status", label: "Status", type: "choice", choices: attendanceStatusOptions },
      { name: "note", label: "Catatan" }
    ],
    formFields: [
      { name: "studentId", label: "Siswa", type: "select", relation: "student", required: true },
      { name: "date", label: "Tanggal", type: "date", required: true },
      { name: "status", label: "Status", type: "select", options: attendanceStatusOptions, required: true },
      { name: "note", label: "Catatan", type: "textarea" }
    ]
  },
  {
    resource: "grades",
    model: "grade",
    title: "Nilai",
    singular: "Nilai",
    icon: "📊",
    description: "Kelola nilai siswa per mata pelajaran dan semester.",
    include: { student: true, subject: true },
    orderBy: { id: "desc" },
    searchableFields: ["note"],
    tableFields: [
      { name: "student.fullName", label: "Siswa" },
      { name: "subject.name", label: "Mapel" },
      { name: "semester", label: "Semester", type: "choice", choices: semesterOptions },
      { name: "score", label: "Nilai" },
      { name: "note", label: "Catatan" }
    ],
    formFields: [
      { name: "studentId", label: "Siswa", type: "select", relation: "student", required: true },
      { name: "subjectId", label: "Mata Pelajaran", type: "select", relation: "subject", required: true },
      { name: "semester", label: "Semester", type: "select", options: semesterOptions, required: true },
      { name: "score", label: "Nilai", type: "number", required: true },
      { name: "note", label: "Catatan", type: "text" }
    ]
  },
  {
    resource: "news",
    model: "newsPost",
    title: "Berita & Artikel",
    singular: "Berita",
    icon: "📰",
    description: "Kelola berita sekolah dan artikel publik dengan slug SEO friendly.",
    orderBy: { publishedAt: "desc" },
    searchableFields: ["title", "excerpt", "content", "category"],
    tableFields: [
      { name: "title", label: "Judul" },
      { name: "category", label: "Kategori", type: "choice", choices: newsCategoryOptions },
      { name: "status", label: "Status", type: "choice", choices: publishStatusOptions },
      { name: "publishedAt", label: "Publish", type: "datetime" }
    ],
    formFields: [
      { name: "title", label: "Judul", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", help: "Kosongkan untuk dibuat otomatis dari judul." },
      { name: "category", label: "Kategori", type: "select", options: newsCategoryOptions, required: true },
      { name: "excerpt", label: "Ringkasan", type: "textarea" },
      { name: "content", label: "Konten", type: "textarea", required: true },
      { name: "coverImageUrl", label: "URL Gambar Cover", type: "url" },
      { name: "status", label: "Status", type: "select", options: publishStatusOptions, required: true },
      { name: "publishedAt", label: "Tanggal Publish", type: "datetime", required: true }
    ]
  },
  {
    resource: "announcements",
    model: "announcement",
    title: "Pengumuman",
    singular: "Pengumuman",
    icon: "📢",
    description: "Kelola pengumuman sekolah yang tampil di website publik.",
    orderBy: { startDate: "desc" },
    searchableFields: ["title", "content"],
    tableFields: [
      { name: "title", label: "Judul" },
      { name: "priority", label: "Prioritas", type: "choice", choices: priorityOptions },
      { name: "startDate", label: "Mulai", type: "date" },
      { name: "isActive", label: "Aktif", type: "boolean" }
    ],
    formFields: [
      { name: "title", label: "Judul Pengumuman", type: "text", required: true },
      { name: "content", label: "Isi Pengumuman", type: "textarea", required: true },
      { name: "startDate", label: "Tanggal Mulai", type: "date", required: true },
      { name: "endDate", label: "Tanggal Selesai", type: "date" },
      { name: "priority", label: "Prioritas", type: "select", options: priorityOptions, required: true },
      { name: "isActive", label: "Aktif", type: "boolean" }
    ]
  },
  {
    resource: "events",
    model: "event",
    title: "Agenda Sekolah",
    singular: "Agenda",
    icon: "🗓️",
    description: "Kelola agenda dan kegiatan sekolah.",
    orderBy: { startDate: "asc" },
    searchableFields: ["title", "location", "description"],
    tableFields: [
      { name: "title", label: "Agenda" },
      { name: "location", label: "Lokasi" },
      { name: "startDate", label: "Mulai", type: "date" },
      { name: "isActive", label: "Aktif", type: "boolean" }
    ],
    formFields: [
      { name: "title", label: "Nama Agenda", type: "text", required: true },
      { name: "location", label: "Lokasi", type: "text" },
      { name: "startDate", label: "Tanggal Mulai", type: "date", required: true },
      { name: "endDate", label: "Tanggal Selesai", type: "date" },
      { name: "description", label: "Deskripsi", type: "textarea" },
      { name: "isActive", label: "Aktif", type: "boolean" }
    ]
  },
  {
    resource: "facilities",
    model: "facility",
    title: "Fasilitas",
    singular: "Fasilitas",
    icon: "🏛️",
    description: "Kelola fasilitas yang tampil di halaman publik.",
    orderBy: { name: "asc" },
    searchableFields: ["name", "description"],
    tableFields: [
      { name: "name", label: "Nama" },
      { name: "iconClass", label: "Icon" },
      { name: "description", label: "Deskripsi" },
      { name: "isActive", label: "Aktif", type: "boolean" }
    ],
    formFields: [
      { name: "name", label: "Nama Fasilitas", type: "text", required: true },
      { name: "iconClass", label: "Icon Class", type: "text" },
      { name: "description", label: "Deskripsi", type: "textarea", required: true },
      { name: "imageUrl", label: "URL Gambar", type: "url" },
      { name: "isActive", label: "Aktif", type: "boolean" }
    ]
  },
  {
    resource: "extracurriculars",
    model: "extracurricular",
    title: "Ekstrakurikuler",
    singular: "Ekskul",
    icon: "🏆",
    description: "Kelola program ekstrakurikuler, pembina, dan jadwal.",
    orderBy: { name: "asc" },
    searchableFields: ["name", "coach", "schedule", "description"],
    tableFields: [
      { name: "name", label: "Nama" },
      { name: "coach", label: "Pembina" },
      { name: "schedule", label: "Jadwal" },
      { name: "isActive", label: "Aktif", type: "boolean" }
    ],
    formFields: [
      { name: "name", label: "Nama Ekskul", type: "text", required: true },
      { name: "coach", label: "Pembina", type: "text" },
      { name: "schedule", label: "Jadwal", type: "text" },
      { name: "description", label: "Deskripsi", type: "textarea", required: true },
      { name: "isActive", label: "Aktif", type: "boolean" }
    ]
  },
  {
    resource: "gallery",
    model: "gallery",
    title: "Galeri",
    singular: "Foto",
    icon: "🖼️",
    description: "Kelola foto kegiatan, fasilitas, dan prestasi sekolah.",
    orderBy: { createdAt: "desc" },
    searchableFields: ["title", "category", "description"],
    tableFields: [
      { name: "title", label: "Judul" },
      { name: "category", label: "Kategori", type: "choice", choices: galleryCategoryOptions },
      { name: "imageUrl", label: "URL Gambar" },
      { name: "isFeatured", label: "Featured", type: "boolean" }
    ],
    formFields: [
      { name: "title", label: "Judul Foto", type: "text", required: true },
      { name: "category", label: "Kategori", type: "select", options: galleryCategoryOptions, required: true },
      { name: "imageUrl", label: "URL Gambar", type: "url", required: true },
      { name: "description", label: "Deskripsi", type: "textarea" },
      { name: "isFeatured", label: "Tampilkan di Beranda", type: "boolean" }
    ]
  },
  {
    resource: "downloads",
    model: "download",
    title: "Download Dokumen",
    singular: "Dokumen",
    icon: "⬇️",
    description: "Kelola dokumen yang bisa diunduh dari website sekolah.",
    orderBy: { title: "asc" },
    searchableFields: ["title", "category", "description"],
    tableFields: [
      { name: "title", label: "Nama Dokumen" },
      { name: "category", label: "Kategori" },
      { name: "fileUrl", label: "URL File" },
      { name: "isActive", label: "Aktif", type: "boolean" }
    ],
    formFields: [
      { name: "title", label: "Nama Dokumen", type: "text", required: true },
      { name: "category", label: "Kategori", type: "text" },
      { name: "description", label: "Deskripsi", type: "textarea" },
      { name: "fileUrl", label: "URL File", type: "url", required: true },
      { name: "isActive", label: "Aktif", type: "boolean" }
    ]
  },
  {
    resource: "admissions",
    model: "admissionApplication",
    title: "Pendaftaran PPDB",
    singular: "Pendaftaran",
    icon: "📝",
    description: "Kelola data calon siswa hasil input form PPDB online.",
    orderBy: { createdAt: "desc" },
    searchableFields: ["fullName", "nik", "familyCardNumber", "motherName", "village", "district"],
    tableFields: [
      { name: "fullName", label: "Nama Lengkap" },
      { name: "nik", label: "NIK" },
      { name: "gender", label: "JK", type: "choice", choices: genderOptions },
      { name: "village", label: "Desa/Kelurahan" },
      { name: "district", label: "Kecamatan" },
      { name: "status", label: "Status", type: "choice", choices: admissionStatusOptions },
      { name: "createdAt", label: "Daftar", type: "datetime" }
    ],
    formFields: [
      { name: "fullName", label: "Nama Lengkap", type: "text", required: true },
      { name: "uniform", label: "Seragam", type: "select", options: uniformOptions, required: true },
      { name: "gender", label: "Jenis Kelamin", type: "select", options: genderOptions, required: true },
      { name: "religion", label: "Agama", type: "select", options: religionOptions, required: true },
      { name: "birthPlace", label: "Tempat Lahir", type: "text", required: true },
      { name: "birthDate", label: "Tanggal Lahir", type: "date", required: true },
      { name: "age", label: "Umur", type: "number", required: true },
      { name: "familyCardNumber", label: "No. KK", type: "text", required: true },
      { name: "nik", label: "NIK", type: "text", required: true },
      { name: "heightCm", label: "Tinggi Badan (cm)", type: "number" },
      { name: "weightKg", label: "Berat Badan (kg)", type: "number" },
      { name: "motherName", label: "Nama Ibu", type: "text", required: true },
      { name: "motherNik", label: "NIK Ibu", type: "text", required: true },
      { name: "address", label: "Alamat", type: "textarea", required: true },
      { name: "village", label: "Desa/Kelurahan", type: "text", required: true },
      { name: "district", label: "Kecamatan", type: "text", required: true },
      { name: "status", label: "Status", type: "select", options: admissionStatusOptions, required: true },
      { name: "note", label: "Catatan Admin", type: "textarea" }
    ]
  },
  {
    resource: "messages",
    model: "contactMessage",
    title: "Pesan Kontak",
    singular: "Pesan",
    icon: "✉️",
    description: "Kelola pesan yang masuk dari form kontak publik.",
    orderBy: { createdAt: "desc" },
    searchableFields: ["name", "email", "phone", "subject", "message"],
    tableFields: [
      { name: "name", label: "Nama" },
      { name: "phone", label: "No. HP" },
      { name: "subject", label: "Subjek" },
      { name: "status", label: "Status", type: "choice", choices: contactStatusOptions },
      { name: "createdAt", label: "Masuk", type: "datetime" }
    ],
    formFields: [
      { name: "name", label: "Nama", type: "text", required: true },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "No. HP", type: "text" },
      { name: "subject", label: "Subjek", type: "text", required: true },
      { name: "message", label: "Pesan", type: "textarea", required: true },
      { name: "status", label: "Status", type: "select", options: contactStatusOptions, required: true }
    ]
  }
];

export function getResourceConfig(resource: string) {
  return resources.find((item) => item.resource === resource);
}

export function getChoiceLabel(options: Option[] | undefined, value: unknown) {
  const item = options?.find((option) => option.value === String(value));
  return item?.label ?? String(value ?? "-");
}

export const sidebarGroups = [
  {
    title: "Akademik",
    items: ["students", "teachers", "classes", "subjects", "attendances", "grades"]
  },
  {
    title: "Website",
    items: ["settings", "news", "announcements", "events", "facilities", "extracurriculars", "gallery", "downloads"]
  },
  {
    title: "Layanan",
    items: ["admissions", "messages"]
  }
];
