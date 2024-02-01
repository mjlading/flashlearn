-- CreateTable
CREATE TABLE "BookmarkedDeck" (
    "userId" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,

    CONSTRAINT "BookmarkedDeck_pkey" PRIMARY KEY ("userId","deckId")
);

-- CreateTable
CREATE TABLE "DeckRating" (
    "stars" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,

    CONSTRAINT "DeckRating_pkey" PRIMARY KEY ("userId","deckId")
);

-- CreateTable
CREATE TABLE "UserDeckKnowledge" (
    "knowledgeLevel" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,

    CONSTRAINT "UserDeckKnowledge_pkey" PRIMARY KEY ("userId","deckId")
);

-- AddForeignKey
ALTER TABLE "BookmarkedDeck" ADD CONSTRAINT "BookmarkedDeck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkedDeck" ADD CONSTRAINT "BookmarkedDeck_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeckRating" ADD CONSTRAINT "DeckRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeckRating" ADD CONSTRAINT "DeckRating_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDeckKnowledge" ADD CONSTRAINT "UserDeckKnowledge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDeckKnowledge" ADD CONSTRAINT "UserDeckKnowledge_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
