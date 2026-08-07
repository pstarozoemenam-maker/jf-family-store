const {
  randomBytes,
  scrypt,
  timingSafeEqual,
} = require("crypto");
const { promisify } = require("util");

const deriveKey = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const key = await deriveKey(password, salt, 64);
  return `${salt}:${key.toString("hex")}`;
}

async function verifyPassword(password, storedPassword) {
  if (!storedPassword) return false;

  if (!storedPassword.includes(":")) {
    return storedPassword === password;
  }

  const [salt, storedKey] = storedPassword.split(":");
  if (!salt || !storedKey) return false;

  const key = await deriveKey(password, salt, 64);
  const storedKeyBuffer = Buffer.from(storedKey, "hex");
  return (
    storedKeyBuffer.length === key.length &&
    timingSafeEqual(storedKeyBuffer, key)
  );
}

function isHashedPassword(password) {
  return typeof password === "string" && password.includes(":");
}

module.exports = {
  hashPassword,
  isHashedPassword,
  verifyPassword,
};
