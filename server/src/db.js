const path = require("path");

const DEFAULT_PRODUCTS = [
  {
    name: "ChefPro Studio Oven",
    category: "Kitchen",
    price: 145000,
    oldPrice: 170000,
    image: "/images/products/oven.jpg",
    description: "Fast, elegant multi-function oven.",
    rating: 4.8,
    reviews: 212,
    badge: "Hot",
  },
  {
    name: "Aura Smart Fridge",
    category: "Electrical",
    price: 320000,
    oldPrice: null,
    image: "/images/products/fridge.jpg",
    description: "Energy-saving smart fridge.",
    rating: 4.9,
    reviews: 158,
    badge: "New",
  },
  {
    name: "Glow LED Lighting Kit",
    category: "Lifestyle",
    price: 48000,
    oldPrice: 65000,
    image: "/images/products/light.jpg",
    description: "Modern ambient lighting.",
    rating: 4.5,
    reviews: 96,
    badge: "Sale",
  },
  {
    name: "Nova Blender Pro",
    category: "Kitchen",
    price: 76000,
    oldPrice: null,
    image: "/images/products/blender.jpg",
    description: "Powerful kitchen blender.",
    rating: 4.6,
    reviews: 134,
    badge: "Hot",
  },
  {
    name: "Luma Washing Machine",
    category: "Electrical",
    price: 280000,
    oldPrice: null,
    image: "/images/products/washer.jpg",
    description: "Quiet washing machine.",
    rating: 4.7,
    reviews: 87,
    badge: null,
  },
  {
    name: "PureAir Air Purifier",
    category: "Lifestyle",
    price: 94000,
    oldPrice: null,
    image: "/images/products/purifier.jpg",
    description: "Cleaner indoor air.",
    rating: 4.4,
    reviews: 73,
    badge: "New",
  },
];

function createSqliteDatabase() {
  const sqlite3 = require("sqlite3").verbose();
  const database = new sqlite3.Database(path.join(__dirname, "..", "store.db"));

  database.serialize(() => {
    database.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);

    database.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        payment TEXT NOT NULL,
        total REAL NOT NULL,
        items TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    database.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        old_price REAL,
        image TEXT,
        description TEXT,
        rating REAL,
        reviews INTEGER,
        badge TEXT
      )
    `);

    database.run(
      "INSERT OR IGNORE INTO users(name,email,password) VALUES(?,?,?)",
      ["Admin", "pstarozoemenam@gmail.com", "123456789"],
    );

    const insertProduct = database.prepare(`
      INSERT OR IGNORE INTO products
        (name, category, price, old_price, image, description, rating, reviews, badge)
      VALUES(?,?,?,?,?,?,?,?,?)
    `);
    DEFAULT_PRODUCTS.forEach((product) => {
      insertProduct.run(
        product.name,
        product.category,
        product.price,
        product.oldPrice,
        product.image,
        product.description,
        product.rating,
        product.reviews,
        product.badge,
      );
    });
    insertProduct.finalize();
  });

  return database;
}

function createPostgresDatabase() {
  const { Pool } = require("pg");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const ready = Promise.all([
    pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `),
    pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        payment TEXT NOT NULL,
        total DOUBLE PRECISION NOT NULL,
        items TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `),
    pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price DOUBLE PRECISION NOT NULL,
        old_price DOUBLE PRECISION,
        image TEXT,
        description TEXT,
        rating DOUBLE PRECISION,
        reviews INTEGER,
        badge TEXT
      )
    `),
    pool
      .query(
        "INSERT INTO users(name,email,password) VALUES($1,$2,$3) ON CONFLICT (email) DO NOTHING",
        ["Admin", "pstarozoemenam@gmail.com", "123456789"],
      )
      .catch(() => {}),
    Promise.all(
      DEFAULT_PRODUCTS.map((product) =>
        pool
          .query(
            `INSERT INTO products
              (name, category, price, old_price, image, description, rating, reviews, badge)
             VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
             ON CONFLICT (name) DO NOTHING`,
            [
              product.name,
              product.category,
              product.price,
              product.oldPrice,
              product.image,
              product.description,
              product.rating,
              product.reviews,
              product.badge,
            ],
          )
          .catch(() => {}),
      ),
    ),
  ]);

  function query(sql, params, callback) {
    let parameterNumber = 0;
    const postgresSql = sql.replace(/\?/g, () => `$${++parameterNumber}`);
    const values = params || [];
    const insertSql = /^\s*INSERT\s/i.test(sql) && !/\bRETURNING\b/i.test(sql)
      ? `${postgresSql} RETURNING id`
      : postgresSql;

    ready
      .then(() => pool.query(insertSql, values))
      .then((result) => {
        const context = { lastID: result.rows[0]?.id };
        callback.call(context, null, result.rows);
      })
      .catch((error) => callback(error));
  }

  return {
    run(sql, params, callback) {
      query(sql, params, callback || (() => {}));
    },
    get(sql, params, callback) {
      query(sql, params, (error, rows) => callback(error, rows?.[0]));
    },
    all(sql, params, callback) {
      query(sql, params, callback);
    },
  };
}

function createMemoryDatabase() {
  const users = [];
  const orders = [];
  const products = DEFAULT_PRODUCTS.map((product, index) => ({
    id: index + 1,
    ...product,
  }));
  let nextUserId = 1;
  let nextOrderId = 1;
  let nextProductId = products.length + 1;

  users.push({
    id: nextUserId++,
    name: "Admin",
    email: "pstarozoemenam@gmail.com",
    password: "123456789",
  });

  return {
    run(sql, params, callback = () => {}) {
      if (/INSERT INTO users/i.test(sql)) {
        const [name, email, password] = params;
        if (users.some((user) => user.email === email)) {
          return callback(new Error("UNIQUE constraint failed: users.email"));
        }
        const user = { id: nextUserId++, name, email, password };
        users.push(user);
        return callback.call({ lastID: user.id }, null);
      }

      if (/INSERT INTO orders/i.test(sql)) {
        const [customerName, email, phone, address, payment, total, items] = params;
        const order = {
          id: nextOrderId++,
          customer_name: customerName,
          email,
          phone,
          address,
          payment,
          total,
          items,
        };
        orders.push(order);
        return callback.call({ lastID: order.id }, null);
      }

      if (/INSERT INTO products/i.test(sql)) {
        const [name, category, price, oldPrice, image, description, rating, reviews, badge] = params;
        const product = {
          id: nextProductId++,
          name,
          category,
          price,
          oldPrice,
          image,
          description,
          rating,
          reviews,
          badge,
        };
        products.push(product);
        return callback.call({ lastID: product.id }, null);
      }

      if (/DELETE FROM products/i.test(sql)) {
        const [id] = params;
        const index = products.findIndex((entry) => entry.id === Number(id));
        if (index !== -1) products.splice(index, 1);
      }

      if (/UPDATE users SET password/i.test(sql)) {
        const [password, id] = params;
        const user = users.find((entry) => entry.id === id);
        if (user) user.password = password;
      }

      return callback(null);
    },
    get(sql, params, callback) {
      const user = users.find((entry) => entry.email === params[0]);
      callback(null, user);
    },
    all(sql, params, callback) {
      if (/FROM users/i.test(sql)) {
        return callback(null, [...users].reverse());
      }
      if (/FROM products/i.test(sql)) {
        return callback(null, [...products].reverse());
      }
      callback(null, [...orders].reverse());
    },
  };
}

module.exports = process.env.DATABASE_URL
  ? createPostgresDatabase()
  : process.env.VERCEL
    ? createMemoryDatabase()
  : createSqliteDatabase();
