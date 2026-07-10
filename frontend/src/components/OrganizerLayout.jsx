import OrganizerSidebar from "./OrganizerSidebar";
import OrganizerTopbar from "./OrganizerTopbar";

const OrganizerLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <OrganizerSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Topbar */}
          <OrganizerTopbar />

          {/* Page Content */}
          <main className="flex-1 p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default OrganizerLayout;