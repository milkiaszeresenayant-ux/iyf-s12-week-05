"use strict";

const STORAGE_KEY = "daylight.todos.v1";
const THEME_KEY = "daylight.theme.v1";
const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const emptyState = document.querySelector("#empty-state");
const emptyTitle = document.querySelector("#empty-title");
const emptyCopy = document.querySelector("#empty-copy");
const itemsLeft = document.querySelector("#items-left");
const allCount = document.querySelector("#all-count");
const activeCount = document.querySelector("#active-count");
const completedCount = document.querySelector("#completed-count");
const filters = document.querySelector(".filters");
const clearCompletedButton = document.querySelector("#clear-completed");
const storageStatus = document.querySelector("#storage-status");
const themeToggle = document.querySelector("#theme-toggle");

let todos = [];
let currentFilter = "all";
let storageAvailable = true;

function showStorageMessage(message, state = "info") {
  storageStatus.textContent = message;
  storageStatus.dataset.state = state;
}

function loadTodos() {
  try {
    const savedTodos = window.localStorage.getItem(STORAGE_KEY);
    if (savedTodos === null) return [];

    const parsedTodos = JSON.parse(savedTodos);
    if (!Array.isArray(parsedTodos)) {
      throw new TypeError("Saved task data is not a list.");
    }

    return parsedTodos
      .filter((todo) =>
        todo &&
        typeof todo.id === "string" &&
        typeof todo.text === "string" &&
        typeof todo.completed === "boolean"
      )
      .map((todo) => ({
        id: todo.id,
        text: todo.text.trim().slice(0, 160),
        completed: todo.completed
      }))
      .filter((todo) => todo.text.length > 0);
  } catch (error) {
    storageAvailable = false;
    showStorageMessage("Saved tasks could not be read. This list will work for this visit only.", "error");
    console.error("Could not load saved tasks:", error);
    return [];
  }
}

function saveTodos() {
  if (!storageAvailable) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    showStorageMessage("Saved on this device.");
  } catch (error) {
    storageAvailable = false;
    showStorageMessage("Your browser could not save this list. Changes will last for this visit only.", "error");
    console.error("Could not save tasks:", error);
  }
}

