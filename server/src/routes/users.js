const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", (req, res) => {
  db.all(
    "SELECT id, name, email FROM users ORDER BY id DESC",
    [],
    (error, rows) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "Unable to load users",
        });
      }

      return res.json(rows || []);
    },
  );
});

module.exports = router;
