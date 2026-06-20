import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {

    return (

        <div className="min-h-screen bg-gray-100">

            <div className="
                bg-purple-700
                text-white
                px-6
                py-4
                shadow
            ">
                EventEase Dashboard
            </div>

            <div className="flex">

                <Sidebar />

                <div className="
                    flex-1
                    p-8
                ">
                    {children}
                </div>

            </div>

        </div>

    );
};

export default DashboardLayout;