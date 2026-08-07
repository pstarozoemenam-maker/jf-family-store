const express = require("express");
const db = require("../db");

const router = express.Router();

function isValidOrder(order) {
  return (
    typeof order.customerName === "string" && order.customerName.trim() &&
    typeof order.email === "string" && order.email.trim() &&
    typeof order.phone === "string" && order.phone.trim() &&
    typeof order.address === "string" && order.address.trim() &&
    typeof order.payment === "string" && order.payment.trim() &&
    Number.isFinite(Number(order.total)) && Number(order.total) >= 0 &&
    Array.isArray(order.items) && order.items.length > 0
  );
}

router.post("/", (req, res) => {
  const order = req.body || {};

  if (!isValidOrder(order)) {
    return res.status(400).json({
      success: false,
      message: "Complete order details are required",
    });
  }

  db.run(
    `INSERT INTO orders
      (customer_name,email,phone,address,payment,total,items)
      VALUES(?,?,?,?,?,?,?)`,
    [
      order.customerName.trim(),
      order.email.trim().toLowerCase(),
      order.phone.trim(),
      order.address.trim(),
      order.payment.trim(),
      Number(order.total),
      JSON.stringify(order.items),
    ],
    function handleOrder(error) {
      if (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "Unable to place order",
        });
      }

      return res.status(201).json({
        success: true,
        orderId: this.lastID,
      });
    },
  );
});

router.get("/", (req, res) => {
  db.all("SELECT * FROM orders ORDER BY id DESC", [], (error, rows) => {
    if (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Unable to load orders",
      });
    }

    return res.json(rows);
  });
});

module.exports = router;
