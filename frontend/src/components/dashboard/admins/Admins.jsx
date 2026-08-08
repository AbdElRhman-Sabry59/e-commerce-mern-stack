import axios from "axios";
import { useEffect, useState } from "react";

export const Admins = () => {
  const [users, setUsers] = useState([]);

  // المستخدم الذي يتم تعديله
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // بيانات التعديل
  const [fullName, setFullName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [group_id, setGroup_id] = useState(1);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // GET USERS
  // =========================
  const fetchAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:8585/users", {
        withCredentials: true,
      });

      setUsers(res.data.users);
    } catch (err) {
      console.log(err);

      setError(err.response?.data?.message || "Failed to load admins");
    }
  };

  // =========================
  // LOAD ADMINS
  // =========================
  useEffect(() => {
    fetchAdmins();
  }, []);

  // =========================
  // DELETE ADMIN
  // =========================
  const handleDelete = async (admin) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete admin ${admin.fullName}?`,
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);

      const res = await axios.delete(
        `http://localhost:8585/users/${admin.id}`,
        {
          withCredentials: true,
        },
      );

      console.log(res.data);

      // حذف المستخدم من الواجهة
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== admin.id));

      if (selectedAdmin?.id === admin.id) {
        setSelectedAdmin(null);
      }

      alert("Admin deleted successfully");
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Something went wrong while deleting admin",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // OPEN EDIT
  // =========================
  const handleEdit = (admin) => {
    console.log(admin); // اطبع بيانات الأدمن

    setSelectedAdmin(admin);

    setFullName(admin.fullName);
    setName(admin.name);
    setEmail(admin.email);

    setGroup_id(Number(admin.group_id));

    setError("");
  };
  // =========================
  // UPDATE ADMIN
  // =========================
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedAdmin) return;

    if (!fullName.trim() || !name.trim() || !email.trim()) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.put(
        `http://localhost:8585/users/${selectedAdmin.id}`,
        {
          fullName,
          name,
          email,
          group_id,
        },
        {
          withCredentials: true,
        },
      );

      // إعادة تحميل البيانات من قاعدة البيانات
      await fetchAdmins();

      // إغلاق الفورم
      setSelectedAdmin(null);

      alert("User updated successfully");
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message ||
          "Something went wrong while updating user",
      );
    } finally {
      setLoading(false);
    }
  };
  // =========================
  // ADMINS ONLY
  // =========================
  const admins = users.filter((user) => Number(user.group_id) === 1);

  return (
    <div className="admins-page">
      {/* ========================= */}
      {/* ADMINS TABLE */}
      {/* ========================= */}

      <div className="table-wrapper">
        <h2>Admins</h2>

        {error && !selectedAdmin && <p className="error">{error}</p>}

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Name</th>
              <th>Email</th>
              <th>Group</th>
              <th>Operations</th>
            </tr>
          </thead>

          <tbody>
            {admins.length > 0 ? (
              admins.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>

                  <td>(admin) {user.fullName}</td>

                  <td>{user.name}</td>

                  <td>{user.email}</td>

                  <td>{Number(user.group_id) === 1 ? "Admin" : "User"}</td>

                  <td className="operations">
                    <button onClick={() => handleEdit(user)}>Edit</button>

                    <button
                      onClick={() => handleDelete(user)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No Admins Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ========================= */}
      {/* EDIT ADMIN FORM */}
      {/* ========================= */}

      {selectedAdmin && (
        <div className="edit-admin">
          <h2>Edit User</h2>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleUpdate}>
            {/* FULL NAME */}
            <label>Full Name</label>

            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            {/* NAME */}
            <label>Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* EMAIL */}
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* GROUP ID */}
            <label>User Type</label>

            <select
              value={group_id}
              onChange={(e) => setGroup_id(Number(e.target.value))}
            >
              <option value={0}>User</option>

              <option value={1}>Admin</option>
            </select>

            {/* BUTTONS */}
            <div className="edit-buttons">
              <button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update"}
              </button>

              <button type="button" onClick={() => setSelectedAdmin(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
