const express = require('express');
const prisma = require('./db');

const router = express.Router();

router.post('/create-book-with-authors', async (req, res, next) => {
  const { title, authors, publisherId, year } = req.body;

  if (!title || !Array.isArray(authors) || authors.length === 0) {
    return res.status(400).json({
      error: 'Invalid input data'
    });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const book = await tx.book.create({
        data: {
          title,
          year,
          publisherId
        }
      });

      for (const authorName of authors) {
        const author = await tx.author.upsert({
          where: { name: authorName },
          update: {},
          create: { name: authorName }
        });

        await tx.bookAuthor.create({
          data: {
            bookId: book.id,
            authorId: author.id
          }
        });
      }

      return tx.book.findUnique({
        where: { id: book.id },
        include: {
          authors: {
            include: { author: true }
          }
        }
      });
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;