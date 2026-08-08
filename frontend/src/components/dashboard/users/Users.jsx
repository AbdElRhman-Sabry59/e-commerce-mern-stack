import { useEffect, useState } from "react";
import "./Users.css";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);

  // =========================
  // GET USERS
  // =========================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("https://e-commerce-mern-stack-production.up.railway.app/users", {
          withCredentials: true,
        });

        console.log("Users:", res.data.users);

        setUsers(res.data.users);
      } catch (err) {
        console.log(err);

        if (err.response?.status === 401) {
          alert("You are not authenticated");
        }

        if (err.response?.status === 403) {
          alert("Your session has expired");
        }
      }
    };

    fetchUsers();
  }, []);

  // =========================
  // DELETE USER
  // =========================
  const handleDeleteUser = async (user) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${user.fullName}?`,
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const res = await axios.delete(`https://e-commerce-mern-stack-production.up.railway.app/users/${user.id}`, {
        withCredentials: true,
      });

      console.log(res.data);

      // حذف المستخدم من الواجهة مباشرة
      setUsers((prevUsers) => prevUsers.filter((item) => item.id !== user.id));

      alert("User deleted successfully");
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Something went wrong while deleting the user",
      );
    }
  };

  return (
    <div className="table-wrapper">
      <h2>Users</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Operations</th>
          </tr>
        </thead>

        <tbody>
          {users
            .filter((user) => Number(user.group_id) !== 1)
            .map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>

                <td>{user.fullName}</td>

                <td>{user.name}</td>

                <td>{user.email}</td>

                <td>{"*".repeat(user.email.length)}</td>

                <td className="operations">
                  <button onClick={() => handleDeleteUser(user)}>Delete</button>

                  <button
                    onClick={() => {
                      console.log("Edit:", user);
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
