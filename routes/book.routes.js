const express = require('express');
const router = express.Router();
const { getBooks, getBookByISBN, getBooksByAuthor, getBooksByTitle, getBookReview, addOrUpdateReview, deleteReview, getAllBooksCallback, getBookByISBNWithPromise, searchBooksByAuthor, searchBooksByTitle } = require('../controllers/book.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.get('/books', getBooks);
router.get('/books/isbn/:isbn', getBookByISBN);
router.get('/books/author/:author', getBooksByAuthor);
router.get('/books/title/:title', getBooksByTitle);
router.get('/books/review/:isbn', getBookReview);

// Protected routes
router.post('/books/:isbn/review', authMiddleware, addOrUpdateReview);
router.delete('/books/:isbn/review', authMiddleware, deleteReview);

// Async callback and promises
router.get('/books/callback', getAllBooksCallback);
router.get('/books/promise/isbn/:isbn', getBookByISBNWithPromise);
router.get('/books/async/author/:author', searchBooksByAuthor);
router.get('/books/async/title/:title', searchBooksByTitle);

module.exports = router;
