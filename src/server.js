require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mysql = require('mysql2/promise');
const dbConfig = require('./config');

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(morgan('dev'));
// igalinti json duomenis
app.use(express.json());

app.get('/', function (req, res) {
  res.send('Hello World');
});

// GET - /api/admin/create-table - sukuria lentele
app.get('/api/admin/create-table', async (req, res) => {
  let conn;
  try {
    // prisijungti prie DB
    conn = await mysql.createConnection(dbConfig);
    const sql = `CREATE TABLE posts 
    (
      post_id INT UNSIGNED NOT NULL AUTO_INCREMENT, 
      title VARCHAR(255) NOT NULL, 
      author VARCHAR(255) NOT NULL, 
      date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP, 
      body TEXT NOT NULL, 
      PRIMARY KEY (post_id)
    ) ENGINE = InnoDB;`;
    const [rows] = await conn.query(sql);
    // supildom lentele
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

// sujungi sukurima ir supildyma i viena /api/admin/init
app.get('/api/admin/init', async (req, res) => {
  let conn;
  try {
    // prisijungti prie DB
    conn = await mysql.createConnection(dbConfig);
    const sql = `CREATE TABLE IF NOT EXISTS posts 
    (
      post_id INT UNSIGNED NOT NULL AUTO_INCREMENT, 
      title VARCHAR(255) NOT NULL, 
      author VARCHAR(255) NOT NULL, 
      date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP, 
      body TEXT NOT NULL, 
      PRIMARY KEY (post_id)
    ) ENGINE = InnoDB;`;
    // sukuriu lentele
    const [rowsAfterCreate] = await conn.query(sql);
    // supildom lentele
    const sqlPopulate = `INSERT INTO posts (title, author, date, body) VALUES
    ('Post 1', 'James Band', '2023-12-20', 'This is body of Post 1'),
    ('Post 2', 'Jane Dow', '2023-12-01', 'Body of post 2'),
    ('POST 3', 'James Band', '2023-12-04', 'Body about post 3'),
    ('Post 4', 'Mike T', '2023-12-14', 'Post about Boxing from T. '),
    ('Post 5', 'Mike T', '2023-12-15', 'Post about Boxing from T. '),
    ('Post 6', 'Jane Dow', '2023-11-05', 'Post 6 about Jane');`;
    // supildyti reiksme
    const [resultObj] = await conn.query(sqlPopulate);
    if (resultObj.affectedRows > 0) {
      res.json({
        msg: 'table and rows created',
      });
      return;
    }
    throw new Error('no row afected');
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

// GET - /api/admin/populate-posts-table - supildo lentele

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

// POST - /api/posts/ - sukurti posta
app.post('/api/posts/', async (req, res) => {
  let conn;

  // pasiimam atsiustas reiksmes
  const { title, author, date, body } = req.body;

  // validacijos
  if (title.trim() === '') {
    res.status(400).json({
      err: 'title is required',
    });
    return;
  }

  try {
    conn = await mysql.createConnection(dbConfig);
    const sql = `INSERT INTO posts 
    (title, author, date, body) 
    VALUES (?,?,?,?)`;
    const [rows] = await conn.execute(sql, [title, author, date, body]);
    if (rows.affectedRows === 1) {
      res.sendStatus(201);
      return;
    }
    res.json({ msg: 'no afected rows' });
  } catch (error) {
    console.log(error);
    console.log('klaida sukurti posta');
    res.status(500).json({
      msg: 'Something went wrong',
    });
  } finally {
    // atsijungti nuo DB
    if (conn) conn.end();
  }
});
// 404

app.use((req, res) => {
  res.status(404).json({
    msg: 'path not found',
  });
});

app.listen(PORT, () =>
  console.log(`Server runing on http://localhost:${PORT}`)
);
