const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

const salt = 10;

// =========================
// JWT SECRET
// =========================

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.log("JWT_SECRET is missing from .env");
  process.exit(1);
}

// =========================
// MIDDLEWARE
// =========================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// =========================
// DATABASE
// =========================

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    minVersion: "TLSv1.2",
  },
});
db.connect((err) => {
  if (err) {
    console.log("Database Connection Error:", err);
    return;
  }

  console.log("Connected To MySQL");
});

// =========================
// SIGNUP
// =========================

app.post("/signup", (req, res) => {
  const { fullName, name, email, password } = req.body;

  // أي حساب جديد = User عادي
  const group_id = 0;

  if (!fullName || !name || !email || !password) {
    return res.status(400).json({
      message: "Please fill all required fields",
    });
  }

  const checkEmail = "SELECT * FROM login WHERE email = ?";

  db.query(checkEmail, [email], (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    if (result.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    bcrypt.hash(password.toString(), salt, (err, hash) => {
      if (err) {
        return res.status(500).json({
          message: "Error hashing password",
        });
      }

      const sql = `
        INSERT INTO login
        (fullName, name, email, password, group_id)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(sql, [fullName, name, email, hash, group_id], (err, result) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            message: "Error creating account",
          });
        }

        return res.status(201).json({
          Status: "Success",
          message: "Account created successfully",
          user: {
            id: result.insertId,
            fullName,
            name,
            email,
            group_id,
          },
        });
      });
    });
  });
});

// =========================
// LOGIN
// =========================

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // =========================
  // VALIDATION
  // =========================

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  // =========================
  // GET USER
  // =========================

  const sql = "SELECT * FROM login WHERE email = ?";

  db.query(sql, [email], (err, data) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Server Error",
      });
    }

    // Email not found
    if (data.length === 0) {
      return res.status(404).json({
        message: "Email does not exist",
      });
    }

    const user = data[0];

    // =========================
    // COMPARE PASSWORD
    // =========================

    bcrypt.compare(password.toString(), user.password, (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Error comparing password",
        });
      }

      // Wrong password
      if (!result) {
        return res.status(401).json({
          message: "Incorrect password",
        });
      }

      // =========================
      // CREATE JWT TOKEN
      // =========================

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,

          // مهم جدًا
          // نأخذ group_id من قاعدة البيانات
          group_id: Number(user.group_id),
        },
        JWT_SECRET,
        {
          expiresIn: "1d",
        },
      );

      // =========================
      // SAVE TOKEN IN COOKIE
      // =========================

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      // =========================
      // RESPONSE
      // =========================

      return res.status(200).json({
        Status: "Success",
        message: "Login successful",

        user: {
          id: user.id,
          fullName: user.fullName,
          name: user.name,
          email: user.email,
          group_id: Number(user.group_id),
        },
      });
    });
  });
});

// =========================
// VERIFY TOKEN MIDDLEWARE
// =========================

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  // =========================
  // NO TOKEN
  // =========================

  if (!token) {
    return res.status(401).json({
      message: "You are not authenticated",
    });
  }

  // =========================
  // VERIFY TOKEN
  // =========================

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: "Token is invalid or expired",
      });
    }

    // Save user data
    req.user = decoded;

    next();
  });
};

// =========================
// VERIFY ADMIN
// =========================

const verifyAdmin = (req, res, next) => {
  // 1 = Admin
  if (Number(req.user.group_id) !== 1) {
    return res.status(403).json({
      message: "Access denied. Admins only.",
    });
  }

  next();
};

// =========================
// GET USERS
// ADMIN ONLY
// =========================

app.get("/users", verifyToken, verifyAdmin, (req, res) => {
  const sql = `
      SELECT id, fullName, name, email, password, group_id
      FROM login
    `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: err.message,
      });
    }

    return res.status(200).json({
      users: result,
    });
  });
});

// =========================
// DELETE USER
// ADMIN ONLY
// =========================

app.delete("/users/:id", verifyToken, verifyAdmin, (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM login WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      Status: "Success",
      message: "User deleted successfully",
    });
  });
});

// =========================
// UPDATE USER
// ADMIN ONLY
// =========================

app.put("/users/:id", verifyToken, verifyAdmin, (req, res) => {
  console.log("BODY:", req.body);

  const { id } = req.params;

  const { fullName, name, email, group_id } = req.body;

  // =========================
  // VALIDATION
  // =========================

  if (!fullName || !name || !email) {
    return res.status(400).json({
      message: "Please fill all required fields",
    });
  }

  // group_id لازم يكون 0 أو 1
  const newGroupId = Number(group_id);

  if (newGroupId !== 0 && newGroupId !== 1) {
    return res.status(400).json({
      message: "Invalid group_id",
    });
  }

  // =========================
  // CHECK EMAIL
  // =========================

  const checkEmail = `
      SELECT *
      FROM login
      WHERE email = ? AND id != ?
    `;

  db.query(checkEmail, [email, id], (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    // Email already exists
    if (result.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // =========================
    // UPDATE USER
    // =========================

    const sql = `
          UPDATE login
          SET
            fullName = ?,
            name = ?,
            email = ?,
            group_id = ?
          WHERE id = ?
        `;

    db.query(sql, [fullName, name, email, newGroupId, id], (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Error updating user",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      console.log("Updated group_id =", newGroupId);

      return res.status(200).json({
        Status: "Success",
        message: "User updated successfully",
      });
    });
  });
});

// =========================
// LOGOUT
// =========================

app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  return res.status(200).json({
    Status: "Success",
    message: "Logged out successfully",
  });
});

// =========================
// CHECK AUTH
// =========================

app.get("/check-auth", verifyToken, (req, res) => {
  return res.status(200).json({
    Status: "Success",

    user: {
      id: req.user.id,
      email: req.user.email,
      group_id: Number(req.user.group_id),
    },
  });
});

// =========================
// SERVER
// =========================
const PORT = process.env.PORT || 8585;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server Running On Port ${PORT}`);
});
