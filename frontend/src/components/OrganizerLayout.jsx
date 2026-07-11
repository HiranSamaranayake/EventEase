import { Outlet } from "react-router-dom";
import OrganizerSidebar from "./OrganizerSidebar";
import OrganizerTopbar from "./OrganizerTopbar";

const OrganizerLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <OrganizerSidebar />

        <div className="flex-1 flex flex-col min-h-screen">
          <OrganizerTopbar />

          <main className="flex-1 p-8 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default OrganizerLayout;