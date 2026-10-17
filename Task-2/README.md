# Interactive To-Do List with LocalStorage

A task manager built with plain HTML, CSS and JavaScript (no libraries).

## Features
- Add tasks with the **Add task** button or the **Enter** key
- Mark tasks complete / incomplete (checkbox or click the text)
- Delete tasks
- Filter by All / Active / Completed, and clear completed tasks
- Tasks persist after page reload using `localStorage`

## How to run
Open `index.html` in any modern browser. No install or server needed.

## Concepts demonstrated
- DOM manipulation (`createElement`, `append`, `textContent`)
- Event listeners (`submit`, `click`, `change`, `input`)
- State handling (a `tasks` array that drives `render()`)
- Browser storage (`localStorage.getItem` / `setItem` with JSON)

## Files
- `index.html` - page structure
- `style.css` - styling
- `script.js` - app logic
