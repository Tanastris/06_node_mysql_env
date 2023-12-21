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
// GET - /api/admin/create-table - sukuria lentele
app.get('/api/admin/create-table', async (req, res) => {
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    const sql = `CREATE TABLE posts 
    (post_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
     title VARCHAR(255) NOT NULL, 
     author VARCHAR(255) NOT NULL, 
     date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP, 
     body TEXT NOT NULL, 
     PRIMARY KEY (post_id)) ENGINE = InnoDB;`;
    const [rows] = await conn.query(sql);
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

// GET - http://localhost:3000/api/admin/populate-posts-table uzpildys  postais

// GET - /api/posts - grazins visus postus
app.get('/api/posts', async (req, res) => {
  let conn;
  try {
    // prisijungti prie DB
    conn = await mysql.createConnection(dbConfig);
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
  let conn;
  try {
    const pId = +req.params.pId;
    // prisijungti prie DB
    conn = await mysql.createConnection(dbConfig);
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
  } finally {
    // atsijungti nuo DB
    if (conn) conn.end();
  }
});

app.listen(PORT, () =>
  console.log(`Server runing on http://localhost:${PORT}`)
);
