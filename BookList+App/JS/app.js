/** BOOK CLASS: Represents a Book */
class Book {
	constructor(title, author, isbn) {
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}

/** UI CLASS:   Handle UI Tasks */
class UI {
	static displayBooks() {
		const books = Store.getBooks();
		books.forEach((book) => {
			UI.addBookToList(book);
		});
	}
	static addBookToList(book) {
		const list = document.querySelector("#book-list");
		const row = document.createElement("tr");
		row.innerHTML = `
			<td>${book.title}</td>
			<td>${book.author}</td>
			<td>${book.isbn}</td>
			<td>
				<a href="#" class="btn btn-danger btn-sm delete">X</a>
			</td>
		`;
		list.appendChild(row);
	}

	static showAlert(message, className) {
		const div = document.createElement("div");
		div.className = `alert alert-${className}`;
		div.appendChild(document.createTextNode(message));
		const container = document.querySelector(".container");
		const form = document.querySelector("#book-form");
		container.insertBefore(div, form);
		// Vanish in 3 seconds
		setTimeout(() => document.querySelector(".alert").remove(), 3000);
	}

	static clearFields() {
		document.querySelector("#title").value = "";
		document.querySelector("#author").value = "";
		document.querySelector("#isbn").value = "";
	}

	static deleteBook(el) {
		if (el.classList.contains("delete")) {
			el.parentElement.parentElement.remove();
			// Show success message
			UI.showAlert("Book Removed", "info");
		}
	}
}

/** STORE CLASS:   Handles Storage */
class Store {
	static getBooks() {
		let books;
		if (localStorage.getItem("books") === null) {
			books = [];
		} else {
			books = JSON.parse(localStorage.getItem("books"));
		}
		return books;
	}

	static addBook(book) {
		const books = Store.getBooks();
		books.push(book);
		localStorage.setItem("books", JSON.stringify(books));
	}
	static removeBook(isbn) {
		// we are using isbn because its unique so that we can get an exact book not books written by the same writter or books with the same title/we don't have to write a complex function
		const books = Store.getBooks();

		books.forEach((book, index) => {
			if (book.isbn === isbn) {
				books.splice(index, 1);
			}
		});
		localStorage.setItem("books", JSON.stringify(books));
	}
}

/** Event: Display Books */
document.addEventListener("DOMContentLoaded", UI.displayBooks);

/** Event: Add a Book */
document.querySelector("#book-form").addEventListener("submit", (e) => {
	// Prevent actual submit
	e.preventDefault();

	// Get form values
	const title = document.querySelector("#title").value;
	const author = document.querySelector("#author").value;
	const isbn = document.querySelector("#isbn").value;

	// Validate
	if (title === "" || author === "" || isbn === "") {
		UI.showAlert("Please fill in all fields", "danger");
	} else {
		// Instantiate book
		const book = new Book(title, author, isbn);

		// Add Book to UI
		UI.addBookToList(book);
		UI.showAlert("Book Added", "success");

		// Add book to store
		Store.addBook(book);

		// Clear fields
		UI.clearFields();
	}
});

/** Event: Remove a Book */
document.querySelector("#book-list").addEventListener("click", (e) => {
	const title =
		e.target.parentElement.previousElementSibling.previousElementSibling
			.previousElementSibling.textContent;
	const author =
		e.target.parentElement.previousElementSibling.previousElementSibling
			.textContent;
	const isbn = e.target.parentElement.previousElementSibling.textContent;
	const answer = confirm(`You are removing ${title} by ${author}`);
	if (answer === true) {
		// Remove book from UI
		UI.deleteBook(e.target);

		// Remove book from Store
		Store.removeBook(isbn);
	}
});
