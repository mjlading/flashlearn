/*
  Warnings:

  - You are about to drop the column `dateEnd` on the `Rehearsal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Rehearsal" DROP COLUMN "dateEnd",
ADD COLUMN     "isFinished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "timeSpent" INTEGER NOT NULL DEFAULT 0;
