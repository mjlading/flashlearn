-- CreateTable
CREATE TABLE "RoadmapStep" (
    "name" TEXT NOT NULL,
    "description" TEXT,
    "recommendedLinks" TEXT[],
    "sequenceOrder" SERIAL NOT NULL,
    "deckId" TEXT NOT NULL,
    "roadmapId" TEXT NOT NULL,

    CONSTRAINT "RoadmapStep_pkey" PRIMARY KEY ("deckId","roadmapId")
);

-- CreateTable
CREATE TABLE "RoadmapUserProgress" (
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "roadmapId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RoadmapUserProgress_pkey" PRIMARY KEY ("roadmapId","userId")
);

-- AddForeignKey
ALTER TABLE "RoadmapStep" ADD CONSTRAINT "RoadmapStep_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapStep" ADD CONSTRAINT "RoadmapStep_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapUserProgress" ADD CONSTRAINT "RoadmapUserProgress_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapUserProgress" ADD CONSTRAINT "RoadmapUserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
