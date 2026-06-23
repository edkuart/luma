import {
  AdminMobileNav,
  AdminSidebar,
} from "@/components/admin/admin-sidebar";
import { ScrollbarAutoHide } from "@/components/admin/scrollbar-auto-hide";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adminEmail = process.env.ADMIN_EMAIL ?? "Admin";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollbarAutoHide />
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <AdminSidebar adminEmail={adminEmail} />
        <main className="min-w-0">
          <AdminMobileNav adminEmail={adminEmail} />
          {children}
        </main>
      </div>
    </div>
  );
}
