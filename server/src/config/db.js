import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Verificer si la bdd est bien connecté
pool
  .getConnection()
  .then((connection) => {
    console.log("Connection succes à la bdd");
    connection.release();
  })
  .catch((err) => {
    console.log("Connection impossible", err);
  });

export default pool;
