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
          <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 text-2xl">
            {isDark ? <FaMoon /> : <FaSun />}
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">System Theme</h2>
            <p className="text-xs text-gray-500 mt-0.5">Toggle overall website dark mode & light mode theme.</p>
          </div>

          <div className="pt-2">
            <button
              onClick={toggleTheme}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs shadow transition flex items-center justify-center gap-2 ${
                isDark
                  ? "bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700"
                  : "bg-purple-700 hover:bg-purple-800 text-white"
              }`}
            >
              {isDark ? (
                <>
                  <FaSun className="text-amber-400 text-base" /> Disable Dark Mode (Switch to Light)
                </>
              ) : (
                <>
                  <FaMoon className="text-amber-300 text-base" /> Enable Dark Mode (Switch to Dark)
                </>
              )}
            </button>

            <p className="text-[11px] text-gray-400 mt-2 text-center flex items-center justify-center gap-1">
              <FaCheckCircle className="text-emerald-500" /> Active Theme: <span className="font-bold text-gray-700 uppercase">{theme}</span>
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
