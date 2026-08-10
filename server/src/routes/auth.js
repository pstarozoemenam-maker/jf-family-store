const express = require("express");
const db = require("../db");
const {
  hashPassword,
  isHashedPassword,
  verifyPassword,
} = require("../passwords");

const router = express.Router();

function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function isValidSignup(name, email, password) {
  return (
    typeof name === "string" && name.trim().length >= 2 &&
    email.length > 0 &&
    typeof password === "string" &&
    password.length >= 6
  );
}

router.post("/signup", async (req, res) => {
  const { name, password } = req.body || {};
  const email = normalizeEmail(req.body?.email);

  if (!isValidSignup(name, email, password)) {
    return res.status(400).json({
      success: false,
      message: "Enter a name, valid email, and password of at least 6 characters",
    });
  }

  try {
    const hashedPassword = await hashPassword(password);
    db.run(
      "INSERT INTO users(name,email,password) VALUES(?,?,?)",
      [name.trim(), email, hashedPassword],
      function handleSignup(error) {
        if (error) {
          if (error.message.includes("UNIQUE")) {
            return res.status(409).json({
              success: false,
              message: "Email already exists",
            });
          }

          console.error(error);
          return res.status(500).json({
            success: false,
            message: "Unable to create account",
          });
        }

        return res.status(201).json({ success: true });
      },
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to create account",
    });
  }
});

router.post("/login", async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  db.get(
    "SELECT id,name,email,password FROM users WHERE email=?",
    [email],
    async (error, row) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "Unable to log in",
        });
      }

      let passwordMatches = false;
      try {
        passwordMatches = await verifyPassword(password, row?.password);
      } catch (verificationError) {
        console.error(verificationError);
      }

      if (!row || !passwordMatches) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      if (!isHashedPassword(row.password)) {
        const upgradedPassword = await hashPassword(password);
        db.run("UPDATE users SET password=? WHERE id=?", [upgradedPassword, row.id]);
      }

      return res.json({
        success: true,
        user: { id: row.id, name: row.name, email: row.email },
      });
    },
  );
});

router.post("/change-password", async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const currentPassword = typeof req.body?.currentPassword === "string" ? req.body.currentPassword : "";
  const newPassword = typeof req.body?.newPassword === "string" ? req.body.newPassword : "";

  if (!email || !currentPassword || newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Email, current password, and a new password of at least 6 characters are required",
    });
  }

  db.get(
    "SELECT id,password FROM users WHERE email=?",
    [email],
    async (error, row) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "Unable to update password",
        });
      }

      if (!row) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      let passwordMatches = false;
      try {
        passwordMatches = await verifyPassword(currentPassword, row.password);
      } catch (verificationError) {
        console.error(verificationError);
      }

      if (!passwordMatches) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      try {
        const hashedPassword = await hashPassword(newPassword);
        db.run("UPDATE users SET password=? WHERE id=?", [hashedPassword, row.id], (updateError) => {
          if (updateError) {
            console.error(updateError);
            return res.status(500).json({
              success: false,
              message: "Unable to update password",
            });
          }

          return res.json({ success: true });
        });
      } catch (hashError) {
        console.error(hashError);
        return res.status(500).json({
          success: false,
          message: "Unable to update password",
        });
      }
    },
  );
});

module.exports = router;
