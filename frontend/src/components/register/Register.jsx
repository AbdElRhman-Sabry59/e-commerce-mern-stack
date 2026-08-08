import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";
import { useState, useRef } from "react";

function Register() {
  const navigate = useNavigate();

  const emailRef = useRef(null);
  const btnlRef = useRef(null);

  const [fullName, setFullName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Normal User
  const [group_id] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear Error
    if (emailRef.current) {
      emailRef.current.innerHTML = "";
    }

    // Validation
    if (
      fullName.trim() === "" ||
      name.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      emailRef.current.innerHTML = "You have to fill all data first!!";

      return;
    }

    try {
      const res = await axios.post(
        "https://e-commerce-mern-stack-production.up.railway.app/signup",
        {
          fullName,
          name,
          email,
          password,
          group_id,
        },
      );

      console.log(res.data);

      if (res.data.Status === "Success") {
        // Change Button Text
        btnlRef.current.innerHTML = "Successfully";

        // Clear Inputs
        setFullName("");
        setName("");
        setEmail("");
        setPassword("");

        // Navigate Login
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (err) {
      console.log(err);

      if (emailRef.current) {
        emailRef.current.innerHTML =
          err.response?.data?.message || "Something went wrong";
      }
    }
  };

  return (
    <div className="register">
      <div className="container">
        <section className="form-register">
          <h2>Create Account</h2>

          <form className="register" autoComplete="off" onSubmit={handleSubmit}>
            <label>Full Name</label>

            <input
              autoComplete="off"
              type="text"
              placeholder="Example: John Wick"
              onChange={(e) => setFullName(e.target.value)}
              name="fullName"
              value={fullName}
            />

            <label>Name</label>

            <input
              autoComplete="off"
              type="text"
              placeholder="Example: John"
              onChange={(e) => setName(e.target.value)}
              name="name"
              value={name}
            />

            <label>Email</label>

            <input
              autoComplete="off"
              type="email"
              placeholder="Example: john@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              value={email}
            />

            <span className="error" ref={emailRef}></span>

            <label>Password</label>

            <input
              autoComplete="new-password"
              type="password"
              placeholder="Example: Abc12345"
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              value={password}
            />

            <button ref={btnlRef} type="submit">
              Create Account
            </button>

            <p>
              Already have an account? <Link to="/">Login</Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Register;
