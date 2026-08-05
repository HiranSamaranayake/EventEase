import { useState } from "react";
import { Outlet } from "react-router-dom";
import OrganizerSidebar from "./OrganizerSidebar";
import OrganizerTopbar from "./OrganizerTopbar";

const OrganizerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex flex-1 relative overflow-x-hidden">
        {/* Responsive Mobile Drawer & Desktop Sidebar */}
        <OrganizerSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <OrganizerTopbar onToggleSidebar={toggleSidebar} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default OrganizerLayout;