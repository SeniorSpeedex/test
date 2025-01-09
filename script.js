
let users = JSON.parse(localStorage.getItem('users')) || [];
let lessons = JSON.parse(localStorage.getItem('lessons')) || [];
let viewedLessons = JSON.parse(localStorage.getItem('viewedLessons')) || {};
let currentUser = null;

// Проверка на наличие пользователей в localStorage
if (users.length === 0) {
    users.push({ id: 1, role: 'учитель', fullName: 'Учитель 1', username: 'teacher1', password: 'password1' });
    saveData();
}

// Функция для сохранения данных в localStorage
function saveData() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('lessons', JSON.stringify(lessons));
    localStorage.setItem('viewedLessons', JSON.stringify(viewedLessons));
}

// Обработчик при отправке формы входа
document.getElementById('login').addEventListener('submit', handleLogin);

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        authenticateUser(user);
    } else {
        document.getElementById('loginError').innerText = 'Неправильный логин или пароль.';
    }
}

// Функция аутентификации пользователя
function authenticateUser(user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    alert('Успешный вход!');
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';

    document.getElementById('addLessonLink').style.display = user.role === 'учитель' ? 'block' : 'none';
    document.getElementById('add-lesson').style.display = user.role === 'учитель' ? 'block' : 'none';
    displayLessons();
}

// Обработчик нажатия кнопки регистрации
document.getElementById('registerButton').addEventListener('click', function() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
});

// Обработчик при отправке формы регистрации
document.getElementById('teacherForm').addEventListener('submit', handleAddUser);

function handleAddUser(event) {
    event.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const username = document.getElementById('teacherUsername').value;
    const password = document.getElementById('teacherPassword').value;
    const role = document.getElementById('role').value;

    if (users.find(u => u.username === username)) {
        document.getElementById('registrationError').innerText = 'Логин уже занят!';
        return;
    }

    const user = { id: users.length + 1, role, fullName, username, password };
    users.push(user);
    saveData();
    alert('Пользователь добавлен!');
    this.reset();
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

// Обработчик при отправке формы добавления уроков
document.getElementById('lessonForm').addEventListener('submit', handleAddLesson);

function handleAddLesson(event) {
    event.preventDefault();
    const title = document.getElementById('lessonTitle').value;
    const description = document.getElementById('lessonDescription').value;
    const mediaFiles = document.getElementById('lessonMedia').files;

    const mediaURLs = Array.from(mediaFiles).map(file => URL.createObjectURL(file)); // Генерация URL для каждого файла

    // Получаем текущее время
    const currentTime = new Date().toLocaleString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',

        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    const lesson = {
        id: lessons.length + 1,
        teacher: currentUser.fullName,
        title,
        description,
        media: mediaURLs, // Сохраняем сгенерированные URL
        createdAt: currentTime // Сохраняем время добавления урока
    };

    lessons.push(lesson);
    saveData();
    displayLessons();
    alert('Урок добавлен!');
    document.getElementById('lessonForm').reset();
}

// Функция для отображения уроков
function displayLessons() {
    const viewedLessonsList = document.getElementById('viewedLessonsList');
    const unviewedLessonsList = document.getElementById('unviewedLessonsList');
    
    viewedLessonsList.innerHTML = '';
    unviewedLessonsList.innerHTML = '';

    lessons.forEach(lesson => {
        const lessonElement = document.createElement('div');
        lessonElement.classList.add('lesson-item');
        
        lessonElement.innerHTML = `
            <h3>${lesson.title} <span style="font-size: 0.8em; float: right;">${lesson.createdAt}</span></h3>
            <p>${lesson.description}</p>
            <div>${lesson.media.map(url => `<img src="${url}" alt="Медиа" />`).join('')}</div>
        `;
        
        // Добавляем обработчик события для просмотра деталей урока
        lessonElement.onclick = () => {
            showLessonDetail(lesson); // Функция для отображения деталей урока
        };

        if (viewedLessons[lesson.id]) {
            viewedLessonsList.appendChild(lessonElement);
        } else {
            unviewedLessonsList.appendChild(lessonElement);
        }
    });
}

// Функция для отображения деталей урока
function showLessonDetail(lesson) {
    document.getElementById('detailLessonTitle').innerText = lesson.title;
    document.getElementById('detailLessonDescription').innerText = lesson.description;
    const detailLessonMedia = document.getElementById('detailLessonMedia');
    detailLessonMedia.innerHTML = lesson.media.map(url => `<img src="${url}" alt="Медиа" />`).join('');
    
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('lessonDetail').style.display = 'block';
}

// Функция для возврата к списку уроков
function goBackToLessons() {
    document.getElementById('lessonDetail').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
}
