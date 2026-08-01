import { useAuth } from "../contexts/AuthContext";

const Topbar = () => {

    const { user, logout } = useAuth();

    return (

        <div className="
            bg-white
            px-8
            py-4
            shadow-sm
            flex
            justify-between
            items-center
        ">

            {/* Search */}

            <div>

                <input
                    type="text"
                    placeholder="Search..."
                    className="
                        px-4
                        py-2
                        border
                        rounded-xl
                        w-80
                        focus:outline-none
                        focus:ring-2
                        focus:ring-purple-500
                    "
                />

            </div>

            {/* Right Side */}

            <div className="
                flex
                items-center
                gap-6
            ">

                <button
                    className="
                        text-2xl
                        hover:scale-110
                        transition
                    "
                >
                    🔔
                </button>

                <div className="text-right">

                    <h4 className="font-bold">
                        {user?.full_name}
                    </h4>

                    <p className="
                        text-sm
                        text-gray-500
                    ">
                        {user?.role}
                    </p>

                </div>

                <button
                    onClick={logout}
                    className="
                        bg-red-500
                        text-white
                        px-4
                        py-2
                        rounded-xl
                        hover:bg-red-600
                        transition
                    "
                >
                    Logout
                </button>

            </div>

        </div>

    );
};

export default Topbar;