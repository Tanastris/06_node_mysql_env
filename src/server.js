const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();

const PORT = 3000;

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'type19_db',
};

// Middleware
app.use(morgan('dev'));

app.get('/', function (req, res) {
  res.send('Hello World');
});

// GET - /api/posts - grazins visus postus
app.get('/api/posts', async (req, res) => {
  try {
    // prisijungti prie DB
    const conn = await mysql.createConnection(dbConfig);
    // atlikti veikma
    const sql = 'SELECT * FROM `posts`';
    const [rows] = await conn.query(sql);
    // grazinti duomenis
    res.json(rows);
  } catch (error) {
    console.log(error);
    console.log('klaida get posts');
    res.status(500).json({
      msg: 'Something went wrong',
    });
  } finally {
    // atsijungti nuo DB
    if (conn) conn.end();
  }
});

// GET - /api/posts/5 - grazins 5 posta
app.get('/api/posts/:pId', async (req, res) => {
  try {
    const pId = +req.params.pId;
    // prisijungti prie DB
    const conn = await mysql.createConnection(dbConfig);
    const sql = 'SELECT * FROM `posts` WHERE `post_id`=?';
    // atlikti veikma
    const [rows] = await conn.execute(
      'SELECT * FROM `posts` WHERE `post_id`=?',
      [pId]
    );
    console.log('rows ===', rows);
    // ar radom tik viena irasa
    if (rows.length === 1) {
      res.json(rows[0]);
      return;
    }
    // TODO: proper chekc
    res.json('no posts');
  } catch (error) {
    console.log(error);
    console.log('klaida get sigle posts');
    res.status(500).json({
      msg: 'Something went wrong',
    });
  }
});

app.listen(PORT, () =>
  console.log(`Server runing on http://localhost:${PORT}`)
);
