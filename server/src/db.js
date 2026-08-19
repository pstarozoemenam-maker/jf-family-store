const path = require("path");
const sqlite3 = require("sqlite3").verbose();

function createSqliteDatabase() {
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
  });

  return database;
}

function createPostgresDatabase() {
  const { Pool } = require("pg");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
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

module.exports = process.env.DATABASE_URL
  ? createPostgresDatabase()
  : createSqliteDatabase();
