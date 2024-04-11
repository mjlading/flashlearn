import { createCaller } from "@/server/routers";
import { createInnerTRPCContext } from "@/server/trpc";
import { describe, beforeEach, afterAll, expect, it, vi } from "vitest";
import { cleanDBDecks, cleanDBUsers, cleanDBCollections } from "@/__tests__/setup"

vi.mock("../lib/prisma");

// Mock useSearchParams()
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    category: "created",
    setCategory: vi.fn(),
  }),
}));

beforeEach( async () => {
  console.log("cleaning db")
  
  await cleanDBCollections()

  await cleanDBDecks()
  
  await cleanDBUsers()
  console.log("db cleaned")
});

afterAll(async () => {
  console.log("cleaning db")
  
  await cleanDBCollections()

  await cleanDBDecks()
  
  await cleanDBUsers()
  console.log("db cleaned")
});

describe("collection",async () => {
    describe("editCollection", async () => {
        it("edits collection", async () => {
          
          const timeinit = performance.now();
            const ctx = createInnerTRPCContext({
                session: {
                  user: { id:"testId", name:"test", },
                  expires: "1",
                },
            });
            
            const caller = createCaller(ctx);
            
            const deck = {
            name: "test",
            isPublic: false,
            academicLevel: "MIDDLE_SCHOOL",
            subjectName: "Mathematics",
            numFlashcards: 1,
            flashcards: 
                [
                {
                    front:"test_front",
                    back: "test_back",
                    tag: "test_tag",
                },
                ]
            }
            let timecurr = performance.now();
            const full_deck_1 = await caller.deck.createDeck(deck);
            console.log("deck 1 created in ", performance.now() - timecurr, "ms")

            
            timecurr = performance.now();
            const full_deck_2 = await caller.deck.createDeck(deck);
            console.log("deck 2 created in ", performance.now() - timecurr, "ms")

            timecurr = performance.now();
            const collection = await caller.collection.createCollection({
                name:"testcollection",
                deckIds: [full_deck_1.id],
            })
            console.log("collection created in ", performance.now() - timecurr, "ms")

            timecurr = performance.now();
            await caller.collection.editCollection({
                id:collection.id, 
                collection: {
                    name:"edited-testcollection",
                    deckIds: [full_deck_1.id, full_deck_2.id],
                }
            });

            console.log("collection edited in ", performance.now() - timecurr, "ms")

            timecurr = performance.now();
            const res = await caller.collection.getCollectionById({
                id:collection.id, 
                includeDecks:true
            })
            
            console.log("result fetched in ", performance.now() - timecurr, "ms")
            expect(res.name).toBe("edited-testcollection")
            
            expect(res.collectionDecks[0].deckId).toBe(full_deck_1.id)
            expect(res.collectionDecks[1].deckId).toBe(full_deck_2.id)
            console.log("total runtime: ", performance.now() - timeinit, " ms")
        }, 10000)
        
    });



});
