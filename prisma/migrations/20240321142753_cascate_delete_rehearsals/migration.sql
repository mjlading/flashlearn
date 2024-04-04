-- DropForeignKey
ALTER TABLE "Rehearsal" DROP CONSTRAINT "Rehearsal_deckId_fkey";

-- AddForeignKey
ALTER TABLE "Rehearsal" ADD CONSTRAINT "Rehearsal_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
