const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/books.json');

// Get all books
const getBooks = (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const books = JSON.parse(data);
        res.json(books);
    });
};

// Get book by ISBN
const getBookByISBN = (req, res) => {
    const { isbn } = req.params;
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const books = JSON.parse(data);
        const book = books.find(b => b.isbn === isbn);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    });
};

// Get books by author
const getBooksByAuthor = (req, res) => {
    const { author } = req.params;
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const books = JSON.parse(data);
        const authorBooks = books.filter(b => b.author.toLowerCase() === author.toLowerCase());
        if (authorBooks.length === 0) {
            return res.status(404).json({ message: 'No books found for this author' });
        }
        res.json(authorBooks);
    });
};

// Get books by title
const getBooksByTitle = (req, res) => {
    const { title } = req.params;
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const books = JSON.parse(data);
        const titleBooks = books.filter(b => b.title.toLowerCase() === title.toLowerCase());
        if (titleBooks.length === 0) {
            return res.status(404).json({ message: 'No books found with this title' });
        }
        res.json(titleBooks);
    });
};

// Get book reviews
const getBookReview = (req, res) => {
    const { isbn } = req.params;
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const books = JSON.parse(data);
        const book = books.find(b => b.isbn === isbn);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book.reviews);
    });
};

// Add or update a book review
const addOrUpdateReview = (req, res) => {
    const { isbn } = req.params;
    const { rating, comment } = req.body;
    const username = req.user;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const books = JSON.parse(data);
        const book = books.find(b => b.isbn === isbn);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const existingReview = book.reviews.find(review => review.user === username);
        if (existingReview) {
            // Update existing review
            existingReview.rating = rating;
            existingReview.comment = comment;
        } else {
            // Add new review
            book.reviews.push({ user: username, rating, comment });
        }

        fs.writeFile(filePath, JSON.stringify(books, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Review added/updated successfully' });
        });
    });
};

// Delete a book review
const deleteReview = (req, res) => {
    const { isbn } = req.params;
    const username = req.user;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const books = JSON.parse(data);
        const book = books.find(b => b.isbn === isbn);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const reviewIndex = book.reviews.findIndex(review => review.user === username);
        if (reviewIndex === -1) {
            return res.status(404).json({ message: 'Review not found' });
        }

        book.reviews.splice(reviewIndex, 1);

        fs.writeFile(filePath, JSON.stringify(books, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Review deleted successfully' });
        });
    });
};

// Get all books using async callback function
const getBooksAsyncCallback = (callback) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return callback(err, null);
        }
        const books = JSON.parse(data);
        callback(null, books);
    });
};

const getAllBooksCallback = (req, res) => {
    getBooksAsyncCallback((err, books) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(books);
    });
};

// Search by ISBN using promises
const getBookByISBNPromise = (isbn) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }
            const books = JSON.parse(data);
            const book = books.find(b => b.isbn === isbn);
            if (!book) {
                return reject(new Error('Book not found'));
            }
            resolve(book);
        });
    });
};

const getBookByISBNWithPromise = (req, res) => {
    const { isbn } = req.params;

    getBookByISBNPromise(isbn)
        .then(book => res.json(book))
        .catch(err => res.status(500).json({ error: err.message }));
};

// Search by author using async/await
const searchBooksByAuthorAsync = async (author) => {
    const data = await fs.promises.readFile(filePath, 'utf8');
    const books = JSON.parse(data);
    return books.filter(book => book.author.toLowerCase() === author.toLowerCase());
};

const searchBooksByAuthor = async (req, res) => {
    const { author } = req.params;
    try {
        const authorBooks = await searchBooksByAuthorAsync(author);
        if (authorBooks.length === 0) {
            return res.status(404).json({ message: 'No books found for this author' });
        }
        res.json(authorBooks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Search by title using async/await
const searchBooksByTitleAsync = async (title) => {
    const data = await fs.promises.readFile(filePath, 'utf8');
    const books = JSON.parse(data);
    return books.filter(book => book.title.toLowerCase() === title.toLowerCase());
};

const searchBooksByTitle = async (req, res) => {
    const { title } = req.params;
    try {
        const titleBooks = await searchBooksByTitleAsync(title);
        if (titleBooks.length === 0) {
            return res.status(404).json({ message: 'No books found with this title' });
        }
        res.json(titleBooks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getBooks, getBookByISBN, getBooksByAuthor, getBooksByTitle, getBookReview, addOrUpdateReview, deleteReview, getAllBooksCallback, getBookByISBNWithPromise, searchBooksByAuthor, searchBooksByTitle };
