const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  port: '3308',
  user: 'root',
  password: 'root12',
  database: 'postmandb',
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to the database');
}); 

module.exports = connection;