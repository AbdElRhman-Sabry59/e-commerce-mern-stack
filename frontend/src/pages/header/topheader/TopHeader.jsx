import { Link, useLocation, useNavigate } from "react-router-dom";
import "./TopHeader.css";
import { Fragment, useState } from "react";
import axios from "axios";
import { ClockFading } from "lucide-react";
import logo from "../../../assets/images/logo.svg";
const TopHeader = () => {
  const url = useLocation().pathname;

  const [path, setPath] = useState(url);

  const navigate = useNavigate();
  const pathLocation = useLocation().pathname;
  const isLoggedIn = localStorage.getItem("email");

  const fullName = localStorage.getItem("fullName") || "";

  const groupId = localStorage.getItem("group_id");

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8585/logout",
        {},
        {
          withCredentials: true,
        },
      );

      if (res.data.Status === "Success") {
        // Clear LocalStorage
        localStorage.clear();

        // Go To Login
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };
  console.log(logo);
  return (
    <div className="header">
      <div className="container">
        <section className="headrer_section">
          <div
            style={{
              cursor: "pointer",
              width: "300px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="logo"
          >
            <img src={logo} alt="" />
          </div>

          <ul className="loging">
            {!isLoggedIn ? (
              <>
                {/* LOGIN */}

                <li
                  onClick={() => {
                    setPath("/");
                  }}
                  className={path === "/" ? "active" : ""}
                >
                  <Link to="/">Login</Link>
                </li>

                {/* REGISTER */}

                <li
                  onClick={() => {
                    setPath("/register");
                  }}
                  className={path === "/register" ? "active" : ""}
                >
                  <Link to="/register">Register</Link>
                </li>
              </>
            ) : (
              <div
                className="logout"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "0 40px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div className="welcome">
                  {groupId === "1" ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        gap: "30px",
                        alignItems: "center",
                      }}
                    >
                      <h3>Admin: {fullName}</h3>
                      <a
                        href="/dashboard"
                        style={{
                          backgroundColor:
                            pathLocation === "/dashboard" ? "#0d6efd" : "",
                          color:
                            pathLocation === "/dashboard" ? "snow" : "#000",
                          padding:
                            pathLocation === "/dashboard" ? "10px" : "10px",
                          borderRadius:
                            pathLocation === "/dashboard" ? "10px" : "10px",
                        }}
                      >
                        Dashboard
                      </a>
                    </div>
                  ) : (
                    `User: ${fullName.toUpperCase()}`
                  )}
                </div>

                {/* LOGOUT */}

                <li className="active" onClick={handleLogout}>
                  <button
                    type="button"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      font: "inherit",
                    }}
                  >
                    Logout
                  </button>
                </li>
              </div>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default TopHeader;
