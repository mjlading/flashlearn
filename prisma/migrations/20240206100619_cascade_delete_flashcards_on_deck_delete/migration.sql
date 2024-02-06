-- DropForeignKey
ALTER TABLE "Flashcard" DROP CONSTRAINT "Flashcard_deckId_fkey";

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
