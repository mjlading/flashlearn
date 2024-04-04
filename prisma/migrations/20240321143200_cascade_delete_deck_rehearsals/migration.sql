-- DropForeignKey
ALTER TABLE "DeckRehearsal" DROP CONSTRAINT "DeckRehearsal_deckId_fkey";

-- DropForeignKey
ALTER TABLE "DeckRehearsal" DROP CONSTRAINT "DeckRehearsal_rehearsalId_fkey";

-- DropForeignKey
ALTER TABLE "FlashcardRehearsal" DROP CONSTRAINT "FlashcardRehearsal_flashcardId_fkey";

-- DropForeignKey
ALTER TABLE "FlashcardRehearsal" DROP CONSTRAINT "FlashcardRehearsal_rehearsalId_fkey";

-- AddForeignKey
ALTER TABLE "FlashcardRehearsal" ADD CONSTRAINT "FlashcardRehearsal_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlashcardRehearsal" ADD CONSTRAINT "FlashcardRehearsal_rehearsalId_fkey" FOREIGN KEY ("rehearsalId") REFERENCES "Rehearsal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeckRehearsal" ADD CONSTRAINT "DeckRehearsal_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeckRehearsal" ADD CONSTRAINT "DeckRehearsal_rehearsalId_fkey" FOREIGN KEY ("rehearsalId") REFERENCES "Rehearsal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
