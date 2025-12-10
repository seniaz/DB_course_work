const request = require('supertest');
const app = require('../src/index');
const prisma = require('../src/db');

describe('Task 2: Optimistic Locking', () => {
  let testUserId, testRatingId, testBookId;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        username: 'test_task2',
        email: 'test_task2@test.com',
        password: 'test123'
      }
    });
    testUserId = user.userId;

    const book = await prisma.book.create({
      data: {
        title: 'Test Book 2',
        pageCount: 200
      }
    });
    testBookId = book.bookId;

    const rating = await prisma.rating.create({
      data: { userId: testUserId, bookId: testBookId, score: 3.0 }
    });
    testRatingId = rating.ratingId;
  });

  afterAll(async () => {
    await prisma.rating.deleteMany({ where: { userId: testUserId } });
    await prisma.user.delete({ where: { userId: testUserId } });
    await prisma.book.delete({ where: { bookId: testBookId } });
    await prisma.$disconnect();
  });

  test('should update with correct timestamp', async () => {
    const current = await prisma.rating.findUnique({
      where: { ratingId: testRatingId }
    });

    const res = await request(app)
      .put(`/api/ratings/${testRatingId}/safe`)
      .send({
        score: 5.0,
        lastUpdatedAt: current.updatedAt.toISOString()
      });

    expect(res.statusCode).toBe(200);
  });

  test('should return 409 with old timestamp', async () => {
    const res = await request(app)
      .put(`/api/ratings/${testRatingId}/safe`)
      .send({
        score: 1.0,
        lastUpdatedAt: new Date('2020-01-01').toISOString()
      });

    expect(res.statusCode).toBe(409);
  });
});