import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [editCredits, setEditCredits] = useState({});
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreditChange = (id, value) => {
    setEditCredits({ ...editCredits, [id]: value });
  };

  const handleUpdateCredits = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/users/${id}/credits`,
        { credits: Number(editCredits[id]) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Credits updated successfully");
      fetchUsers(); // Refresh the list
    } catch (err) {
      toast.error("Failed to update credits");
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Username</th>
            <th className="p-2 border">Credits</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="text-center">
              <td className="p-2 border">{user.username}</td>
              <td className="p-2 border">
                <input
                  type="number"
                  value={editCredits[user._id] ?? user.credits}
                  onChange={(e) => handleCreditChange(user._id, e.target.value)}
                  className="border p-1 rounded w-20"
                />
              </td>
              <td className="p-2 border">{user.role}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleUpdateCredits(user._id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;
