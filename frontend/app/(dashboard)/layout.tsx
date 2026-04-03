import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Fixed sidebar */}
      <Sidebar />

      {/* Scrollable right column */}
      <div className="flex-1 flex flex-col ml-64 min-w-0">
        <Topbar />
        {children}
      </div>
    </div>
  );
}
