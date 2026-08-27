const path = require("path");

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

    database.run(
      "INSERT OR IGNORE INTO users(name,email,password) VALUES(?,?,?)",
      ["Admin", "pstarozoemenam@gmail.com", "123456789"],
    );
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
    pool
      .query(
        "INSERT INTO users(name,email,password) VALUES($1,$2,$3) ON CONFLICT (email) DO NOTHING",
        ["Admin", "pstarozoemenam@gmail.com", "123456789"],
      )
      .catch(() => {}),
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
  let nextUserId = 1;
  let nextOrderId = 1;

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
      callback(null, [...orders].reverse());
    },
  };
}

module.exports = process.env.DATABASE_URL
  ? createPostgresDatabase()
  : process.env.VERCEL
    ? createMemoryDatabase()
  : createSqliteDatabase();
