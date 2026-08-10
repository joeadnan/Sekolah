import { redirect } from "next/navigation";
import { loginAction } from "@/app/actions";
import { getCurrentSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SearchParams = Promise<{ error?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const [params, session] = await Promise.all([searchParams, getCurrentSession()]);
  if (session) redirect("/dashboard");

  return (
    <main className="login-page">
      <form action={loginAction} className="card login-card">
        <div className="flex-center" style={{ marginBottom: 22 }}>
          <span className="brand-mark">SCN</span>
          <div>
            <h1 className="dashboard-title">Login Admin</h1>
            <p className="dashboard-subtitle">School Website Next.js</p>
          </div>
        </div>
        {params.error ? <div className="alert alert-danger">Username atau password salah.</div> : null}
        <div className="form-group">
          <label className="form-label" htmlFor="username">Username</label>
          <input id="username" name="username" className="form-control" defaultValue="admin" required />
        </div>
        <div className="form-group mt-md">
          <label className="form-label" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" className="form-control" defaultValue="admin12345" required />
        </div>
        <button className="btn btn-primary" style={{ width: "100%", marginTop: 24 }} type="submit">Masuk Dashboard</button>
      </form>
    </main>
  );
}
