CREATE DATABASE casino_simple;
USE casino_simple;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    balance INT DEFAULT 1000
);

CREATE TABLE bets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    bet INT,
    win INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);