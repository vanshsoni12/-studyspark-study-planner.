const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const subjectInput = document.getElementById('subjectInput');
const priorityInput = document.getElementById('priorityInput');
const taskList = document.getElementById('taskList');
const filterSelect = document.getElementById('filterSelect');
const emptyMessage = document.getElementById('emptyMessage');
const totalCount = document.getElementById('totalCount');
const doneCount = document.getElementById('doneCount');
const progressCount = document.getElementById('progressCount');
const todayDate = document.getElementById('todayDate');

let tasks = JSON.parse(localStorage.getItem('studysparkTasks')) || [];

todayDate.textContent = new Date().toLocaleDateString('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
});

function saveTasks() {
  localStorage.setItem('studysparkTasks', JSON.stringify(tasks));
}

function updateStats() {
  const completed = tasks.filter(task => task.completed).length;
  totalCount.textContent = tasks.length;
  doneCount.textContent = completed;
  const percent = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);
  progressCount.textContent = `${percent}%`;
}

function renderTasks() {
  taskList.innerHTML = '';
  const filter = filterSelect.value;

  const visibleTasks = tasks.filter(task => {
    if (filter === 'Pending') return !task.completed;
    if (filter === 'Completed') return task.completed;
    return true;
  });

  emptyMessage.hidden = visibleTasks.length > 0;

  visibleTasks.forEach(task => {
    const card = document.createElement('article');
    card.className = `task-item${task.completed ? ' completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-check';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', 'Mark task complete');
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const info = document.createElement('div');
    info.className = 'task-info';

    const title = document.createElement('p');
    title.className = 'task-title';
    title.textContent = task.title;

    const meta = document.createElement('p');
    meta.className = 'task-meta';
    meta.textContent = `${task.subject || 'General'} • Added ${task.created}`;

    info.append(title, meta);

    const badge = document.createElement('span');
    badge.className = `priority ${task.priority}`;
    badge.textContent = task.priority;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.type = 'button';
    deleteButton.textContent = '×';
    deleteButton.setAttribute('aria-label', 'Delete task');
    deleteButton.addEventListener('click', () => deleteTask(task.id));

    card.append(checkbox, info, badge, deleteButton);
    taskList.appendChild(card);
  });

  updateStats();
}

function addTask(event) {
  event.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  const newTask = {
    id: Date.now(),
    title,
    subject: subjectInput.value.trim(),
    priority: priorityInput.value,
    completed: false,
    created: new Date().toLocaleDateString('en-IN')
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();
  taskForm.reset();
  taskInput.focus();
}

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

taskForm.addEventListener('submit', addTask);
filterSelect.addEventListener('change', renderTasks);

renderTasks();
