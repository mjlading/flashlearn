-- DropForeignKey
ALTER TABLE "CollectionDeck" DROP CONSTRAINT "CollectionDeck_collectionId_fkey";

-- AddForeignKey
ALTER TABLE "CollectionDeck" ADD CONSTRAINT "CollectionDeck_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
