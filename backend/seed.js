const mysql = require('mysql2');
require('dotenv').config();

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "anime_review"
});

// Function to execute a single SQL command
const executeSql = (sql) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
};

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Connect to the database
    await connection.connect();
    console.log("Connected to MySQL.");

    // Array of SQL commands to execute
    const sqlCommands = [
      // Drop tables if they exist (be careful in production)
      "DROP TABLE IF EXISTS reviews;",
      "DROP TABLE IF EXISTS animes;",
      "DROP TABLE IF EXISTS users;",
    
      // Create tables
      `CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL
      );`,
    
      `CREATE TABLE animes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        genre VARCHAR(100),
        episodes INT,
        release_year INT
      );`,
    
      `CREATE TABLE reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        anime_id INT,
        user_id INT,
        review_text TEXT,
        rating INT CHECK (rating BETWEEN 1 AND 5),
        FOREIGN KEY (anime_id) REFERENCES animes(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );`,
    
      // Insert data into tables
      `INSERT INTO users (username, email, password_hash) VALUES 
      ('vic', 'vic@gmail.com', '123456'),
      ('dan', 'dan@gmail.com', '123456'),
      ('lau', 'lau@gmail.com', '123456');`,
    
      `INSERT INTO animes (title, genre, episodes, release_year) VALUES 
      ('Attack on Titan', 'Action', 75, 2013),
      ('My Hero Academia', 'Action', 88, 2016),
      ('Demon Slayer', 'Action', 26, 2019),
      ('Death Note', 'Mystery', 37, 2006),
      ('Naruto', 'Adventure', 220, 2002);`,
    
      `INSERT INTO reviews (anime_id, user_id, review_text, rating) VALUES 
      (1, 1, 'An amazing story with great characters!', 5),
      (2, 1, 'Really enjoyed the action and character development.', 4),
      (3, 2, 'Visually stunning and emotionally impactful.', 5),
      (4, 3, 'A classic that every anime fan should watch.', 4),
      (5, 2, 'Good story but too long; could have been shorter.', 3);`
    ];

    for (const sql of sqlCommands) {
      await executeSql(sql);
    }

    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    connection.end();
  }
};

// Check if this script is run directly (from CLI)
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;