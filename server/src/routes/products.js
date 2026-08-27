const express = require("express");
const db = require("../db");

const router = express.Router();

const VALID_CATEGORIES = ["Kitchen", "Electrical", "Lifestyle"];

function toClientProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    oldPrice: row.old_price == null ? null : Number(row.old_price),
    image: row.image,
    description: row.description,
    rating: row.rating == null ? 4.5 : Number(row.rating),
    reviews: row.reviews == null ? 0 : Number(row.reviews),
    badge: row.badge || null,
  };
}

function isValidProduct(body) {
  return (
    typeof body.name === "string" && body.name.trim() &&
    VALID_CATEGORIES.includes(body.category) &&
    Number.isFinite(Number(body.price)) && Number(body.price) >= 0
  );
}

router.get("/", (req, res) => {
  db.all("SELECT * FROM products ORDER BY id DESC", [], (error, rows) => {
    if (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Unable to load products",
      });
    }

    return res.json((rows || []).map(toClientProduct));
  });
});

router.post("/", (req, res) => {
  const body = req.body || {};

  if (!isValidProduct(body)) {
    return res.status(400).json({
      success: false,
      message: "Name, category, and a valid price are required",
    });
  }

  const oldPrice =
    body.oldPrice == null || body.oldPrice === ""
      ? null
      : Number(body.oldPrice);

  db.run(
    `INSERT INTO products
      (name, category, price, old_price, image, description, rating, reviews, badge)
      VALUES(?,?,?,?,?,?,?,?,?)`,
    [
      body.name.trim(),
      body.category,
      Number(body.price),
      oldPrice,
      body.image || "",
      body.description || "",
      Number(body.rating) || 4.5,
      Math.round(Number(body.reviews)) || 0,
      body.badge || null,
    ],
    function handleInsert(error) {
      if (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "Unable to add product",
        });
      }

      return res.status(201).json({
        success: true,
        product: {
          id: this.lastID,
          name: body.name.trim(),
          category: body.category,
          price: Number(body.price),
          oldPrice,
          image: body.image || "",
          description: body.description || "",
          rating: Number(body.rating) || 4.5,
          reviews: Math.round(Number(body.reviews)) || 0,
          badge: body.badge || null,
        },
      });
    },
  );
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isFinite(id)) {
    return res.status(400).json({ success: false, message: "Invalid product id" });
  }

  db.run("DELETE FROM products WHERE id=?", [id], (error) => {
    if (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Unable to delete product",
      });
    }

    return res.json({ success: true });
  });
});

module.exports = router;
