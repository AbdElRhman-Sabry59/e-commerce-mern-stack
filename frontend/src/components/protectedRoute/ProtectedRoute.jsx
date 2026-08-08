import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const group_id = JSON.parse(localStorage.getItem("group_id"));

  if (!group_id) {
    return <Navigate to="/login" replace />;
  }

  if (group_id === "0") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
