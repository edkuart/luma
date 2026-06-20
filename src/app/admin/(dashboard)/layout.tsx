import {
  AdminMobileNav,
  AdminSidebar,
} from "@/components/admin/admin-sidebar";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adminEmail = process.env.ADMIN_EMAIL ?? "Admin";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <AdminSidebar adminEmail={adminEmail} />
        <main>
          <AdminMobileNav adminEmail={adminEmail} />
          {children}
        </main>
      </div>
    </div>
  );
}
