// Получение списка пользователей
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

// Сохранение пользователей
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Регистрация
function register() {
    const name = document.getElementById("regName").value.trim();
    const age = document.getElementById("regAge").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const pass = document.getElementById("regPass").value.trim();

    if (!name || !age || !email || !pass) {
        alert("Заполните все поля!");
        return;
    }

    const users = getUsers();

    if (users.find(u => u.email === email)) {
        alert("Такой email уже зарегистрирован!");
        return;
    }

    users.push({ name, age, email, pass });
    saveUsers(users);

    alert("Регистрация успешна!");
}

// Вход
function login() {
    const email = document.getElementById("logEmail").value;
    const pass = document.getElementById("logPass").value;

    const users = getUsers();
    const user = users.find(u => u.email === email && u.pass === pass);

    if (!user) {
        alert("Неверный email или пароль!");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    showProfile();
}

// Показ профиля и других пользователей
function showProfile() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;

    document.getElementById("auth").style.display = "none";
    document.getElementById("profile").style.display = "block";
    document.getElementById("userName").textContent = user.name;

    const users = getUsers();
    const list = document.getElementById("usersList");
    list.innerHTML = "";

    users
        .filter(u => u.email !== user.email)
        .forEach(u => {
            list.innerHTML += `<div>${u.name}, ${u.age} лет</div>`;
        });
}

// Выход
function logout() {
    localStorage.removeItem("currentUser");
    location.reload();
}

// Если пользователь уже вошёл — показать профиль
if (localStorage.getItem("currentUser")) {
    showProfile();
}