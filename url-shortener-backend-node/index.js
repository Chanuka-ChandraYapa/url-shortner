const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Initialize the app and middleware
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://url-shortner-fhlmt9rlt-chanuka-lakshans-projects.vercel.app",
    ],
  })
);
app.use(bodyParser.json());

// Initialize the database
const db = new sqlite3.Database(path.resolve(__dirname, "urls.db"), (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
    db.run(
      "CREATE TABLE IF NOT EXISTS urls (id INTEGER PRIMARY KEY, long_url TEXT, short_url TEXT)"
    );
  }
});

// Helper to generate a short URL
const generateShortURL = (id) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const base = chars.length;
  let shortURL = "";

  while (id > 0) {
    shortURL = chars[id % base] + shortURL;
    id = Math.floor(id / base);
  }

  return shortURL;
};

// Route to shorten a URL
app.post("/shorten", (req, res) => {
  const { long_url: longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: "Invalid input" });
  }

  db.get("SELECT COUNT(*) as count FROM urls", (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    const shortUrl = generateShortURL(row.count);

    db.run(
      "INSERT INTO urls (long_url, short_url) VALUES (?, ?)",
      [longUrl, shortUrl],
      function (err) {
        if (err) {
          return res.status(500).json({ error: "Failed to save URL" });
        }

        res.json({ short_url: shortUrl });
      }
    );
  });
});

// Route to expand a short URL
app.get("/expand/:shortURL", (req, res) => {
  const { shortURL } = req.params;

  db.get(
    "SELECT long_url FROM urls WHERE short_url = ?",
    [shortURL],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      if (!row) {
        return res.status(404).json({ error: "URL not found" });
      }

      res.json({ long_url: row.long_url });
    }
  );
});

// Route to redirect to the original URL
app.get("/sh/:shortURL", (req, res) => {
  const { shortURL } = req.params;

  db.get(
    "SELECT long_url FROM urls WHERE short_url = ?",
    [shortURL],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      if (!row) {
        return res.status(404).json({ error: "URL not found" });
      }

      const longUrl =
        row.long_url.startsWith("http://") ||
        row.long_url.startsWith("https://")
          ? row.long_url
          : `http://${row.long_url}`;

      res.redirect(301, longUrl);
    }
  );
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
