import { createCaller } from "@/server/routers";
import { createInnerTRPCContext } from "@/server/trpc";
import { describe, beforeEach, expect, it, vi } from "vitest";
import { cleanDBDecks, cleanDBUsers, cleanDBCollections } from "@/__tests__/setup"
import prisma from "C:/Users/gunna/Desktop/Bacheloroppgave 2024/learning-app/src/__mocks__/prisma";
import { TRPCError } from "@trpc/server";

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

describe("deck", async()=> {
  describe("createDeck", () => {
      it("creates new deck when the user exists", async () => {
  
          const ctx = createInnerTRPCContext({
            session: {
              user: { id:"testId", name:"test", }, // will fail if user is not in db, valid user is required to add new users
              expires: "1",
            },
          });
          //console.log(await ctx.prisma.user.create({data:{id:"testId", name:"test"}}));
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
        
          const res = await caller.deck.createDeck(deck);
        
          //console.log(res);
        
          expect(res.name)                .toBe("test");
          expect(res.isPublic)            .toBe(false);
          expect(res.academicLevel)       .toBe("MIDDLE_SCHOOL");
          expect(res.subjectName)         .toBe("Mathematics");
          expect(res.numFlashcards)       .toBe(1);
          
          expect(res.flashcards[0].front) .toBe("test_front");
          expect(res.flashcards[0].back)  .toBe("test_back");
          expect(res.flashcards[0].tag)   .toBe("test_tag");
        
          //expect(res).toEqual(deck); //this does not work bc. deep equals can't match generated IDs
      });
      it("does not create new deck when user does not exist", async () => {
  
        const ctx = createInnerTRPCContext({
          session: {
            user: { id:"fakeid", name:"test", }, // will fail if user is not in db
            expires: "1",
          },
        });
        //console.log(await ctx.prisma.user.create({data:{id:"testId", name:"test"}}));
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
      
        await expect(caller.deck.createDeck(deck)).rejects.toThrowError(
          new TRPCError({
          code: "BAD_REQUEST",
          message: "User must exist to create decks",
        }));

    });
  });
  describe("editDeck", () => {
    it("edits deck when the user and deck exists", async () => {

        const ctx = createInnerTRPCContext({
          session: {
            user: { id:"testId", name:"test", }, // will fail if user is not in db, valid user is required to add new users
            expires: "1",
          },
        });
        //console.log(await ctx.prisma.user.create({data:{id:"testId", name:"test"}}));
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
      
        const id = (await caller.deck.createDeck(deck)).id;

        const edited_deck = {
          name: "edited",
          isPublic: true,
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
              {
                front:"edited_front",
                back: "edited_back",
                tag: "edited_tag",
              },
            ]
        }
        //console.log(res);
        const res = (await caller.deck.editDeck({createDeck:edited_deck, deckId:id}));

        expect(res.name)                .toBe("edited");
        expect(res.isPublic)            .toBe(true);
        expect(res.academicLevel)       .toBe("MIDDLE_SCHOOL");
        expect(res.subjectName)         .toBe("Mathematics");
        expect(res.numFlashcards)       .toBe(1);
        console.log(res.flashcards)
        expect(res.flashcards[1].front) .toBe("edited_front");
        expect(res.flashcards[1].back)  .toBe("edited_back");
        expect(res.flashcards[1].tag)   .toBe("edited_tag");
      
        //expect(res).toEqual(deck); //this does not work bc. deep equals can't match generated IDs
    });
    it("does not edit deck when card does not exist", async () => {

      const ctx = createInnerTRPCContext({
        session: {
          user: { id:"testId", name:"test", }, // will fail if user is not in db
          expires: "1",
        },
      });
      //console.log(await ctx.prisma.user.create({data:{id:"testId", name:"test"}}));
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
    
      await expect(caller.deck.editDeck({createDeck:deck, deckId:"fake_id"})).rejects.toThrowError(
        new TRPCError({
        code: "BAD_REQUEST",
        message: "Deck must exist to edit",
      }));
    });
    it("does not edit deck when another user tries to edit deck", async () => {

      const ctx = createInnerTRPCContext({
        session: {
          user: { id:"testId", name:"test", }, // will fail if user is not in db, valid user is required to add new users
          expires: "1",
        },
      });
      //console.log(await ctx.prisma.user.create({data:{id:"testId", name:"test"}}));
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
    
      const id = (await caller.deck.createDeck(deck)).id;

      await ctx.prisma.user.create({data:{id:"unauthorized_editor", name:"unauthorized_editor"}})
      const unauthorized_ctx = createInnerTRPCContext({
        session: {
          user: { id:"unauthorized_editor", name:"unauthorized_editor", }, 
          expires: "1",
        },
      });
      const unauthorized_caller = createCaller(unauthorized_ctx);
      const edited_deck = {
        name: "edited",
        isPublic: true,
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
            {
              front:"edited_front",
              back: "edited_back",
              tag: "edited_tag",
            },
          ]
      }
      //console.log(res);
      await expect(unauthorized_caller.deck.editDeck({createDeck:edited_deck, deckId:id})).rejects.toThrowError(
        new TRPCError({
        code: "BAD_REQUEST",
        message: "User not allowed to edit this deck",
      }));
      //expect(res).toEqual(deck); //this does not work bc. deep equals can't match generated IDs
    });
  });

  describe("fetching deck(s) works", async ()=>{
    it("infiniteDecks", async () => {
      const ctx = createInnerTRPCContext({
        session: {
          user: { id:"testId", name:"test", }, // will fail if user is not in db
          expires: "1",
        },
      });
      //console.log(await ctx.prisma.user.create({data:{id:"testId", name:"test"}}));
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
    
      await caller.deck.createDeck(deck);

      const res = await caller.deck.infiniteDecks({limit:50});
      console.log(res)

      expect(res.decks[0].name)                .toBe("test");
      expect(res.decks[0].isPublic)            .toBe(false);
      expect(res.decks[0].academicLevel)       .toBe("MIDDLE_SCHOOL");
      expect(res.decks[0].subjectName)         .toBe("Mathematics");
      expect(res.decks[0].numFlashcards)       .toBe(1);
    });
    describe("getDeckById", async ()=>{
      it("Fetching a deck by it's id works", async () => {
        const ctx = createInnerTRPCContext({
          session: {
            user: { id:"testId", name:"test", }, // will fail if user is not in db
            expires: "1",
          },
        });
        //console.log(await ctx.prisma.user.create({data:{id:"testId", name:"test"}}));
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
      
        const id = (await caller.deck.createDeck(deck)).id;
        const res = await caller.deck.getDeckById({id:id});
        expect(res.name)                .toBe("test");
        expect(res.isPublic)            .toBe(false);
        expect(res.academicLevel)       .toBe("MIDDLE_SCHOOL");
        expect(res.subjectName)         .toBe("Mathematics");
        expect(res.numFlashcards)       .toBe(1);
      });
      it("Fetching a deck by without an Id throws 'NOT_FOUND' error", async () => {
        const ctx = createInnerTRPCContext({
          session: {
            user: { id:"testId", name:"test", }, // will fail if user is not in db
            expires: "1",
          },
        });
        //console.log(await ctx.prisma.user.create({data:{id:"testId", name:"test"}}));
        const caller = createCaller(ctx);

      
        const id = "fake-deck-id";
        await expect(caller.deck.getDeckById({id:id})).rejects.toThrowError(
          new TRPCError({ code: "NOT_FOUND", message: "Deck not found" })
        );
      });
      it("Fetching a private deck without having created it throws 'FORBIDDEN' error", async () => {
        const ctx = createInnerTRPCContext({
          session: {
            user: { id:"testId", name:"test", }, // will fail if user is not in db
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
        const id = (await caller.deck.createDeck(deck)).id;
        //Creating temporary user which will illegaly call private deck
        await ctx.prisma.user.create({data:{id:"dummyUser", name:"test"}})

        const testctx = createInnerTRPCContext({
          session: {
            user: { id:"dummyUser", name:"test" }, 
            expires: "1",
          },
        });

        const testcaller = createCaller(testctx);
        
    
        await expect(testcaller.deck.getDeckById({id:id})).rejects.toThrowError(
          new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to access this resource",
        }))
      });
    });
    describe("getDecksBySubjectName", async () => {
      it("gets decks that exist", async () => {
        const ctx = createInnerTRPCContext({
          session: {
            user: { id:"testId", name:"test", }, // will fail if user is not in db
            expires: "1",
          },
        });
        
        const caller = createCaller(ctx);

        const deck = {
          name: "test",
          isPublic: true, // private decks do not show up for getDecksBySubjectName
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
        const id = (await caller.deck.createDeck(deck)).id;

        const res = await caller.deck.getDecksBySubjectName({subjectName:"Mathematics"});
        expect(res.length).toBe(1);
        expect(res[0].id).toBe(id)
      });
    });
  });
  describe("deleteDeckById", async () => {
    it("deletes deck owned by user", async () => {
      const ctx = createInnerTRPCContext({
        session: {
          user: { id:"testId", name:"test", }, // will fail if user is not in db
          expires: "1",
        },
      });
      
      const caller = createCaller(ctx);

      const deck = {
        name: "test",
        isPublic: true, 
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
      const id = (await caller.deck.createDeck(deck)).id;
      await caller.deck.deleteDeckById(id);
      await expect((await caller.deck.infiniteDecks({})).decks.length).toBe(0);
    });
    it("throws error when attempting to delete deck not owned by user", async () => {
      const ctx = createInnerTRPCContext({
        session: {
          user: { id:"testId", name:"test", }, // will fail if user is not in db
          expires: "1",
        },
      });
      
      const caller = createCaller(ctx);

      const deck = {
        name: "test",
        isPublic: true, 
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
      const id = (await caller.deck.createDeck(deck)).id;

      //Creating temporary user which will try to delete deck
      await ctx.prisma.user.create({data:{id:"dummyUser", name:"test"}})

      const testctx = createInnerTRPCContext({
        session: {
          user: { id:"dummyUser", name:"test" }, 
          expires: "1",
        },
      });

      const testcaller = createCaller(testctx);
      
  
      await expect(testcaller.deck.deleteDeckById(id)).rejects.toThrowError(
        new TRPCError({
        code: "FORBIDDEN",
      }))
    });
  });
  describe("countDecks", async () => {
    it("counts decks", async () => {
      const ctx = createInnerTRPCContext({
        session: {
          user: { id:"testId", name:"test", }, // will fail if user is not in db
          expires: "1",
        },
      });
      
      const caller = createCaller(ctx);

      const deck = {
        name: "test",
        isPublic: true, 
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
      const id = (await caller.deck.createDeck(deck)).id;
      expect(await caller.deck.countDecks({})).toBe(1)
    });
  });
  
    /*
    
 
   

    it("countDecksByCategories", async () => {
      const goal;
      const res;
      expect(res).toBe(goal);
    });
    it("getTagsByDeckId", async () => {
      const goal;
      const res;
      expect(res).toBe(goal);
    });
    it("setDeckRating", async () => {
      const goal;
      const res;
      expect(res).toBe(goal);
    });
    it("getDeckRating", async () => {
      const goal;
      const res;
      expect(res).toBe(goal);
    });
    it("createAndSaveEmbedding", async () => {
      const goal;
      const res;
      expect(res).toBe(goal);
    });*/
  
});
