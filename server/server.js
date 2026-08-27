const path = require("path");
try {
  process.loadEnvFile(path.join(__dirname, ".env"));
} catch {
  // No local .env file (e.g. on Vercel); env vars come from the dashboard.
}

const app = require("./src/app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
