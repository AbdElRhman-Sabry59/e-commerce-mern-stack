// import { useEffect, useState } from "react";
// import "./Users.css";
// import axios from "axios";

// export default function Users() {
//   const [users, setUsers] = useState([]);

//   // =========================
//   // GET USERS
//   // =========================
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await axios.get(
//           "https://e-commerce-mern-stack-production.up.railway.app/users",
//           {
//             withCredentials: true,
//           },
//         );

//         // console.log("Users:", res.data.users);

//         setUsers(res.data.users);
//       } catch (err) {
//         console.log(err);

//         if (err.response?.status === 401) {
//           alert("You are not authenticated");
//         }

//         if (err.response?.status === 403) {
//           alert("Your session has expired");
//         }
//       }
//     };

//     fetchUsers();
//   }, []);

//   // =========================
//   // DELETE USER
//   // =========================
//   const handleDeleteUser = async (user) => {
//     const confirmDelete = window.confirm(
//       `Are you sure you want to delete ${user.fullName}?`,
//     );

//     if (!confirmDelete) {
//       return;
//     }

//     try {
//       const res = await axios.delete(
//         `https://e-commerce-mern-stack-production.up.railway.app/users/${user.id}`,
//         {
//           withCredentials: true,
//         },
//       );

//       console.log(res.data);

//       // حذف المستخدم من الواجهة مباشرة
//       setUsers((prevUsers) => prevUsers.filter((item) => item.id !== user.id));

//       alert("User deleted successfully");
//     } catch (err) {
//       console.log(err);

//       alert(
//         err.response?.data?.message ||
//           "Something went wrong while deleting the user",
//       );
//     }
//   };

//   return (
//     <div className="table-wrapper">
//       <h2>Users</h2>

//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Full Name</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Password</th>
//             <th>Operations</th>
//           </tr>
//         </thead>

//         <tbody>
//           {users
//             .filter((user) => Number(user.group_id) !== 1)
//             .map((user) => (
//               <tr key={user.id}>
//                 <td>{user.id}</td>

//                 <td>{user.fullName}</td>

//                 <td>{user.name}</td>

//                 <td>{user.email}</td>

//                 <td>{"*".repeat(user.email.length)}</td>

//                 <td className="operations">
//                   <button onClick={() => handleDeleteUser(user)}>Delete</button>

//                   <button
//                     onClick={() => {
//                       console.log("Edit:", user);
//                     }}
//                   >
//                     Edit
//                   </button>
//                 </td>
//               </tr>
//             ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
// import { useEffect, useState } from "react";
// import "./Users.css";
// import axios from "axios";

// const API_URL = "https://e-commerce-mern-stack-production.up.railway.app";

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // =========================
//   // GET USERS
//   // =========================
//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/users`, {
//         withCredentials: true,
//       });

//       setUsers(res.data.users || []);
//     } catch (err) {
//       console.log(err);

//       if (err.response?.status === 401) {
//         alert("You are not authenticated");
//       }

//       if (err.response?.status === 403) {
//         alert(err.response?.data?.message || "Access denied. Admins only.");
//       }
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // =========================
//   // DELETE USER
//   // =========================
//   const handleDeleteUser = async (user) => {
//     const confirmDelete = window.confirm(
//       `Are you sure you want to delete ${user.fullName}?`,
//     );

//     if (!confirmDelete) {
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await axios.delete(`${API_URL}/users/${user.id}`, {
//         withCredentials: true,
//       });

//       console.log(res.data);

//       setUsers((prevUsers) => prevUsers.filter((item) => item.id !== user.id));

//       alert("User deleted successfully");
//     } catch (err) {
//       console.log(err);

//       alert(
//         err.response?.data?.message ||
//           "Something went wrong while deleting the user",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================
//   // CHANGE GROUP ID
//   // =========================
//   const handleChangeGroup = async (user, newGroupId) => {
//     const oldGroupId = Number(user.group_id);
//     const groupId = Number(newGroupId);

//     if (oldGroupId === groupId) {
//       return;
//     }

//     try {
//       setLoading(true);

//       await axios.put(
//         `${API_URL}/users/${user.id}`,
//         {
//           fullName: user.fullName,
//           name: user.name,
//           email: user.email,
//           group_id: groupId,
//         },
//         {
//           withCredentials: true,
//         },
//       );

//       // تحديث الواجهة مباشرة
//       setUsers((prevUsers) =>
//         prevUsers.map((item) =>
//           item.id === user.id
//             ? {
//                 ...item,
//                 group_id: groupId,
//               }
//             : item,
//         ),
//       );

//       alert(
//         groupId === 1
//           ? `${user.fullName} is now an Admin`
//           : `${user.fullName} is now a User`,
//       );
//     } catch (err) {
//       console.log(err);

//       alert(
//         err.response?.data?.message ||
//           "Something went wrong while changing user type",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="table-wrapper">
//       <h2>Users</h2>

//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Full Name</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Group ID</th>
//             <th>User Type</th>
//             <th>Password</th>
//             <th>Operations</th>
//           </tr>
//         </thead>

//         <tbody>
//           {users
//             .filter((user) => Number(user.group_id) !== 1)
//             .map((user) => (
//               <tr key={user.id}>
//                 <td>{user.id}</td>

//                 <td>{user.fullName}</td>

//                 <td>{user.name}</td>

//                 <td>{user.email}</td>

//                 {/* GROUP ID */}
//                 <td>{Number(user.group_id)}</td>

//                 {/* CHANGE USER TYPE */}
//                 <td>
//                   <select
//                     value={Number(user.group_id)}
//                     onChange={(e) => handleChangeGroup(user, e.target.value)}
//                     disabled={loading}
//                   >
//                     <option value={0}>User</option>
//                     <option value={1}>Admin</option>
//                   </select>
//                 </td>

//                 {/* PASSWORD */}
//                 <td>{"*".repeat(user.email.length)}</td>

//                 {/* OPERATIONS */}
//                 <td className="operations">
//                   <button
//                     onClick={() => handleDeleteUser(user)}
//                     disabled={loading}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import "./Users.css";
import axios from "axios";

const API_URL = "https://e-commerce-mern-stack-production.up.railway.app";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // GET USERS
  // =========================

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`, {
        withCredentials: true,
      });

      setUsers(res.data.users || []);
    } catch (err) {
      console.log(err);

      if (err.response?.status === 401) {
        alert("You are not authenticated");
      }

      if (err.response?.status === 403) {
        alert(err.response?.data?.message || "Access denied. Admins only.");
      }
    }
  };

  useEffect(() => {
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
      setLoading(true);

      await axios.delete(`${API_URL}/users/${user.id}`, {
        withCredentials: true,
      });

      setUsers((prevUsers) => prevUsers.filter((item) => item.id !== user.id));

      alert("User deleted successfully");
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Something went wrong while deleting the user",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CHANGE USER / ADMIN
  // =========================

  const handleChangeGroup = async (user, newGroupId) => {
    const groupId = Number(newGroupId);

    if (groupId === Number(user.group_id)) {
      return;
    }

    try {
      setLoading(true);

      await axios.put(
        `${API_URL}/users/${user.id}`,
        {
          fullName: user.fullName,
          name: user.name,
          email: user.email,
          group_id: groupId,
        },
        {
          withCredentials: true,
        },
      );

      setUsers((prevUsers) =>
        prevUsers.map((item) =>
          item.id === user.id
            ? {
                ...item,
                group_id: groupId,
              }
            : item,
        ),
      );

      alert(
        groupId === 1
          ? `${user.fullName} is now an Admin`
          : `${user.fullName} is now a User`,
      );
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Failed to change user type");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CHANGE PASSWORD
  // =========================

  const handleChangePassword = async (user) => {
    const newPassword = window.prompt(
      `Enter new password for ${user.fullName}:`,
    );

    if (newPassword === null) {
      return;
    }

    if (!newPassword.trim()) {
      alert("Password cannot be empty");
      return;
    }

    if (newPassword.trim().length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await axios.put(
        `${API_URL}/users/${user.id}`,
        {
          fullName: user.fullName,
          name: user.name,
          email: user.email,
          group_id: Number(user.group_id),
          password: newPassword.trim(),
        },
        {
          withCredentials: true,
        },
      );

      alert("Password changed successfully");
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
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
            <th>Group ID</th>
            <th>User Type</th>
            <th>Password</th>
            <th>Operations</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>

              <td>{user.fullName}</td>

              <td>{user.name}</td>

              <td>{user.email}</td>

              {/* GROUP ID */}
              <td>{Number(user.group_id)}</td>

              {/* USER / ADMIN */}
              <td>
                <select
                  value={Number(user.group_id)}
                  onChange={(e) => handleChangeGroup(user, e.target.value)}
                  disabled={loading}
                >
                  <option value={0}>User</option>
                  <option value={1}>Admin</option>
                </select>
              </td>

              {/* PASSWORD */}
              <td>********</td>

              {/* OPERATIONS */}
              <td className="operations">
                <button
                  onClick={() => handleChangePassword(user)}
                  disabled={loading}
                >
                  Change Password
                </button>

                <button
                  onClick={() => handleDeleteUser(user)}
                  disabled={loading}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
