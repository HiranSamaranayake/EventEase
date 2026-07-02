import { useEffect, useState } from "react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/EventEase/backend/api/admin_users.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.users);
        }

        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-10 text-xl">Loading Users...</div>;
  }
  const deleteUser = (id) => {
    if (!window.confirm("Delete this user?")) {
      return;
    }

    fetch("http://localhost/EventEase/backend/api/delete_user.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(users.filter((user) => user.id !== id));
        } else {
          alert(data.message);
        }
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold text-purple-700 mb-8">Manage Users</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Registered</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
             <tr
    key={user.id}
    className="border-b hover:bg-gray-50"
>
    <td className="p-4">{user.id}</td>

    <td className="p-4">{user.full_name}</td>

    <td className="p-4">{user.email}</td>

    <td className="p-4">{user.phone}</td>

    <td className="p-4 capitalize">
        {user.role}
    </td>

    <td className="p-4">
        {user.created_at}
    </td>

    <td className="p-4">
        <button
            onClick={() => deleteUser(user.id)}
            className="
                bg-red-600
                text-white
                px-4
                py-2
                rounded-lg
                hover:bg-red-700
            "
        >
            Delete
        </button>
    </td>

</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
