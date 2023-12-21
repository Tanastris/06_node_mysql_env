require('dotenv').config();
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};
console.log('dbConfig ===', dbConfig);
// reiksmes is .env

// suinstaliuoti dotenv
// sukurti .env
// DB_HOST, DB_USER...
// sukurti .evn.example
// .env i gitignore

// exportuoti dbConfig
module.exports = dbConfig;
