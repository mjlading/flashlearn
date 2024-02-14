/*
  Warnings:

  - Added the required column `mode` to the `Rehearsal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Mode" AS ENUM ('VISUAL', 'WRITE', 'ORAL');

-- AlterTable
ALTER TABLE "Rehearsal" ADD COLUMN     "mode" "Mode" NOT NULL;
