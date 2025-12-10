const express = require('express');
const prisma = require('../db');
const router = express.Router();

router.get('/user-activity', async (req, res, next) => {
  try {
    const result = await prisma.$queryRaw`
      WITH user_ratings AS (
        SELECT 
          u.userid,
          u.username,
          u.email,
          COUNT(DISTINCT r.ratingid) as rating_count,
          AVG(r.score) as avg_score
        FROM users u
        LEFT JOIN rating r ON u.userid = r.userid AND r.deletedat IS NULL
        WHERE u.deletedat IS NULL
        GROUP BY u.userid, u.username, u.email
      ),
      user_reviews AS (
        SELECT 
          u.userid,
          COUNT(DISTINCT rv.reviewid) as review_count
        FROM users u
        LEFT JOIN review rv ON u.userid = rv.userid AND rv.deletedat IS NULL
        WHERE u.deletedat IS NULL
        GROUP BY u.userid
      )
      SELECT 
        ur.userid,
        ur.username,
        ur.email,
        ur.rating_count,
        urv.review_count,
        ROUND(CAST(ur.avg_score AS numeric), 2) as avg_score
      FROM user_ratings ur
      INNER JOIN user_reviews urv ON ur.userid = urv.userid
      WHERE ur.rating_count >= 2
      HAVING ROUND(CAST(ur.avg_score AS numeric), 2) > 3.0
      ORDER BY ur.rating_count DESC, ur.avg_score DESC
      LIMIT 20;
    `;

    res.json({
      message: 'Статистика активності користувачів',
      data: result
    });

  } catch (err) {
    next(err);
  }
});

router.get('/books-stats', async (req, res, next) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT 
        b.bookid,
        b.title,
        COUNT(DISTINCT r.ratingid) as rating_count,
        ROUND(AVG(r.score), 2) as avg_rating,
        COUNT(DISTINCT rv.reviewid) as review_count,
        COUNT(DISTINCT ba.authorid) as author_count
      FROM book b
      LEFT JOIN rating r ON b.bookid = r.bookid AND r.deletedat IS NULL
      LEFT JOIN review rv ON b.bookid = rv.bookid AND rv.deletedat IS NULL
      LEFT JOIN bookauthor ba ON b.bookid = ba.bookid
      WHERE b.deletedat IS NULL
      GROUP BY b.bookid, b.title
      HAVING COUNT(DISTINCT r.ratingid) > 0
      ORDER BY avg_rating DESC, rating_count DESC
      LIMIT 30;
    `;

    res.json({
      message: 'Статистика по книгах',
      data: result
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;