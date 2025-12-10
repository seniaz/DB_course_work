const express = require('express');
const prisma = require('../db');
const router = express.Router();

router.delete('/:id/deactivate', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const now = new Date();

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { userId }
      });

      if (!user) throw new Error('NOT_FOUND');
      if (user.deletedAt) throw new Error('ALREADY_DELETED');

      await tx.rating.updateMany({
        where: { userId, deletedAt: null },
        data: { deletedAt: now }
      });

      await tx.review.updateMany({
        where: { userId, deletedAt: null },
        data: { deletedAt: now }
      });

      return await tx.user.update({
        where: { userId },
        data: { deletedAt: now }
      });
    });

    res.json({ message: 'Деактивовано', data: result });

  } catch (err) {
    if (err.message === 'NOT_FOUND') {
      return res.status(404).json({ error: 'Не знайдено' });
    }
    if (err.message === 'ALREADY_DELETED') {
      return res.status(410).json({ error: 'Вже видалено' });
    }
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    
    const user = await prisma.user.findUnique({
      where: { userId },
      include: {
        ratings: { 
          where: { deletedAt: null },
          include: { book: true }
        },
        reviews: { 
          where: { deletedAt: null },
          include: { book: true }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    res.json({ data: user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;