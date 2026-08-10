import Link from "next/link";
import { resources, sidebarGroups } from "@/lib/admin-config";

export function DashboardSidebar() {
  return (
    <aside className="sidebar">
      <Link href="/dashboard" className="dashboard-brand">
        <span style={{ fontSize: 32 }}>🎓</span>
        <span>School Admin</span>
      </Link>
      <Link href="/" className="sidebar-link">🌐 Website</Link>
      <Link href="/dashboard" className="sidebar-link">📊 Dashboard</Link>

      {sidebarGroups.map((group) => (
        <div key={group.title}>
          <div className="sidebar-section">{group.title}</div>
          {group.items.map((resourceName) => {
            const item = resources.find((resource) => resource.resource === resourceName);
            if (!item) return null;
            return (
              <Link key={item.resource} href={`/dashboard/${item.resource}`} className="sidebar-link">
                <span>{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
