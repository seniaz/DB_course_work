-- AlterTable
ALTER TABLE "book" ADD COLUMN     "deletedat" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "rating" ADD COLUMN     "deletedat" TIMESTAMP(6),
ADD COLUMN     "updatedat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "review" ADD COLUMN     "deletedat" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deletedat" TIMESTAMP(6);

-- Обмеження для оцінки (1.0 - 5.0)
ALTER TABLE "rating" ADD CONSTRAINT "rating_score_check" CHECK ("score" >= 1.0 AND "score" <= 5.0);

-- Кількість сторінок > 0
ALTER TABLE "book" ADD CONSTRAINT "book_pagecount_check" CHECK ("pagecount" > 0);

-- Логіка дат автора
ALTER TABLE "author" ADD CONSTRAINT "author_dates_check" CHECK ("deathdate" IS NULL OR "deathdate" >= "birthdate");

-- Рік заснування видавництва
ALTER TABLE "publisher" ADD CONSTRAINT "publisher_foundedyear_check" CHECK ("foundedyear" >= 1450 AND "foundedyear" <= EXTRACT(YEAR FROM CURRENT_DATE));

-- Довжина відгуку
ALTER TABLE "review" ADD CONSTRAINT "review_text_length_check" CHECK (LENGTH("reviewtext") BETWEEN 10 AND 5000);

-- Валідація Email
ALTER TABLE "users" ADD CONSTRAINT "users_email_check" CHECK ("email" LIKE '%@%');