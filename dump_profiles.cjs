const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kebunin_v2'
  });

  try {
    const [profiles] = await connection.query('SELECT * FROM profiles');
    console.log('Profiles:', profiles);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

run();
