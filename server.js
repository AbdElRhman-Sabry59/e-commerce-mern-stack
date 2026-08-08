const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

const salt = 10;

// ==================================================
// JWT SECRET
// ==================================================

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.log("JWT_SECRET is missing");
  process.exit(1);
}

// ==================================================
// TRUST PROXY
// مهم مع Railway
// ==================================================

app.set("trust proxy", 1);

// ==================================================
// CORS
// ==================================================

const allowedOrigins = [
  "http://localhost:5173",

  // لو الـ Frontend منشور على Railway
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // السماح للطلبات بدون origin مثل Postman
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,
  }),
);

// ==================================================
// MIDDLEWARE
// ==================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ==================================================
// DATABASE
// ==================================================

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),

  ssl: {
    rejectUnauthorized: false,
  },
});

// ==================================================
// DATABASE CONNECTION
// ==================================================

db.connect((err) => {
  if (err) {
    console.log("Database Connection Error:", err);
    return;
  }

  console.log("Connected To MySQL");
});

// ==================================================
// SIGNUP
// ==================================================

app.post("/signup", (req, res) => {
  const { fullName, name, email, password } = req.body;

  // أي حساب جديد User عادي
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
        console.log(err);

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

// ==================================================
// LOGIN
// ==================================================

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const sql = "SELECT * FROM login WHERE email = ?";

  db.query(sql, [email], (err, data) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Server Error",
      });
    }

    if (data.length === 0) {
      return res.status(404).json({
        message: "Email does not exist",
      });
    }

    const user = data[0];

    bcrypt.compare(password.toString(), user.password, (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Error comparing password",
        });
      }

      if (!result) {
        return res.status(401).json({
          message: "Incorrect password",
        });
      }

      // ==================================================
      // CREATE JWT
      // ==================================================

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          group_id: Number(user.group_id),
        },
        JWT_SECRET,
        {
          expiresIn: "1d",
        },
      );

      // ==================================================
      // COOKIE
      // ==================================================

      const isProduction = process.env.NODE_ENV === "production";

      res.cookie("token", token, {
        httpOnly: true,

        // في Production HTTPS
        secure: isProduction,

        // لو الـ Frontend والـ Backend على دومينات مختلفة
        sameSite: isProduction ? "none" : "lax",

        maxAge: 24 * 60 * 60 * 1000,
      });

      // ==================================================
      // RESPONSE
      // ==================================================

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

// ==================================================
// VERIFY TOKEN
// ==================================================

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "You are not authenticated",
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: "Token is invalid or expired",
      });
    }

    req.user = decoded;

    next();
  });
};

// ==================================================
// VERIFY ADMIN
// ==================================================

const verifyAdmin = (req, res, next) => {
  if (Number(req.user.group_id) !== 1) {
    return res.status(403).json({
      message: "Access denied. Admins only.",
    });
  }

  next();
};

// ==================================================
// GET USERS
// ADMIN ONLY
// ==================================================

app.get("/users", verifyToken, verifyAdmin, (req, res) => {
  const sql = `
    SELECT id, fullName, name, email, group_id
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

// ==================================================
// DELETE USER
// ADMIN ONLY
// ==================================================

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

// ==================================================
// UPDATE USER
// ADMIN ONLY
// ==================================================

app.put("/users/:id", verifyToken, verifyAdmin, (req, res) => {
  console.log("BODY:", req.body);

  const { id } = req.params;

  const { fullName, name, email, group_id } = req.body;

  // ==================================================
  // VALIDATION
  // ==================================================

  if (!fullName || !name || !email) {
    return res.status(400).json({
      message: "Please fill all required fields",
    });
  }

  const newGroupId = Number(group_id);

  if (newGroupId !== 0 && newGroupId !== 1) {
    return res.status(400).json({
      message: "Invalid group_id",
    });
  }

  // ==================================================
  // CHECK EMAIL
  // ==================================================

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

    if (result.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // ==================================================
    // UPDATE USER
    // ==================================================

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

// ==================================================
// LOGOUT
// ==================================================

app.post("/logout", (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  return res.status(200).json({
    Status: "Success",
    message: "Logged out successfully",
  });
});

// ==================================================
// CHECK AUTH
// ==================================================

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

// ==================================================
// ROOT
// ==================================================

app.get("/", (req, res) => {
  res.json({
    message: "Backend is running successfully",
  });
});

// ==================================================
// SERVER
// ==================================================

const PORT = process.env.PORT || 8585;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server Running On Port ${PORT}`);
});
