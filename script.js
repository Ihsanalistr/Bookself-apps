let books = [];
let currentBookToDelete = null;
let currentBookToEdit = null;

function addBook() {
  const title = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookAuthor').value;
  const year = document.getElementById('inputBookYear').value;
  const isComplete = document.getElementById('inputBookIsComplete').checked;

  if (title === '' || author === '' || year === '') {
    alert('Semua field harus diisi!');
    return;
  }

  const book = {
    id: Date.now(),
    title,
    author,
    year,
    isComplete,
  };

  books.push(book);
  updateBookshelf();
  updateLocalStorage();

  document.getElementById('inputBookTitle').value = '';
  document.getElementById('inputBookAuthor').value = '';
  document.getElementById('inputBookYear').value = '';
  document.getElementById('inputBookIsComplete').checked = false;
}

function toggleBookStatus(id) {
  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    updateBookshelf();
    updateLocalStorage();
  }
}

function closeDeleteBookModal() {
  const deleteBookModal = document.getElementById('deleteBookModal');
  deleteBookModal.style.display = 'none';
}

function deleteBookConfirmed() {
  if (currentBookToDelete !== null) {
    const bookIndex = books.findIndex((book) => book.id === currentBookToDelete);
    if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      updateBookshelf();
      updateLocalStorage();
    }

    closeDeleteBookModal();

    currentBookToDelete = null;
  }
}

function deleteBook(id) {
  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex !== -1) {
    currentBookToDelete = id;

    const deleteBookModal = document.getElementById('deleteBookModal');
    deleteBookModal.style.display = 'block';
  }
}

function editBook(id) {
  const bookToEdit = books.find((book) => book.id === id);

  if (!bookToEdit) {
    return;
  }

  const editBookModal = document.getElementById('editBookModal');
  editBookModal.style.display = 'block';

  document.getElementById('editBookTitle').value = bookToEdit.title;
  document.getElementById('editBookAuthor').value = bookToEdit.author;
  document.getElementById('editBookYear').value = bookToEdit.year;
  document.getElementById('editBookIsComplete').checked = bookToEdit.isComplete;

  currentBookToEdit = id;
}

function closeEditBookModal() {
  const editBookModal = document.getElementById('editBookModal');
  editBookModal.style.display = 'none';
}

document.getElementById('editBookForm').addEventListener('submit', function (e) {
  e.preventDefault();

  if (currentBookToEdit !== null) {
    const editedBook = {
      id: currentBookToEdit,
      title: document.getElementById('editBookTitle').value.trim(),
      author: document.getElementById('editBookAuthor').value.trim(),
      year: parseInt(document.getElementById('editBookYear').value),
      isComplete: document.getElementById('editBookIsComplete').checked,
    };

    const bookIndex = books.findIndex((book) => book.id === currentBookToEdit);

    if (bookIndex !== -1) {
      books[bookIndex] = editedBook;
      updateBookshelf();
      updateLocalStorage();
    }

    closeEditBookModal();

    currentBookToEdit = null;
  }
});

function updateBookshelf(booksToShow = books) {
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  const completeBookshelfList = document.getElementById('completeBookshelfList');

  incompleteBookshelfList.innerHTML = '';
  completeBookshelfList.innerHTML = '';

  booksToShow.forEach((book) => {
    const bookItem = document.createElement('article');
    bookItem.classList.add('book_item');
    bookItem.innerHTML = `
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>
            <div class="action">
                <button class="${book.isComplete ? 'green' : 'red'}" onclick="toggleBookStatus(${book.id})">
                    ${book.isComplete ? 'Selesai dibaca' : 'Belum selesai dibaca'}
                </button>
                <button class="red" onclick="deleteBook(${book.id})">Hapus buku</button>
            </div>
        `;

    const editButton = document.createElement('button');
    editButton.classList.add('blue');
    editButton.classList.add('yellow');
    editButton.textContent = 'Edit buku';
    editButton.onclick = function () {
      editBook(book.id);
    };

    bookItem.querySelector('.action').appendChild(editButton);

    if (book.isComplete) {
      completeBookshelfList.appendChild(bookItem);
    } else {
      incompleteBookshelfList.appendChild(bookItem);
    }
  });
}

function updateLocalStorage() {
  localStorage.setItem('books', JSON.stringify(books));
}

function loadFromLocalStorage() {
  const storedBooks = localStorage.getItem('books');

  if (storedBooks) {
    books = JSON.parse(storedBooks);
    updateBookshelf();
  }
}

document.getElementById('inputBook').addEventListener('submit', function (e) {
  e.preventDefault();
  addBook();
});

document.getElementById('searchBook').addEventListener('submit', function (e) {
  e.preventDefault();
  console.log('click cari');
  const searchTerm = document.getElementById('searchBookTitle').value.toLowerCase();
  const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchTerm));
  updateBookshelf(filteredBooks);
});

loadFromLocalStorage();
