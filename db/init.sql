CREATE DATABASE IF NOT EXISTS pweb1;
USE pweb1;

CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    UNIQUE KEY unique_user (username)
);

CREATE TABLE IF NOT EXISTS Articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    markdown TEXT NOT NULL,
    UNIQUE KEY unique_article (owner, title),
    FOREIGN KEY (owner) REFERENCES Users(id) ON DELETE CASCADE
);

-- Grant all privileges with proper host specification
GRANT ALL PRIVILEGES ON pweb1.* TO 'alumno'@'%' IDENTIFIED BY 'pweb1';
GRANT ALL PRIVILEGES ON pweb1.* TO 'alumno'@'localhost' IDENTIFIED BY 'pweb1';
FLUSH PRIVILEGES;