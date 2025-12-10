const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  await prisma.review.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.readingList.deleteMany();
  await prisma.bookAuthor.deleteMany();
  await prisma.bookGenre.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();
  await prisma.author.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.publisher.deleteMany();

  console.log('✅ Database cleared');

  const publishers = await Promise.all([
    prisma.publisher.create({
      data: {
        name: 'The Old Lion Publishing House',
        country: 'Ukraine',
        website: 'https://starylev.com.ua',
        foundedYear: 2014
      }
    }),
    prisma.publisher.create({
      data: {
        name: 'Nash Format',
        country: 'Ukraine',
        website: 'https://nashformat.ua',
        foundedYear: 2014
      }
    }),
    prisma.publisher.create({
      data: {
        name: 'KSD',
        country: 'Ukraine',
        foundedYear: 1995
      }
    })
  ]);
  console.log('✅ Publishers created:', publishers.length);

  const authors = await Promise.all([
    prisma.author.create({
      data: {
        firstName: 'Serhiy',
        lastName: 'Zhadan',
        country: 'Ukraine',
        birthDate: new Date('1974-08-23'),
        biography: 'Ukrainian writer, poet, essayist'
      }
    }),
    prisma.author.create({
      data: {
        firstName: 'Andrey',
        lastName: 'Kurkov',
        country: 'Ukraine',
        birthDate: new Date('1961-04-23'),
        biography: 'Ukrainian writer, bestseller author'
      }
    }),
    prisma.author.create({
      data: {
        firstName: 'Tania',
        lastName: 'Malyarchuk',
        country: 'Ukraine',
        birthDate: new Date('1983-06-04'),
        biography: 'Ukrainian writer and poet'
      }
    }),
    prisma.author.create({
      data: {
        firstName: 'Yurii',
        lastName: 'Andrukhovych',
        country: 'Ukraine',
        birthDate: new Date('1960-03-13'),
        biography: 'Ukrainian writer, poet, essayist'
      }
    }),
    prisma.author.create({
      data: {
        firstName: 'Oksana',
        lastName: 'Zabuzhko',
        country: 'Ukraine',
        birthDate: new Date('1960-09-19'),
        biography: 'Ukrainian writer, poet, philosopher'
      }
    })
  ]);
  console.log('✅ Authors created:', authors.length);

  const genres = await Promise.all([
    prisma.genre.create({
      data: { name: 'Contemporary Prose', description: 'Modern Ukrainian literature' }
    }),
    prisma.genre.create({
      data: { name: 'Poetry', description: 'Ukrainian poetry' }
    }),
    prisma.genre.create({
      data: { name: 'Historical Fiction', description: 'Historical artistic literature' }
    }),
    prisma.genre.create({
      data: { name: 'Philosophical Prose', description: 'Philosophical reflections in prose' }
    }),
    prisma.genre.create({
      data: { name: 'Detective', description: 'Detective novels' }
    })
  ]);
  console.log('✅ Genres created:', genres.length);

  const books = await Promise.all([
    prisma.book.create({
      data: {
        title: 'Voroshilovgrad',
        isbn: '978-617-679-012-3',
        publicationDate: new Date('2010-01-01'),
        description: 'A novel about modern Ukraine, the search for self and the meaning of life',
        pageCount: 448,
        language: 'Ukrainian',
        publisherId: publishers[0].publisherId
      }
    }),
    prisma.book.create({
      data: {
        title: 'The Life of Maria',
        isbn: '978-617-679-234-9',
        publicationDate: new Date('2015-01-01'),
        description: 'Autobiographical novel about the creative development of the writer',
        pageCount: 184,
        language: 'Ukrainian',
        publisherId: publishers[0].publisherId
      }
    }),
    prisma.book.create({
      data: {
        title: 'Fieldwork in Ukrainian Sex',
        isbn: '978-617-585-023-1',
        publicationDate: new Date('1996-01-01'),
        description: 'Cult book of Ukrainian literature of the 90s',
        pageCount: 142,
        language: 'Ukrainian',
        publisherId: publishers[1].publisherId
      }
    }),
    prisma.book.create({
      data: {
        title: 'Death in the Mangitka',
        isbn: '978-966-923-145-6',
        publicationDate: new Date('2005-01-01'),
        description: 'Detective novel with black humor',
        pageCount: 320,
        language: 'Ukrainian',
        publisherId: publishers[2].publisherId
      }
    }),
    prisma.book.create({
      data: {
        title: 'The Orphanage',
        isbn: '978-617-679-456-7',
        publicationDate: new Date('2017-01-01'),
        description: 'A novel about war and survival',
        pageCount: 336,
        language: 'Ukrainian',
        publisherId: publishers[0].publisherId
      }
    })
  ]);
  console.log('✅ Books created:', books.length);

  await Promise.all([
    prisma.bookAuthor.create({
      data: { bookId: books[0].bookId, authorId: authors[0].authorId, authorOrder: 1 }
    }),
    prisma.bookAuthor.create({
      data: { bookId: books[1].bookId, authorId: authors[2].authorId, authorOrder: 1 }
    }),
    prisma.bookAuthor.create({
      data: { bookId: books[2].bookId, authorId: authors[4].authorId, authorOrder: 1 }
    }),
    prisma.bookAuthor.create({
      data: { bookId: books[3].bookId, authorId: authors[1].authorId, authorOrder: 1 }
    }),
    prisma.bookAuthor.create({
      data: { bookId: books[4].bookId, authorId: authors[0].authorId, authorOrder: 1 }
    })
  ]);
  console.log('✅ Books linked to authors');

  await Promise.all([
    prisma.bookGenre.create({
      data: { bookId: books[0].bookId, genreId: genres[0].genreId }
    }),
    prisma.bookGenre.create({
      data: { bookId: books[1].bookId, genreId: genres[3].genreId }
    }),
    prisma.bookGenre.create({
      data: { bookId: books[2].bookId, genreId: genres[3].genreId }
    }),
    prisma.bookGenre.create({
      data: { bookId: books[3].bookId, genreId: genres[4].genreId }
    }),
    prisma.bookGenre.create({
      data: { bookId: books[4].bookId, genreId: genres[0].genreId }
    })
  ]);
  console.log('✅ Books linked to genres');

  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: 'ivan_reader',
        email: 'ivan@example.com',
        password: 'hashed_password_123',
        nickname: 'Ivan'
      }
    }),
    prisma.user.create({
      data: {
        username: 'maria_bookworm',
        email: 'maria@example.com',
        password: 'hashed_password_456',
        nickname: 'Maria'
      }
    }),
    prisma.user.create({
      data: {
        username: 'petro_critic',
        email: 'petro@example.com',
        password: 'hashed_password_789',
        nickname: 'Petro'
      }
    })
  ]);
  console.log('✅ Users created:', users.length);

  await Promise.all([
    prisma.rating.create({
      data: { userId: users[0].userId, bookId: books[0].bookId, score: 5.0 }
    }),
    prisma.rating.create({
      data: { userId: users[0].userId, bookId: books[1].bookId, score: 4.5 }
    }),
    prisma.rating.create({
      data: { userId: users[1].userId, bookId: books[0].bookId, score: 4.8 }
    }),
    prisma.rating.create({
      data: { userId: users[1].userId, bookId: books[2].bookId, score: 4.2 }
    }),
    prisma.rating.create({
      data: { userId: users[2].userId, bookId: books[1].bookId, score: 3.9 }
    }),
    prisma.rating.create({
      data: { userId: users[2].userId, bookId: books[3].bookId, score: 4.7 }
    })
  ]);
  console.log('✅ Ratings created');

  await Promise.all([
    prisma.review.create({
      data: {
        userId: users[0].userId,
        bookId: books[0].bookId,
        reviewText: 'Incredible book! Zhadan perfectly conveys the atmosphere of modern Ukraine.'
      }
    }),
    prisma.review.create({
      data: {
        userId: users[1].userId,
        bookId: books[0].bookId,
        reviewText: 'Very atmospheric novel. Highly recommend to everyone!'
      }
    }),
    prisma.review.create({
      data: {
        userId: users[2].userId,
        bookId: books[1].bookId,
        reviewText: 'Malyarchuk knows how to write about complex things simply and beautifully.'
      }
    })
  ]);
  console.log('✅ Reviews created');

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });