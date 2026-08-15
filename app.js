const seedTasks = [
  { id: 1, title: 'Новый экран аналитики', description: 'Подготовить макеты экрана', assignee: 'Илья С.', due: '2026-08-18', author: 'Алексей К.', status: 'in-progress' },
  { id: 2, title: 'Подготовить отчёт по метрикам', description: '', assignee: 'Мария В.', due: '2026-08-15', author: 'Алексей К.', status: 'done' },
  { id: 3, title: 'Обновить onboarding', description: 'Упростить первый шаг регистрации', assignee: 'Елена К.', due: '2026-08-21', author: 'Илья С.', status: 'in-progress' },
  { id: 4, title: 'Проверить тексты интерфейса', description: '', assignee: 'Антон Н.', due: '2026-08-19', author: 'Алексей К.', status: 'todo' },
  { id: 5, title: 'Собрать обратную связь клиентов', description: '', assignee: 'Мария В.', due: '2026-08-25', author: 'Алексей К.', status: 'in-progress' },
  { id: 6, title: 'Обновить презентацию продукта', description: '', assignee: 'Алексей К.', due: '2026-08-22', author: 'Елена К.', status: 'todo' },
  { id: 7, title: 'Проверить интеграцию оплаты', description: '', assignee: 'Илья С.', due: '2026-08-16', author: 'Алексей К.', status: 'in-progress' },
  { id: 8, title: 'Синхронизация команды', description: '', assignee: 'Антон Н.', due: '2026-08-14', author: 'Алексей К.', status: 'done' }
];
const statuses = { todo: 'К выполнению', 'in-progress': 'В работе', done: 'Выполнено' };
const initials = { 'Мария В.': 'МВ', 'Илья С.': 'ИС', 'Елена К.': 'ЕК', 'Антон Н.': 'АН', 'Алексей К.': 'АК' };
const avatarColors = { 'Мария В.': 'purple', 'Илья С.': 'blue', 'Елена К.': 'yellow', 'Антон Н.': 'green', 'Алексей К.': 'red' };
const $ = (selector) => document.querySelector(selector);
let tasks = JSON.parse(localStorage.getItem('pulse-tasks') || 'null') || seedTasks;
let currentUser = JSON.parse(localStorage.getItem('pulse-user') || 'null');
let activeFilter = 'all';
const today = new Date();

function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[char]); }
function save() { localStorage.setItem('pulse-tasks', JSON.stringify(tasks)); }
function dateLabel(value) { return value ? new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' }).format(new Date(`${value}T12:00:00`)).replace('.', '') : 'Без срока'; }
function getName() { return currentUser?.name || 'Алексей К.'; }
function renderActivity() {
  const recent = tasks.slice(0, 4);
  $('#activityList').innerHTML = recent.map((task, index) => `<div class="activity"><span class="avatar ${avatarColors[task.author] || 'red'}">${initials[task.author] || 'АК'}</span><div><p><strong>${escapeHtml(task.author)}</strong> ${index === 0 ? 'создал новую задачу' : index === 1 ? 'обновил задачу' : 'работает над задачей'}</p><b>«${escapeHtml(task.title)}»</b><small>${index + 1} ${index === 0 ? 'час' : 'часа'} назад</small></div></div>`).join('');
}
function render() {
  const filtered = activeFilter === 'all' ? tasks : tasks.filter((task) => task.status === activeFilter);
  $('#taskList').innerHTML = filtered.length ? filtered.map((task) => `<article class="task-row" data-id="${task.id}"><button class="check-button ${task.status === 'done' ? 'done' : ''}" aria-label="Завершить задачу">${task.status === 'done' ? '✓' : ''}</button><div><span class="task-title ${task.status === 'done' ? 'done' : ''}">${escapeHtml(task.title)}</span><span class="task-meta">До ${dateLabel(task.due)} · Автор: ${escapeHtml(task.author)}</span></div><div class="task-assignee"><span class="avatar ${avatarColors[task.assignee] || 'red'}">${initials[task.assignee] || '—'}</span>${escapeHtml(task.assignee)}</div><select class="status-select ${task.status}" aria-label="Статус задачи"><option value="todo" ${task.status === 'todo' ? 'selected' : ''}>К выполнению</option><option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>В работе</option><option value="done" ${task.status === 'done' ? 'selected' : ''}>Выполнено</option></select></article>`).join('') : '<div class="empty-state">Задач в этом разделе пока нет</div>';
  const done = tasks.filter((task) => task.status === 'done').length;
  $('#totalStat').textContent = tasks.length; $('#progressStat').textContent = tasks.filter((task) => task.status === 'in-progress').length; $('#doneStat').textContent = done; $('#overdueStat').textContent = tasks.filter((task) => task.status !== 'done' && task.due < '2026-08-15').length;
  $('#navCount').textContent = tasks.length; $('#allCount').textContent = tasks.length; $('#workingCount').textContent = tasks.filter((task) => task.status === 'in-progress').length; $('#completedCount').textContent = done; renderActivity();
}
function openModal() { $('#modalBackdrop').classList.remove('hidden'); $('#taskDue').value = '2026-08-20'; $('#taskTitle').focus(); }
function closeModal() { $('#modalBackdrop').classList.add('hidden'); $('#taskForm').reset(); }
function showApp() {
  $('#authView').classList.add('hidden'); $('#appView').classList.remove('hidden');
  const name = getName(); $('#welcomeName').textContent = name.split(' ')[0]; $('#sidebarName').textContent = name; $('#sidebarInitials').textContent = initials[name] || name.slice(0, 2).toUpperCase(); $('#topAvatar').textContent = initials[name] || name.slice(0, 2).toUpperCase(); render();
}
if (currentUser) showApp();
$('#loginForm').addEventListener('submit', (event) => { event.preventDefault(); const email = $('#loginEmail').value.trim(); const password = $('#loginPassword').value; if (!email.includes('@') || password.length < 4) { $('#loginError').textContent = 'Проверьте почту и пароль (минимум 4 символа).'; return; } const localName = email.split('@')[0].replace(/[._-]/g, ' ').split(' ').map((part) => part ? part[0].toUpperCase() + part.slice(1) : '').join(' '); currentUser = { name: localName || 'Алексей К.' }; localStorage.setItem('pulse-user', JSON.stringify(currentUser)); showApp(); });
$('#togglePassword').addEventListener('click', () => { const input = $('#loginPassword'); input.type = input.type === 'password' ? 'text' : 'password'; $('#togglePassword').textContent = input.type === 'password' ? 'Показать' : 'Скрыть'; });
$('#forgotPassword').addEventListener('click', (event) => { event.preventDefault(); $('#loginError').textContent = 'Ссылка для восстановления будет отправлена на вашу почту.'; });
$('#taskList').addEventListener('click', (event) => { const row = event.target.closest('.task-row'); if (!row || !event.target.closest('.check-button')) return; const task = tasks.find((item) => item.id === Number(row.dataset.id)); task.status = task.status === 'done' ? 'todo' : 'done'; save(); render(); });
$('#taskList').addEventListener('change', (event) => { if (!event.target.matches('.status-select')) return; const task = tasks.find((item) => item.id === Number(event.target.closest('.task-row').dataset.id)); task.status = event.target.value; save(); render(); });
document.querySelectorAll('.tab').forEach((tab) => tab.addEventListener('click', () => { document.querySelector('.tab.active').classList.remove('active'); tab.classList.add('active'); activeFilter = tab.dataset.filter; render(); }));
$('#openCreate').addEventListener('click', openModal); $('#closeModal').addEventListener('click', closeModal); $('#cancelModal').addEventListener('click', closeModal); $('#modalBackdrop').addEventListener('click', (event) => { if (event.target === $('#modalBackdrop')) closeModal(); });
$('#taskForm').addEventListener('submit', (event) => { event.preventDefault(); tasks.unshift({ id: Date.now(), title: $('#taskTitle').value.trim(), description: $('#taskDescription').value.trim(), assignee: $('#taskAssignee').value, due: $('#taskDue').value, author: getName(), status: $('#taskStatus').value }); save(); activeFilter = 'all'; document.querySelectorAll('.tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.filter === 'all')); render(); closeModal(); });
$('#mobileMenu').addEventListener('click', () => $('#sidebar').classList.toggle('open')); document.querySelectorAll('.nav-link,.space').forEach((link) => link.addEventListener('click', () => $('#sidebar').classList.remove('open'))); $('#logoutButton').addEventListener('click', () => { localStorage.removeItem('pulse-user'); location.reload(); });
