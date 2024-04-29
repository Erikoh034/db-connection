const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');


const app = express();

dotenv.config();
// Replace with your MySQL connection details
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database'
});

// Route to handle form submission
app.post('/submit-data', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;

  try {
    const connection = await pool.getConnection();
    const sql = `INSERT INTO users (name, email) VALUES (?, ?)`;
    const [results] = await connection.execute(sql, [name, email]);

    connection.release();
    res.send('Data saved successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving data!');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
