-- DropForeignKey
ALTER TABLE "BookmarkedDeck" DROP CONSTRAINT "BookmarkedDeck_deckId_fkey";

-- DropForeignKey
ALTER TABLE "DeckRating" DROP CONSTRAINT "DeckRating_deckId_fkey";

-- DropForeignKey
ALTER TABLE "UserDeckKnowledge" DROP CONSTRAINT "UserDeckKnowledge_deckId_fkey";

-- AddForeignKey
ALTER TABLE "BookmarkedDeck" ADD CONSTRAINT "BookmarkedDeck_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeckRating" ADD CONSTRAINT "DeckRating_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDeckKnowledge" ADD CONSTRAINT "UserDeckKnowledge_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
