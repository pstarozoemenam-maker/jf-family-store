const express = require("express");
const path = require("path");
const authRouter = require("./routes/auth");
const ordersRouter = require("./routes/orders");
const productsRouter = require("./routes/products");
const usersRouter = require("./routes/users");

const app = express();
const clientDistPath = path.join(__dirname, "..", "..", "client", "dist");

app.use(express.json({ limit: "1mb" }));
app.use(express.static(clientDistPath));

app.use("/api/products", productsRouter);
app.use("/api", authRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/users", usersRouter);

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

module.exports = app;
