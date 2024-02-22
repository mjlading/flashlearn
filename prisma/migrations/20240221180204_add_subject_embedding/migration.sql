-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "embedding" vector(1536);
