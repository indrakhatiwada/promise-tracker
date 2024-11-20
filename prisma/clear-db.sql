-- Clear all tables while respecting foreign key constraints
TRUNCATE TABLE "Session" CASCADE;
TRUNCATE TABLE "Account" CASCADE;
TRUNCATE TABLE "User" CASCADE;
TRUNCATE TABLE "Promise" CASCADE;
TRUNCATE TABLE "Party" CASCADE;
TRUNCATE TABLE "VerificationToken" CASCADE;
