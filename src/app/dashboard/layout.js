// src/app/(dashboard)/layout.js
import DashboardSidebar from "@/components/layout/DashboardSidebar";
// import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
