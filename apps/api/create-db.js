import mysql from 'mysql2/promise';

async function main() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
    });
    await connection.query('CREATE DATABASE IF NOT EXISTS sosohelper');
    console.log('Database sosohelper created or already exists');
    await connection.end();
  } catch (err) {
    console.error('Error creating database:', err);
    process.exit(1);
  }
}

main();
