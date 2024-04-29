const express = require("express");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const path = require("path");

const app = express();

dotenv.config();

const port = process.env.PORT || 3000;
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route to handle form submission
app.post("/submit-data", async (req, res) => {
  console.log(req.body);
  const name = req.body.name;
  const email = req.body.email;

  try {
    const connection = await pool.getConnection();
    const sql = `INSERT INTO users (name, email) VALUES (?, ?)`;
    const [results] = await connection.execute(sql, [name, email]);

    connection.release();
    res.send("Data saved successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving data!");
  }
});

app.listen(port, () => {
  console.log(`Go to http://localhost:3000 in your browser`);
});
