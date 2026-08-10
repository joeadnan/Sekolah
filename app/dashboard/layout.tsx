import { logoutAction } from "@/app/actions";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="dashboard-shell">
      <DashboardSidebar />
      <main className="dashboard-main">
        <header className="dashboard-header flex-between wrap">
          <div>
            <h1 className="dashboard-title">Dashboard Sekolah</h1>
            <p className="dashboard-subtitle">Sistem website dan manajemen sekolah berbasis Next.js</p>
          </div>
          <div className="flex-center wrap">
            <span className="text-muted">👤 {session.username}</span>
            <form action={logoutAction}>
              <button className="btn btn-sm btn-danger" type="submit">Logout</button>
            </form>
          </div>
        </header>
        <section className="dashboard-content">{children}</section>
      </main>
    </div>
  );
}
