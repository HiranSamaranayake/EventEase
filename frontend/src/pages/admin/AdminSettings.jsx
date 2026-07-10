import { FaUserCog, FaLock, FaGlobe } from "react-icons/fa";

const AdminSettings = () => {
  return (
    <div>
      <h1
        className="
text-4xl
font-bold
mb-8
"
      >
        Admin Settings
      </h1>

      <div
        className="
grid
md:grid-cols-3
gap-6
"
      >
        <div
          className="
bg-white
shadow
rounded-2xl
p-6
"
        >
          <FaUserCog
            className="
text-4xl
text-purple-600
mb-4
"
          />

          <h2 className="text-xl font-bold">Profile Settings</h2>

          <p className="text-gray-500">Manage admin profile</p>
        </div>

        <div
          className="
bg-white
shadow
rounded-2xl
p-6
"
        >
          <FaLock
            className="
text-4xl
text-red-600
mb-4
"
          />

          <h2 className="text-xl font-bold">Security</h2>

          <p className="text-gray-500">Change password</p>
        </div>

        <div
          className="
bg-white
shadow
rounded-2xl
p-6
"
        >
          <FaGlobe
            className="
text-4xl
text-blue-600
mb-4
"
          />

          <h2 className="text-xl font-bold">Website Settings</h2>

          <p className="text-gray-500">System controls</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
