"use strict";

const colorButton = document.getElementById("change-color");
const colorStatus = document.getElementById("color-status");
const headings = document.querySelectorAll(".color-preview h3, .color-preview h4");

function makeHexColor() {
  return `#${Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, "0")}`;
}

colorButton.addEventListener("click", () => {
  const color = makeHexColor();
  headings.forEach((heading) => {
    heading.style.color = color;
  });
  colorStatus.textContent = `Headings are now ${color}.`;
});

const thoughtList = document.getElementById("thought-list");
let thoughtCount = 0;

document.getElementById("add-paragraph").addEventListener("click", () => {
  thoughtCount += 1;
  const item = document.createElement("li");
  item.dataset.thought = String(thoughtCount);

  const text = document.createElement("span");
  text.textContent = `A new thought, number ${thoughtCount}.`;

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.dataset.action = "remove-thought";
  removeButton.setAttribute("aria-label", `Remove thought ${thoughtCount}`);
  removeButton.textContent = "Remove";

  item.append(text, removeButton);
  thoughtList.append(item);
});

thoughtList.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest('[data-action="remove-thought"]');
  if (button) button.closest("li")?.remove();
});

const images = Array.from(document.querySelectorAll("#image-gallery img"));
const imageToggle = document.getElementById("toggle-images");
const imageStatus = document.getElementById("image-status");
let imagesVisible = true;

imageToggle.addEventListener("click", () => {
  imagesVisible = !imagesVisible;
  images.forEach((image) => {
    image.hidden = !imagesVisible;
  });
  imageToggle.textContent = imagesVisible ? "Remove images" : "Show images";
  imageStatus.textContent = imagesVisible ? "Images restored." : "Images removed from view.";
});

const copySource = document.getElementById("copy-source");
const copyTarget = document.getElementById("copy-target");
const copyStatus = document.getElementById("copy-status");

function copyNote() {
  const note = document.createElement("p");
  note.textContent = "Good things take practice.";
  copyTarget.replaceChildren(note);
  copyStatus.textContent = "The note was copied into the target.";
}

document.getElementById("copy-note").addEventListener("click", copyNote);
copySource.addEventListener("click", copyNote);
copySource.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    copyNote();
  }
});

copySource.addEventListener("dragstart", (event) => {
  event.dataTransfer?.setData("text/plain", "Good things take practice.");
  if (event.dataTransfer) event.dataTransfer.effectAllowed = "copy";
});

copyTarget.addEventListener("dragover", (event) => {
  event.preventDefault();
  copyTarget.classList.add("is-drop-target");
});
copyTarget.addEventListener("dragleave", () => copyTarget.classList.remove("is-drop-target"));
copyTarget.addEventListener("drop", (event) => {
  event.preventDefault();
  copyTarget.classList.remove("is-drop-target");
  const noteText = event.dataTransfer?.getData("text/plain") ?? "";
  if (!noteText) {
    copyStatus.textContent = "Nothing to copy. Drag the note into this area.";
    return;
  }

  const note = document.createElement("p");
  note.textContent = noteText;
  copyTarget.replaceChildren(note);
  copyStatus.textContent = "The note was copied by drag and drop.";
});

const THEME_KEY = "daylight.theme.v1";
const themeButton = document.getElementById("toggle-theme");
const themeStatus = document.getElementById("theme-status");

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  themeButton.textContent = isDark ? "Turn off dark mode" : "Turn on dark mode";
  themeButton.setAttribute("aria-pressed", String(isDark));
}

let savedTheme = "light";
try {
  const storedTheme = window.localStorage.getItem(THEME_KEY);
  if (storedTheme === "dark" || storedTheme === "light") savedTheme = storedTheme;
} catch (error) {
  themeStatus.textContent = "Theme preference could not be read in this browser.";
  console.error("Could not read saved theme:", error);
}
applyTheme(savedTheme);

themeButton.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);

  try {
    window.localStorage.setItem(THEME_KEY, nextTheme);
    themeStatus.textContent = `The ${nextTheme} theme is on.`;
  } catch (error) {
    themeStatus.textContent = "Theme changed, but your browser could not save the preference.";
    console.error("Could not save theme preference:", error);
  }
});
