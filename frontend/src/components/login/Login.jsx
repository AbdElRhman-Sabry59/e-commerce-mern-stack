import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const errorRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear Error
    if (errorRef.current) {
      errorRef.current.innerHTML = "";
    }

    // Validation
    if (!email.trim() || !password.trim()) {
      errorRef.current.innerHTML = "Please enter email and password";

      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );

      console.log(res.data);

      if (res.data.Status === "Success") {
        // Save User Data
        localStorage.setItem("fullName", res.data.user.fullName);

        localStorage.setItem("email", res.data.user.email);

        localStorage.setItem("group_id", res.data.user.group_id);
        console.log(res.data.user);
        // Admin
        if (Number(res.data.user.group_id) === 1) {
          // navigate("/dashboard");
          window.location.href = "/dashboard";
        }

        // Normal User
        else {
          // navigate("/home");
          window.location.href = "/home";
        }
      }
    } catch (err) {
      console.log(err);

      if (errorRef.current) {
        errorRef.current.innerHTML =
          err.response?.data?.message || "Login Failed";
      }
    }
  };

  return (
    <div className="login">
      <div className="container">
        <section className="log-section">
          <h2>Login</h2>

          <form
            className="loginn-form"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              name="email"
              autoComplete="new-email"
              placeholder="Example: john@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="Example: Abc12345"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              ref={errorRef}
              style={{
                color: "red",
                marginTop: "10px",
                display: "block",
                minHeight: "20px",
              }}
            ></span>

            <button type="submit">Login</button>
          </form>

          <p>
            Don't have an account? <Link to="/register">Create Account</Link>
          </p>
        </section>
      </div>
    </div>
  );
};
