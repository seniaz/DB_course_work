-- CreateTable
CREATE TABLE "author" (
    "authorid" SERIAL NOT NULL,
    "firstname" VARCHAR(50) NOT NULL,
    "middlename" VARCHAR(50),
    "lastname" VARCHAR(50) NOT NULL,
    "country" VARCHAR(50),
    "birthdate" DATE,
    "deathdate" DATE,
    "photourl" TEXT,
    "biography" TEXT,

    CONSTRAINT "author_pkey" PRIMARY KEY ("authorid")
);

-- CreateTable
CREATE TABLE "book" (
    "bookid" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "isbn" VARCHAR(17),
    "publicationdate" DATE,
    "description" TEXT,
    "pagecount" INTEGER,
    "language" VARCHAR(50) NOT NULL DEFAULT 'English',
    "coverurl" TEXT,
    "publisherid" INTEGER,

    CONSTRAINT "book_pkey" PRIMARY KEY ("bookid")
);

-- CreateTable
CREATE TABLE "bookauthor" (
    "bookid" INTEGER NOT NULL,
    "authorid" INTEGER NOT NULL,
    "authororder" INTEGER NOT NULL,

    CONSTRAINT "bookauthor_pkey" PRIMARY KEY ("bookid","authorid")
);

-- CreateTable
CREATE TABLE "bookgenre" (
    "bookid" INTEGER NOT NULL,
    "genreid" INTEGER NOT NULL,

    CONSTRAINT "bookgenre_pkey" PRIMARY KEY ("bookid","genreid")
);

-- CreateTable
CREATE TABLE "genre" (
    "genreid" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,

    CONSTRAINT "genre_pkey" PRIMARY KEY ("genreid")
);

-- CreateTable
CREATE TABLE "publisher" (
    "publisherid" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "country" VARCHAR(50),
    "website" TEXT,
    "foundedyear" INTEGER,

    CONSTRAINT "publisher_pkey" PRIMARY KEY ("publisherid")
);

-- CreateTable
CREATE TABLE "rating" (
    "ratingid" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "bookid" INTEGER NOT NULL,
    "score" DECIMAL(2,1) NOT NULL,

    CONSTRAINT "rating_pkey" PRIMARY KEY ("ratingid")
);

-- CreateTable
CREATE TABLE "readinglist" (
    "readinglistid" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "bookid" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "addeddate" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "readinglist_pkey" PRIMARY KEY ("readinglistid")
);

-- CreateTable
CREATE TABLE "review" (
    "reviewid" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "bookid" INTEGER NOT NULL,
    "reviewtext" TEXT NOT NULL,
    "reviewdate" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lasteditdate" TIMESTAMP(6),

    CONSTRAINT "review_pkey" PRIMARY KEY ("reviewid")
);

-- CreateTable
CREATE TABLE "users" (
    "userid" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "nickname" VARCHAR(50),
    "avatarurl" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userid")
);

-- CreateIndex
CREATE UNIQUE INDEX "book_isbn_key" ON "book"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "genre_name_key" ON "genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "rating_userid_bookid_key" ON "rating"("userid", "bookid");

-- CreateIndex
CREATE UNIQUE INDEX "readinglist_userid_bookid_key" ON "readinglist"("userid", "bookid");

-- CreateIndex
CREATE UNIQUE INDEX "review_userid_bookid_key" ON "review"("userid", "bookid");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "book" ADD CONSTRAINT "book_publisherid_fkey" FOREIGN KEY ("publisherid") REFERENCES "publisher"("publisherid") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookauthor" ADD CONSTRAINT "bookauthor_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "author"("authorid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookauthor" ADD CONSTRAINT "bookauthor_bookid_fkey" FOREIGN KEY ("bookid") REFERENCES "book"("bookid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookgenre" ADD CONSTRAINT "bookgenre_bookid_fkey" FOREIGN KEY ("bookid") REFERENCES "book"("bookid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookgenre" ADD CONSTRAINT "bookgenre_genreid_fkey" FOREIGN KEY ("genreid") REFERENCES "genre"("genreid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_bookid_fkey" FOREIGN KEY ("bookid") REFERENCES "book"("bookid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_bookid_fkey" FOREIGN KEY ("bookid") REFERENCES "book"("bookid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE CASCADE ON UPDATE NO ACTION;
