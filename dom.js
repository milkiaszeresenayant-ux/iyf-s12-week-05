"use strict";

const header = document.getElementById("main-header");
const contents = document.getElementsByClassName("content");
const paragraphs = document.getElementsByTagName("p");
const firstLink = document.querySelector(".nav-link");
const allLinks = document.querySelectorAll(".nav-link");

console.group("9.1 · Selecting elements");
console.log("getElementById:", header);
console.log("getElementsByClassName (live HTMLCollection):", contents);
console.log("getElementsByTagName (live HTMLCollection):", paragraphs);
console.log("querySelector (first match):", firstLink);
console.log("querySelectorAll (static NodeList):", allLinks);
console.log("h1:", document.querySelector("h1"));
console.log("Contact form:", document.getElementById("contact-form"));
console.log("Email input:", document.querySelector('input[type="email"]'));
console.log("Navigation list items:", document.querySelectorAll(".nav-list li"));
console.log("Last paragraph:", paragraphs[paragraphs.length - 1]);
console.groupEnd();

const nav = header.querySelector("nav");
const article = document.querySelector("article");
console.group("9.2 · Traversing the DOM");
console.log("nav parent:", nav.parentElement);
console.log("nav children:", nav.children);
console.log("nav first/last element:", nav.firstElementChild, nav.lastElementChild);
console.log("article next/previous element:", article.nextElementSibling, article.previousElementSibling);
console.log("nav descendants:", nav.querySelectorAll("a"));
console.log("first link parent li:", firstLink.parentElement);
console.log("nav list items:", nav.querySelector("ul").children);
console.log("footer parent (body):", document.querySelector("footer").parentElement);
console.groupEnd();

console.group("9.3 · Reading content, attributes, and data");
console.log("h1 textContent:", document.querySelector("h1").textContent);
console.log("article HTML:", article.innerHTML);
console.log("first link href attribute:", firstLink.getAttribute("href"));
console.log("first link has target:", firstLink.hasAttribute("target"));
console.log("article data:", article.dataset.id, article.dataset.category);
console.groupEnd();

const status = document.getElementById("dom-status");
let addedParagraphCount = 0;
let navItemCount = 0;

function addPracticeParagraph() {
  addedParagraphCount += 1;
  const paragraph = document.createElement("p");
  paragraph.className = "content added-content";
  paragraph.dataset.created = "true";
  paragraph.textContent = `New paragraph ${addedParagraphCount}. It was created with createElement and textContent.`;
  article.append(paragraph);
  status.textContent = `Added paragraph ${addedParagraphCount}.`;
}

function addNavItem(text, href) {
  const item = document.createElement("li");
  const link = document.createElement("a");
  link.className = "nav-link";
  link.href = href;
  link.textContent = text;
  item.append(link);
  header.querySelector(".nav-list").append(item);
}

document.getElementById("highlight-button").addEventListener("click", () => {
  document.querySelectorAll(".content").forEach((paragraph) => paragraph.classList.toggle("highlight"));
  status.textContent = "Toggled the highlight class on every content paragraph.";
});

document.getElementById("update-article-button").addEventListener("click", () => {
  const title = document.createElement("h3");
  title.className = "title";
  title.textContent = "The article has changed";
  const paragraph = document.createElement("p");
  paragraph.className = "content";
  paragraph.textContent = "New elements were built with createElement and safe textContent.";
  article.replaceChildren(title, paragraph);
  status.textContent = "Updated the article with DOM methods and safe text.";
});

document.getElementById("add-paragraph-button").addEventListener("click", addPracticeParagraph);
document.getElementById("remove-paragraph-button").addEventListener("click", () => {
  const lastAdded = article.querySelector(".added-content:last-of-type");
  if (!lastAdded) {
    status.textContent = "There are no added paragraphs to remove.";
    return;
  }

  lastAdded.remove();
  status.textContent = "Removed the last added paragraph.";
});

document.getElementById("add-nav-button").addEventListener("click", () => {
  navItemCount += 1;
  addNavItem(`Extra link ${navItemCount}`, "#events");
  status.textContent = "Added a navigation item dynamically.";
});

document.getElementById("clone-nav-button").addEventListener("click", () => {
  const firstItem = header.querySelector(".nav-list li");
  const clonedItem = firstItem.cloneNode(true);
  const link = clonedItem.querySelector("a");
  link.textContent = "Cloned link";
  link.href = "#selecting";
  header.querySelector(".nav-list").append(clonedItem);
  status.textContent = "Cloned and updated the first navigation item.";
});

header.querySelector(".nav-list").addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const link = event.target.closest("a.nav-link");
  if (link) console.log("Delegated navigation click:", link.textContent, link.href);
});

let counter = 0;
const counterValue = document.getElementById("counter-value");

function updateCounter(nextValue) {
  counter = Math.max(0, nextValue);
  counterValue.textContent = String(counter);
}

document.getElementById("increment-button").addEventListener("click", () => updateCounter(counter + 1));
document.getElementById("decrement-button").addEventListener("click", () => updateCounter(counter - 1));
document.getElementById("reset-counter-button").addEventListener("click", () => updateCounter(0));

document.getElementById("demo-child-button").addEventListener("click", (event) => {
  console.log("Child clicked:", event.target, event.type, event.clientX, event.clientY);
  document.getElementById("event-status").textContent = "Bubbling order: child → parent → document. See the console.";
});
document.getElementById("demo-parent").addEventListener("click", () => console.log("Parent clicked"));
document.addEventListener("click", (event) => {
  if (event.target instanceof Element && event.target.closest("#demo-parent")) {
    console.log("Document received the bubbled click.");
  }
});

document.getElementById("todo-demo-list")?.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const task = event.target.closest("li");
  if (task && event.target.closest("[data-action='delete']")) task.remove();
  else task?.classList.toggle("highlight");
});

const contactForm = document.getElementById("contact-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const formStatus = document.getElementById("form-status");

function showError(input, message) {
  input.classList.toggle("error", Boolean(message));
  input.setAttribute("aria-invalid", String(Boolean(message)));
  document.getElementById(`${input.id}-error`).textContent = message;
}

function validateName() {
  const value = nameInput.value.trim();
  const message = value.length < 2 ? "Name must be at least 2 characters." : "";
  showError(nameInput, message);
  return message === "";
}

function validateEmail() {
  const value = emailInput.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const message = valid ? "" : "Enter a valid email address.";
  showError(emailInput, message);
  return valid;
}

nameInput.addEventListener("input", validateName);
emailInput.addEventListener("input", validateEmail);

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const nameIsValid = validateName();
  const emailIsValid = validateEmail();

  if (!nameIsValid || !emailIsValid) {
    formStatus.textContent = "Please correct the highlighted fields.";
    (nameIsValid ? emailInput : nameInput).focus();
    return;
  }

  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData);
  console.log("Validated form data:", data);
  formStatus.textContent = `Thanks, ${data.name.trim()}! The form is valid.`;
  contactForm.reset();
  showError(nameInput, "");
  showError(emailInput, "");
});

contactForm.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    contactForm.reset();
    showError(nameInput, "");
    showError(emailInput, "");
    formStatus.textContent = "Form fields cleared.";
  }
});

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key.toLowerCase() === "s") {
    event.preventDefault();
    formStatus.textContent = "Saved! (This practice form does not send data.)";
  }

  if (event.ctrlKey && event.key === "Enter") {
    event.preventDefault();
    contactForm.requestSubmit();
  }
});
