import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = ({ children }) => {

    return (

        <div className="
            min-h-screen
            bg-gray-100
        ">

            <div className="flex">

                <Sidebar />

                <div className="flex-1">

                    <Topbar />

                    <div className="p-8">

                        {children}

                    </div>

                </div>

            </div>

        </div>

    );
};

export default DashboardLayout;