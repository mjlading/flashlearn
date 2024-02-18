/*
  Warnings:

  - Changed the type of `academicLevel` on the `Deck` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AcademicLevel" AS ENUM ('MIDDLE_SCHOOL', 'HIGH_SCHOOL', 'BACHELOR', 'MASTER', 'PHD');

-- AlterTable
ALTER TABLE "Deck" DROP COLUMN "academicLevel",
ADD COLUMN     "academicLevel" "AcademicLevel" NOT NULL;
