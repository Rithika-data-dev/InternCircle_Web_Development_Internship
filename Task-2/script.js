// ---------- State ----------
const STORAGE_KEY = "todo.tasks.v1";
let tasks = loadTasks();
let currentFilter = "all";
let newestId = null;

// ---------- DOM references ----------
const form = document.getElementById("add-form");
const input = document.getElementById("task-input");
const errorEl = document.getElementById("error");
const listEl = document.getElementById("task-list");
const emptyEl = document.getElementById("empty");
const summaryEl = document.getElementById("summary");
const clearBtn = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll(".filter");

// ---------- LocalStorage ----------
function loadTasks() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    showError("Could not save tasks. Storage may be full or blocked.");
  }
}

// ---------- Actions ----------
function addTask(text) {
  const task = { id: Date.now().toString(), text, completed: false };
  tasks.push(task);
  newestId = task.id;
  saveTasks();
  render();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) task.completed = !task.completed;
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  render();
}

function clearCompleted() {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  render();
}

function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = !message;
}

// ---------- Rendering ----------
function render() {
  const visible = tasks.filter((t) => {
    if (currentFilter === "active") return !t.completed;
    if (currentFilter === "completed") return t.completed;
    return true;
  });

  listEl.innerHTML = "";
  visible.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task" + (task.completed ? " is-done" : "") + (task.id === newestId ? " is-new" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark \"" + task.text + "\" complete");
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const text = document.createElement("span");
    text.className = "task__text";
    text.textContent = task.text; // textContent prevents HTML injection
    text.addEventListener("click", () => toggleTask(task.id));

    const del = document.createElement("button");
    del.className = "task__delete";
    del.type = "button";
    del.textContent = "Delete";
    del.setAttribute("aria-label", "Delete \"" + task.text + "\"");
    del.addEventListener("click", () => deleteTask(task.id));

    li.append(checkbox, text, del);
    listEl.appendChild(li);
  });
  newestId = null;

  const done = tasks.filter((t) => t.completed).length;
  const remaining = tasks.length - done;
  summaryEl.textContent = tasks.length
    ? remaining + " left, " + done + " done"
    : "Nothing here yet.";
  clearBtn.disabled = done === 0;

  if (visible.length === 0) {
    emptyEl.hidden = false;
    emptyEl.textContent = tasks.length === 0
      ? "No tasks yet. Type one above and press Enter."
      : "No " + currentFilter + " tasks.";
  } else {
    emptyEl.hidden = true;
  }
}

// ---------- Event listeners ----------
// Form submit handles both the button click and the Enter key.
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = input.value.trim();
  if (!value) {
    showError("Enter a task before adding it.");
    input.focus();
    return;
  }
  showError("");
  addTask(value);
  input.value = "";
  input.focus();
});

input.addEventListener("input", () => showError(""));

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterButtons.forEach((b) => {
      const active = b === btn;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", String(active));
    });
    render();
  });
});

clearBtn.addEventListener("click", clearCompleted);

// ---------- Init (restores saved tasks on page load) ----------
render();
