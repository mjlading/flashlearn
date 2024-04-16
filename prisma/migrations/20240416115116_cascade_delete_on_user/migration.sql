-- DropForeignKey
ALTER TABLE "BookmarkedDeck" DROP CONSTRAINT "BookmarkedDeck_userId_fkey";

-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_userId_fkey";

-- DropForeignKey
ALTER TABLE "Deck" DROP CONSTRAINT "Deck_userId_fkey";

-- DropForeignKey
ALTER TABLE "DeckRating" DROP CONSTRAINT "DeckRating_userId_fkey";

-- DropForeignKey
ALTER TABLE "Rehearsal" DROP CONSTRAINT "Rehearsal_userId_fkey";

-- DropForeignKey
ALTER TABLE "RoadmapUserProgress" DROP CONSTRAINT "RoadmapUserProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserDeckKnowledge" DROP CONSTRAINT "UserDeckKnowledge_userId_fkey";

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkedDeck" ADD CONSTRAINT "BookmarkedDeck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeckRating" ADD CONSTRAINT "DeckRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDeckKnowledge" ADD CONSTRAINT "UserDeckKnowledge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rehearsal" ADD CONSTRAINT "Rehearsal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapUserProgress" ADD CONSTRAINT "RoadmapUserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
