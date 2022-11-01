import { db } from '../src/utils/db.server';

type Author = {
  firstName: string;
  lastName: string;
};

type Book = {
  title: string;
  isFiction: boolean;
  datePublished: Date;
};

function getAuthors(): Array<Author> {
  return [
    {
      firstName: 'John',
      lastName: 'Doe',
    },
    {
      firstName: 'William',
      lastName: 'Shakespeare',
    },
    {
      firstName: 'Art',
      lastName: 'Vandelay',
    },
  ];
}

function getBooks(): Array<Book> {
  return [
    {
      title: 'Coffee Table Book About Coffee Tables',
      isFiction: false,
      datePublished: new Date(),
    },
    {
      title: 'Macbeth',
      isFiction: false,
      datePublished: new Date(),
    },
    {
      title: 'The Cat in the Hat',
      isFiction: true,
      datePublished: new Date(),
    },
  ];
}

async function clearDb() {
  const deleteBooks = db.book.deleteMany();
  const deleteAuthors = db.author.deleteMany();
  await db.$transaction([deleteBooks, deleteAuthors]);
}

async function seed() {
  // Clear DB before seeding
  await clearDb();

  // Seed Authors
  await Promise.all(
    getAuthors().map((author) => {
      return db.author.create({
        data: {
          firstName: author.firstName,
          lastName: author.lastName,
        },
      });
    })
  );

  // Get one of the seeded Authors
  const author = await db.author.findFirst({
    where: {
      firstName: 'Art',
    },
  });

  // Throw error if Author does not exist
  if (!author) {
    throw new Error('Author not found.');
    console.error('Author not found.');
    return;
  }

  // Seed Books
  await Promise.all(
    getBooks().map((book) => {
      const { title, isFiction, datePublished } = book;
      return db.book.create({
        data: {
          title,
          isFiction,
          datePublished,
          authorId: author.id,
        },
      });
    })
  );
}

// Call seed
seed();
