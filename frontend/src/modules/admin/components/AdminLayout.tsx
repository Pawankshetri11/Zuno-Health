import type { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="relative min-h-screen bg-[#fafcff] text-slate-900 flex font-sans antialiased">
      {/* Ambient Background Glows */}
      <div aria-hidden="true" className="pointer-events-none fixed -right-24 -top-24 h-96 w-96 rounded-full bg-orange-100/30 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none fixed -left-24 bottom-0 h-96 w-96 rounded-full bg-blue-100/30 blur-3xl" />

      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="relative flex-1 min-w-0 min-h-screen px-4 py-8 md:px-8 pt-20 lg:pt-8 text-slate-900">
        <div className="max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
