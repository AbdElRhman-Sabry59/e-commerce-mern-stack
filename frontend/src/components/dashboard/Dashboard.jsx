import { Link, Outlet, useLocation } from "react-router-dom";
import "./Dashboard.css";
import { useState } from "react";
import Users from "./users/Users";
export const Dashboard = () => {
  const pathLocation = useLocation();

  return (
    <div className="daschboard">
      <div className="left-sdie">
        <ul>
          <li
            className={pathLocation.pathname === "/dashboard" ? "active" : ""}
          >
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li
            className={
              pathLocation.pathname === "/dashboard/users" ? "active" : ""
            }
          >
            <Link to="users">Users</Link>
          </li>
          <li
            className={
              pathLocation.pathname === "/dashboard/admins" ? "active" : ""
            }
          >
            <Link to="admins">Admins</Link>
          </li>
        </ul>
      </div>
      <div className="right-side">
        <Outlet />
      </div>
    </div>
  );
};
