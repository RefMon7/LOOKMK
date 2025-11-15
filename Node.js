const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "casino_simple"
});

// Регистрация
app.post("/register", (req, res) => {
    const { username, email, password } = req.body;

    const hash = bcrypt.hashSync(password, 10);

    db.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hash],
        err => {
            if (err) return res.json({ ok: false, msg: "Email уже используется" });
            res.json({ ok: true });
        }
    );
});

// Вход
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, rows) => {
            if (!rows.length) return res.json({ ok: false, msg: "Неверный email" });

            const user = rows[0];

            if (!bcrypt.compareSync(password, user.password))
                return res.json({ ok: false, msg: "Неверный пароль" });

            res.json({ ok: true, user });
        }
    );
});

// Игровая ставка
app.post("/bet", (req, res) => {
    const { user_id, bet, guess } = req.body;

    // Получаем баланс
    db.query(
        "SELECT balance FROM users WHERE id = ?",
        [user_id],
        (err, rows) => {
            const balance = rows[0].balance;

            if (balance < bet)
                return res.json({ ok: false, msg: "Недостаточно средств" });

            const number = Math.floor(Math.random() * 5); // число 0–4
            const win = number === guess ? bet * 2 : 0;

            const newBalance = balance - bet + win;

            db.query("UPDATE users SET balance = ? WHERE id = ?", [newBalance, user_id]);
            db.query("INSERT INTO bets (user_id, bet, win) VALUES (?, ?, ?)", [user_id, bet, win]);

            res.json({ ok: true, number, win, balance: newBalance });
        }
    );
});

app.listen(3000, () => console.log("Server started on http://localhost:3000"));