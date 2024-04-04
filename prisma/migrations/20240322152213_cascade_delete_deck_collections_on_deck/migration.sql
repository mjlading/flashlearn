-- DropForeignKey
ALTER TABLE "CollectionDeck" DROP CONSTRAINT "CollectionDeck_deckId_fkey";

-- AddForeignKey
ALTER TABLE "CollectionDeck" ADD CONSTRAINT "CollectionDeck_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
