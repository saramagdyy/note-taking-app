// Get elements
const form = document.getElementById('note-form');
const noteTitleInput = document.getElementById('note-title');
const noteContentInput = document.getElementById('note-content');
const noteTagInput = document.getElementById('note-tag');
const notesList = document.getElementById('notes-list');
const darkModeToggle = document.getElementById('toggle-dark-mode');
const searchBar = document.getElementById('search-bar');

// Load notes from localStorage
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let darkMode = JSON.parse(localStorage.getItem('darkMode')) || false;

// Function to render notes
function renderNotes(filter = '') {
    notesList.innerHTML = '';
    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(filter.toLowerCase()) ||
        note.content.toLowerCase().includes(filter.toLowerCase())
    );
    
    filteredNotes.forEach((note, index) => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');
        noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            ${note.tag ? `<p class="tag">Tag: ${note.tag}</p>` : ''}
            <div class="actions">
                <button onclick="pinNote(${index})">${note.pinned ? 'Unpin' : 'Pin'}</button>
                <button onclick="editNote(${index})">Edit</button>
                <button onclick="deleteNote(${index})">Delete</button>
            </div>
        `;
        notesList.appendChild(noteElement);
    });
}

// Add new note
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newNote = {
        title: noteTitleInput.value,
        content: noteContentInput.value,
        tag: noteTagInput.value,
        pinned: false
    };
    notes.push(newNote);
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
    form.reset();
});

// Edit note
function editNote(index) {
    const note = notes[index];
    noteTitleInput.value = note.title;
    noteContentInput.value = note.content;
    noteTagInput.value = note.tag;
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
}

// Delete note
function deleteNote(index) {
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
}

// Pin note to the top
function pinNote(index) {
    notes[index].pinned = !notes[index].pinned;
    notes = notes.sort((a, b) => b.pinned - a.pinned); // Pinned notes go to the top
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
}

// Dark mode toggle
darkModeToggle.addEventListener('click', () => {
    darkMode = !darkMode;
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    applyDarkMode();
});

// Apply dark mode based on localStorage
function applyDarkMode() {
    if (darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// Search notes
searchBar.addEventListener('input', (e) => {
    renderNotes(e.target.value);
});

// Initial render
renderNotes();
applyDarkMode();
