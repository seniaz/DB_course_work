const request = require('supertest');
const app = require('../src/index');
const prisma = require('../src/db');

describe('Task 1: Complex Creation', () => {
  let testUserId, testBookId;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        username: 'test_task1',
        email: 'test_task1@test.com',
        password: 'test123'
      }
    });
    testUserId = user.userId;

    const book = await prisma.book.create({
      data: {
        title: 'Test Book 1',
        pageCount: 100
      }
    });
    testBookId = book.bookId;
  });

  afterAll(async () => {
    await prisma.review.deleteMany({ where: { userId: testUserId } });
    await prisma.rating.deleteMany({ where: { userId: testUserId } });
    await prisma.user.delete({ where: { userId: testUserId } });
    await prisma.book.delete({ where: { bookId: testBookId } });
    await prisma.$disconnect();
  });

  test('should create rating AND review', async () => {
    const res = await request(app)
      .post('/api/reviews/full')
      .send({
        userId: testUserId,
        bookId: testBookId,
        score: 4.5,
        reviewText: 'Great book! Highly recommended.'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.rating).toBeDefined();
    expect(res.body.data.review).toBeDefined();
  });

  test('should return 409 on duplicate', async () => {
    const res = await request(app)
      .post('/api/reviews/full')
      .send({
        userId: testUserId,
        bookId: testBookId,
        score: 5.0,
        reviewText: 'Duplicate attempt'
      });

    expect(res.statusCode).toBe(409);
  });
});