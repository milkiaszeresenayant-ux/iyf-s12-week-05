# Week 5: DOM Manipulation

## Author

- **Name:** Milkias Zeresenayant
- **GitHub:** [@milkiaszeresenayant-ux](https://github.com/milkiaszeresenayant-ux)
- **Program:** IYF Weekend Academy — Season 12
- **Date:** November 9, 2026
## AI Assistance Disclosure

I used GitHub Copilot for autocomplete suggestions while building this
project. Every feature was planned by me, and I reviewed, tested, and
debugged all generated code in the browser console before committing.

Parts I wrote myself after Copilot's suggestions were wrong or incomplete:

- The event-delegation handler using `closest()` so clicks on nested
  elements (like an icon inside a delete button) still resolve correctly.
- The `localStorage` guard that catches write failures (private browsing
  or quota limits) and keeps the app usable for the current visit.
- The single render path that keeps counts, filters, and empty states in
  sync after every state change.
## Project Description

This project practices selecting and traversing DOM elements, updating page content, creating and removing elements, responding to browser events, and validating forms. The main deliverable is **Daylight**, a responsive to-do list that keeps tasks and a theme preference in the browser.

## Technologies Used

- HTML5
- CSS3 (responsive layouts, custom properties, and reduced-motion support)
- Vanilla JavaScript (DOM APIs, events, and browser local storage)
- SVG for a local challenge image

## Features

### To-do list

- Add, complete, delete, and edit tasks.
- Filter tasks by all, active, or completed.
- View live counts and clear completed tasks.
- Save tasks and the light/dark theme on the current device.
- Use keyboard-accessible controls and a responsive layout.

### DOM practice

- Try element selection and DOM traversal methods from Lessons 9 and 10.
- Highlight and update content, add or remove paragraphs, and clone navigation items.
- Explore click events, event bubbling, a counter, delegated events, keyboard shortcuts, and form validation.

### Daily challenges

- Change heading colors to a randomly generated hex color.
- Create numbered paragraphs and remove them with delegated events.
- Hide and restore local SVG images.
- Copy content with a button, keyboard, or drag and drop.
- Toggle and persist a dark theme.

## How to Run

1. Download or clone the repository.
2. Open `index.html` in a browser. No build step or dependencies are required.
3. Open `dom-practice.html` to explore the DOM exercises.
4. Open `daily-challenges/index.html` to try the five daily challenges.

For the best local-storage behavior, open the folder through a local static server (for example, VS Code Live Server).

## Lessons Learned

- `getElementById`, `querySelector`, and `querySelectorAll` return different kinds of results; collection methods and DOM traversal help find related elements.
- Creating elements and setting user-facing content with `textContent` avoids treating input text as HTML.
- Event bubbling and `closest()` make event delegation useful for controls added after page load.
- Form validation, accessible status messages, and focus states make interactive pages easier to use.
- Browser storage is helpful, but it can be unavailable or contain invalid data, so applications should handle those cases.

## Challenges Faced

- Keeping task counts, filters, empty states, and saved data in sync required a single render path after each state change.
- A delegated handler must account for clicks on nested elements, not only the direct event target.
- Browser storage can fail; the to-do app reports when tasks cannot be persisted and remains usable during the current visit.

## Project Files

- `index.html`, `styles.css`, `app.js` — the interactive to-do list.
- `dom-practice.html`, `dom.js` — Lessons 9–10 practice.
- `daily-challenges/` — all five daily challenges and their local image asset.
- `.gitignore` — excludes editor, environment, dependency, and temporary files.

## Repository Naming Note

The course submission guide recommends `iyf-s12-week-05-{your-github-username}`. This repository uses the shorter name requested for this submission: `iyf-s12-week-05`.
