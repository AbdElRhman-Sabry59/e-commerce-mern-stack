// import axios from "axios";
// import { useEffect, useState } from "react";

// export const DeleteUsers = ({ user }) => {
//   const [userDeleted, setUserDeleted] = useState([]);
//   const handleDelete = async (user) => {
//     try {
//       const res = await axios.delete(`http://localhost:8585/users/${user.id}`);

//       alert(res.data.message);

//       // إعادة تحميل المستخدمين بعد الحذف
//       fetchUsers();
//     } catch (err) {
//       console.log(err);
//     }
//   };
//   console.log(userDeleted);
//   return <button onClick={() => handleDelete(user.id)}>Delete</button>;
// };
