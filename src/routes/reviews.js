const express = require('express');
const prisma = require('../db');
const router = express.Router();

router.post('/full', async (req, res, next) => {
  try {
    const { userId, bookId, score, reviewText } = req.body;

    if (!userId || !bookId || !score || !reviewText) {
      return res.status(400).json({ 
        error: 'Усі поля обов\'язкові: userId, bookId, score, reviewText' 
      });
    }

    if (score < 1.0 || score > 5.0) {
      return res.status(400).json({ error: 'Оцінка має бути від 1.0 до 5.0' });
    }

    if (reviewText.length < 10 || reviewText.length > 5000) {
      return res.status(400).json({ 
        error: 'Довжина відгуку: 10-5000 символів' 
      });
    }


    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ 
        where: { userId: parseInt(userId) } 
      });
      
      if (!user) throw new Error('USER_NOT_FOUND');
      if (user.deletedAt) throw new Error('USER_DELETED');

      const existing = await tx.rating.findUnique({
        where: { 
          userId_bookId: { 
            userId: parseInt(userId), 
            bookId: parseInt(bookId) 
          } 
        }
      });

      if (existing && !existing.deletedAt) {
        throw new Error('DUPLICATE_RATING');
      }

      const rating = await tx.rating.create({
        data: {
          userId: parseInt(userId),
          bookId: parseInt(bookId),
          score: parseFloat(score)
        }
      });

      const review = await tx.review.create({
        data: {
          userId: parseInt(userId),
          bookId: parseInt(bookId),
          reviewText: reviewText
        }
      });

      return { rating, review };
    });

    res.status(201).json({
      message: 'Рейтинг та відгук створено',
      data: result
    });

  } catch (err) {
    if (err.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }
    if (err.message === 'USER_DELETED') {
      return res.status(403).json({ error: 'Користувач видалений' });
    }
    if (err.message === 'DUPLICATE_RATING') {
      return res.status(409).json({ error: 'Ви вже оцінили цю книгу' });
    }
    next(err);
  }
});

module.exports = router;