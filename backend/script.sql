CREATE DATABASE anime_review;
USE anime_review;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS animes;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,  -- Store hashed passwords
  PRIMARY KEY (id)
);

CREATE TABLE animes (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(255),
  genre VARCHAR(100),
  episodes INT,
  release_year INT,
  rating DECIMAL(3,1),
  PRIMARY KEY (id)
);

CREATE TABLE reviews (
  id INT NOT NULL AUTO_INCREMENT,
  anime_id INT NOT NULL,
  user_id INT,
  review_text TEXT,
  rating INT CHECK (rating BETWEEN 1 AND 5),  -- Rating as integer from 1 to 5
  PRIMARY KEY (id),
  FOREIGN KEY (anime_id) REFERENCES animes (id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

INSERT INTO users (username, email, password_hash) VALUES 
('vic', 'vic@gmail.com', '123456'),
('dan', 'user2@gmail.com', '123456'),
('lau', 'lau@gmail.com', '123456');

INSERT INTO animes (title, genre, episodes, release_year, rating) VALUES 
('Attack on Titan', 'Action', 75, 2013, 9.0),
('My Hero Academia', 'Action', 88, 2016, 8.5),
('Demon Slayer', 'Action', 26, 2019, 9.5),
('Death Note', 'Mystery', 37, 2006, 9.2),
('Naruto', 'Adventure', 220, 2002, 8.3);

INSERT INTO reviews (anime_id, user_id, review_text, rating) VALUES 
(1, 1, 'An amazing story with great characters!', 5),
(2, 1, 'Really enjoyed the action and character development.', 4),
(3, 2, 'Visually stunning and emotionally impactful.', 5),
(4, 3, 'A classic that every anime fan should watch.', 4),
(5, 2, 'Good story but too long; could have been shorter.', 3);