function makeId() {
  if (typeof window.crypto?.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createTodoElement(todo) {
  const item = document.createElement("li");
  item.className = `todo-item${todo.completed ? " is-complete" : ""}`;
  item.dataset.todoId = todo.id;

  const checkbox = document.createElement("input");
  checkbox.className = "todo-checkbox";
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.setAttribute("aria-label", `Mark "${todo.text}" ${todo.completed ? "as active" : "as complete"}`);

  const text = document.createElement("span");
  text.className = "todo-text";
  text.textContent = todo.text;
  text.title = "Double-click to edit";

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.dataset.action = "delete";
  deleteButton.setAttribute("aria-label", `Delete "${todo.text}"`);
  deleteButton.innerHTML = "&times;";

  item.append(checkbox, text, deleteButton);
  return item;
}

function getVisibleTodos() {
  if (currentFilter === "active") return todos.filter((todo) => !todo.completed);
  if (currentFilter === "completed") return todos.filter((todo) => todo.completed);
  return todos;
}

function updateStats() {
  const remaining = todos.filter((todo) => !todo.completed).length;
  const completed = todos.length - remaining;
  itemsLeft.textContent = `${remaining} ${remaining === 1 ? "item" : "items"} left`;
  allCount.textContent = String(todos.length);
  activeCount.textContent = String(remaining);
  completedCount.textContent = String(completed);
  clearCompletedButton.disabled = completed === 0;
}

function updateEmptyState(visibleTodos) {
  emptyState.hidden = visibleTodos.length > 0;

  if (todos.length === 0) {
    emptyTitle.textContent = "A fresh start";
    emptyCopy.textContent = "Add a task above and take it one step at a time.";
  } else if (currentFilter === "active") {
    emptyTitle.textContent = "All caught up";
    emptyCopy.textContent = "There are no active tasks. Enjoy the breathing room.";
  } else {
    emptyTitle.textContent = "Nothing completed yet";
    emptyCopy.textContent = "Finish a task and it will find a home here.";
  }
}

function renderTodos() {
  const visibleTodos = getVisibleTodos();
  const fragment = document.createDocumentFragment();

  visibleTodos.forEach((todo) => fragment.append(createTodoElement(todo)));
  list.replaceChildren(fragment);
  updateStats();
  updateEmptyState(visibleTodos);
}

function addTodo(text) {
  const cleanText = text.trim();
  if (!cleanText) {
    input.setCustomValidity("Please enter a task.");
    input.reportValidity();
    input.setCustomValidity("");
    input.focus();
    return;
  }

  todos.unshift({ id: makeId(), text: cleanText, completed: false });
  saveTodos();
  if (currentFilter === "completed") setFilter("all");
  renderTodos();
  input.value = "";
  input.focus();
}

function findTodo(id) {
  return todos.find((todo) => todo.id === id);
}

function toggleTodo(id) {
  const todo = findTodo(id);
  if (!todo) return;

  todo.completed = !todo.completed;
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  const originalCount = todos.length;
  todos = todos.filter((todo) => todo.id !== id);
  if (todos.length === originalCount) return;

  saveTodos();
  renderTodos();
}

function setFilter(filter) {
  currentFilter = filter;
  filters.querySelectorAll("[data-filter]").forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  renderTodos();
}

function startEditing(item, todo) {
  const text = item.querySelector(".todo-text");
  if (!text || item.querySelector(".edit-input")) return;

  const editor = document.createElement("input");
  editor.className = "edit-input";
  editor.type = "text";
  editor.maxLength = 160;
  editor.value = todo.text;
  editor.setAttribute("aria-label", `Edit task: ${todo.text}`);
  text.replaceWith(editor);
  editor.focus();
  editor.select();

  let saved = false;
  function finishEditing(shouldSave) {
    if (saved) return;
    saved = true;

    const nextText = editor.value.trim();
    if (shouldSave && nextText) {
      todo.text = nextText;
      saveTodos();
    }
    renderTodos();
  }

  editor.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      finishEditing(true);
    } else if (event.key === "Escape") {
      finishEditing(false);
    }
  });
  editor.addEventListener("blur", () => finishEditing(true));
}

function setTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);

  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    showStorageMessage("Theme changed, but your browser could not save that preference.", "error");
    console.error("Could not save theme preference:", error);
  }
}

function loadTheme() {
  try {
    const savedTheme = window.localStorage.getItem(THEME_KEY);
    return savedTheme === "dark" || savedTheme === "light" ? savedTheme : "light";
  } catch (error) {
    console.error("Could not read the theme preference:", error);
    return "light";
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  addTodo(input.value);
});

list.addEventListener("change", (event) => {
  if (!(event.target instanceof HTMLInputElement) || !event.target.matches(".todo-checkbox")) return;
  const item = event.target.closest("[data-todo-id]");
  if (item) toggleTodo(item.dataset.todoId);
});

list.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const deleteButton = event.target.closest('[data-action="delete"]');
  const item = deleteButton?.closest("[data-todo-id]");
  if (item) deleteTodo(item.dataset.todoId);
});

list.addEventListener("dblclick", (event) => {
  if (!(event.target instanceof Element)) return;
  const text = event.target.closest(".todo-text");
  const item = text?.closest("[data-todo-id]");
  const todo = item ? findTodo(item.dataset.todoId) : null;
  if (item && todo) startEditing(item, todo);
});

filters.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest("[data-filter]");
  if (button) setFilter(button.dataset.filter);
});

clearCompletedButton.addEventListener("click", () => {
  const completed = todos.filter((todo) => todo.completed).length;
  if (completed === 0) return;

  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
});

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
});

todos = loadTodos();
setTheme(loadTheme());
renderTodos();
if (storageAvailable && storageStatus.textContent === "") {
  showStorageMessage("Saved on this device.");
}
