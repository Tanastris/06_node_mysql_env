const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();

const PORT = 3000;

// Middleware
app.use(morgan('dev'));
app.use(cors());

app.get('/', function (req, res) {
  res.send('Hello World');
});
//  GET - /api/posts -grazins visus postus
app.get('/api/posts', async (req, res) => {
  try {
    // prisijungti prie DB
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'type19_db',
    });
    // atlikti veksma
    const sql = 'SELECT * FROM `posts`';
    const [rows, fields] = await conn.query(sql);
    console.log('rows ===', rows);
    // grazinti duomenis
    res.json(rows);
    // atsijungti nuo DB
  } catch (error) {
    console.log('error ===', error);
    console.log(' klaida get posts');
    res.status(500).json({
      msg: 'Something went wrong',
    });
  } finally {
    if (conn) conn.end();
  }
});

// Get - /api/posts/5 grazins 5 posta
app.get('/api/posts/:pId', (req, res) => {
  try {
    res.json('get single post');
  } catch (error) {
    console.log('error ===', error);
    console.log(' klaida get posts');
    res.status(500).json({
      msg: 'Something went wrong',
    });
  }
});
app.listen(PORT, () => {
  `Server running on http://localhost:${PORT}`;
});
