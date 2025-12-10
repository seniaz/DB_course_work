const request = require('supertest');
const app = require('../src/index');
const prisma = require('../src/db');

describe('Task 3: Cascade Deletion', () => {
  let testUserId, testBookId;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        username: 'test_task3',
        email: 'test_task3@test.com',
        password: 'test123'
      }
    });
    testUserId = user.userId;

    const book = await prisma.book.create({
      data: {
        title: 'Test Book 3',
        pageCount: 300
      }
    });
    testBookId = book.bookId;

    await prisma.rating.create({
      data: { userId: testUserId, bookId: testBookId, score: 4.0 }
    });

    await prisma.review.create({
      data: {
        userId: testUserId,
        bookId: testBookId,
        reviewText: 'Test review'
      }
    });
  });

  afterAll(async () => {
    await prisma.review.deleteMany({ where: { userId: testUserId } });
    await prisma.rating.deleteMany({ where: { userId: testUserId } });
    await prisma.user.delete({ where: { userId: testUserId } });
    await prisma.book.delete({ where: { bookId: testBookId } });
    await prisma.$disconnect();
  });

  test('should soft delete user and their data', async () => {
    const res = await request(app)
      .delete(`/api/users/${testUserId}/deactivate`);

    expect(res.statusCode).toBe(200);

    const user = await prisma.user.findUnique({
      where: { userId: testUserId }
    });
    expect(user.deletedAt).not.toBeNull();

    const ratings = await prisma.rating.findMany({
      where: { userId: testUserId }
    });
    expect(ratings[0].deletedAt).not.toBeNull();
  });
});