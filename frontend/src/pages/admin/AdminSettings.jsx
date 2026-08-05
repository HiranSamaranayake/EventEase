import { FaUserCog, FaLock, FaGlobe, FaSun, FaMoon, FaCheckCircle } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

const AdminSettings = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure global application preferences, security, and appearance settings.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* System Theme Controls */}
        <div className="bg-white shadow-xl rounded-3xl p-6 border border-gray-100 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 text-2xl">
            <FaSun />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">System Theme</h2>
            <p className="text-xs text-gray-500 mt-0.5">High contrast Light (Normal) mode is enabled globally for maximum text legibility.</p>
          </div>

          <div className="pt-2">
            <div className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center gap-2">
              <FaCheckCircle className="text-emerald-600 text-base" /> Normal Light Mode Active
            </div>

            <p className="text-[11px] text-gray-400 mt-2 text-center">
              Global theme set to <span className="font-bold text-gray-700 uppercase">Normal Mode</span>
            </p>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="bg-white shadow-xl rounded-3xl p-6 border border-gray-100 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl">
            <FaUserCog />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">Profile Settings</h2>
            <p className="text-xs text-gray-500 mt-0.5">Manage administrator account info and email notifications.</p>
          </div>
          <button className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition">
            Edit Profile
          </button>
        </div>

        {/* Security Settings */}
        <div className="bg-white shadow-xl rounded-3xl p-6 border border-gray-100 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 text-2xl">
            <FaLock />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">Security & Credentials</h2>
            <p className="text-xs text-gray-500 mt-0.5">Update password and manage session tokens.</p>
          </div>
          <button className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
