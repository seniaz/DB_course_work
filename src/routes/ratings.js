const express = require('express');
const prisma = require('../db');
const router = express.Router();

router.put('/:id/safe', async (req, res, next) => {
  try {
    const ratingId = parseInt(req.params.id);
    const { score, lastUpdatedAt } = req.body;

    if (!score || !lastUpdatedAt) {
      return res.status(400).json({ 
        error: 'Необхідні поля: score, lastUpdatedAt' 
      });
    }

    if (score < 1.0 || score > 5.0) {
      return res.status(400).json({ error: 'Оцінка: 1.0-5.0' });
    }

    const result = await prisma.$transaction(async (tx) => {
      const current = await tx.rating.findUnique({
        where: { ratingId }
      });

      if (!current) throw new Error('NOT_FOUND');
      if (current.deletedAt) throw new Error('DELETED');

      const dbTime = new Date(current.updatedAt).getTime();
      const clientTime = new Date(lastUpdatedAt).getTime();

      if (dbTime !== clientTime) throw new Error('CONFLICT');

      return await tx.rating.update({
        where: { ratingId },
        data: { score: parseFloat(score) }
      });
    });

    res.json({ message: 'Оновлено', data: result });

  } catch (err) {
    if (err.message === 'NOT_FOUND') {
      return res.status(404).json({ error: 'Не знайдено' });
    }
    if (err.message === 'DELETED') {
      return res.status(410).json({ error: 'Видалено' });
    }
    if (err.message === 'CONFLICT') {
      return res.status(409).json({ 
        error: 'Дані застаріли. Оновіть сторінку.' 
      });
    }
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { userId, bookId, minScore } = req.query;
    
    const where = { deletedAt: null };
    if (userId) where.userId = parseInt(userId);
    if (bookId) where.bookId = parseInt(bookId);
    if (minScore) where.score = { gte: parseFloat(minScore) };

    const ratings = await prisma.rating.findMany({
      where,
      include: {
        user: { select: { username: true } },
        book: { select: { title: true } }
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json({ data: ratings });
  } catch (err) {
    next(err);
  }
});

module.exports = router;