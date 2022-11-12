/**
 * The Book Class
 */
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

/**
 * Manage Books in LocalStorage
 */
class BookApi {
  static getBooks() {
    const booksFromStorage = JSON.parse(localStorage.getItem('books'));
    if (booksFromStorage === null) {
      return [];
    } else {
      return booksFromStorage;
    }
  }

  static getBookByIsbn(isbn) {
    const books = JSON.parse(localStorage.getItem('books'));
    if (books) {
      return books.find((b) => b.isbn === isbn);
    } else {
      return null;
    }
  }

  static addBook(book) {
    let books = [];
    books = this.getBooks();
    books.push(book);
    this.saveToLocalStorage(books);
  }

  static deleteBook(isbn) {
    let books = [];
    books = this.getBooks();
    const idx = books.findIndex((b) => b.isbn === isbn);
    books.splice(idx, 1);
    this.saveToLocalStorage(books);
  }

  static saveToLocalStorage(books) {
    localStorage.setItem('books', JSON.stringify(books));
  }
}

// UI Events and Elements
const bookForm = document.querySelector('#bookForm');
const submitButton = document.getElementById('submitButton');
const title = document.getElementById('title');
const author = document.getElementById('author');
const isbn = document.getElementById('isbn');
const tbody = document.querySelector('#bookList');

/**
 * Update UI elements with book
 * @param {Book} book the book to be updated
 */
const updateTable = (book) => {
  const tr = document.createElement('tr');

  tr.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><button class="btn btn-danger btn-sm delete">X</button></td>`;

  tbody.appendChild(tr);
};

document.addEventListener('DOMContentLoaded', (event) => {
  let books = [];
  books = BookApi.getBooks();

  if (books?.length > 0) {
    books.forEach((book) => {
      updateTable(book);
    });
  }
});

bookForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (title.value === '' || author.value === '' || isbn.value === '') {
    // Show Error
  } else {
    const book = new Book(title.value, author.value, isbn.value);
    updateTable(book);
    BookApi.addBook(book);
  }
});

tbody.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete')) {
    const deleteButton = event.target;
    const tr = deleteButton.parentElement.parentElement;
    tr.remove();

    const isbnCell = deleteButton.parentElement.previousElementSibling;
    console.log({ isbnCell });
    const isbn = isbnCell.textContent;

    BookApi.deleteBook(isbn);
  }
});
