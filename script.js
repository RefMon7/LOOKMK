let user = null;

async function register() {
    const res = await fetch("/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username: regName.value,
            email: regEmail.value,
            password: regPass.value
        })
    });

    const data = await res.json();
    alert(data.ok ? "Успешно!" : data.msg);
}

async function login() {
    const res = await fetch("/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: logEmail.value,
            password: logPass.value
        })
    });

    const data = await res.json();

    if (!data.ok) return alert(data.msg);

    user = data.user;

    username.textContent = user.username;
    balance.textContent = user.balance;

    document.getElementById("game").style.display = "block";
}

async function play() {
    const res = await fetch("/bet", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            user_id: user.id,
            bet: Number(bet.value),
            guess: Number(guess.value)
        })
    });

    const data = await res.json();
    if (!data.ok) return alert(data.msg);

    user.balance = data.balance;
    balance.textContent = data.balance;

    result.textContent = `Выпало число ${data.number}. 
                          ${data.win ? "Вы выиграли " + data.win : "Проигрыш"}!`;
}