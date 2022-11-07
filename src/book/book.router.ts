import express from 'express';
import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import * as BookService from './book.service';

export const bookRouter = express.Router();

// GET: List of all Books
bookRouter.get('/', async (req: Request, res: Response) => {
  try {
    const books = await BookService.listBooks();
    return res.status(200).json(books);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
});

// GET: A single Book by ID
bookRouter.get('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    const book = await BookService.getBook(id);
    return res.status(200).json(book);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// POST: Create a book
bookRouter.post(
  '/',
  body('title').isString(),
  body('authorId').isInt(),
  body('datePublished').isDate().toDate(),
  body('isFiction').isBoolean(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const book = req.body;
      const newBook = await BookService.createBook(book);
      return res.status(201).json(newBook);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

// PUT: Update a book
bookRouter.put(
  '/:id',
  body('title').isString(),
  body('authorId').isInt(),
  body('datePublished').isDate().toDate(),
  body('isFiction').isBoolean(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id: number = parseInt(req.params.id, 10);
    try {
      const book = req.body;
      const updatedBook = await BookService.updateBook(book, id);
      return res.status(201).json(updatedBook);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

// DELETE: Delete a Book
bookRouter.delete('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    await BookService.deleteBook(id);
    return res.status(204).json('Book successfully deleted');
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});
