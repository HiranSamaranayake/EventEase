import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div
      className="
min-h-screen
bg-gray-100
"
    >
      <Sidebar />

      <div
        className="
ml-72
"
      >
        <Topbar />

        <main
          className="
p-8
"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
