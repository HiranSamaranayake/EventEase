import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";

const Topbar = () => {
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className={`px-8 py-4 flex justify-between items-center transition-colors duration-300 ${
            isDark ? "bg-slate-900 border-b border-slate-800 text-white" : "bg-white border-b border-gray-200 text-gray-800 shadow-sm"
        }`}>
            {/* Search */}
            <div>
                <input
                    type="text"
                    placeholder="Search platform resources..."
                    className={`px-4 py-2 text-xs font-semibold rounded-xl w-80 outline-none transition ${
                        isDark ? "bg-slate-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500" : "bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                    }`}
                />
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
                <ThemeToggle />

                <button className="text-xl hover:scale-110 transition">
                    🔔
                </button>

                <div className="text-right">
                    <h4 className={`font-bold text-xs ${isDark ? "text-white" : "text-gray-800"}`}>
                        {user?.full_name || "Admin"}
                    </h4>
                    <p className="text-[10px] font-semibold text-purple-500 uppercase tracking-wider">
                        {user?.role || "Admin"}
                    </p>
                </div>

                <button
                    onClick={logout}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-md"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Topbar;