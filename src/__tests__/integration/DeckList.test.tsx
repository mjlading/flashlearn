import { createCaller } from "@/server/routers";
import { createInnerTRPCContext } from "@/server/trpc";
import { describe, beforeEach, expect, it, vi } from "vitest";
import { cleanDB } from "@/__tests__/setup"
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

beforeEach(async () => {
  console.log("cleaning db")
  cleanDB()
  console.log("db cleaned")
});

describe("deck", async()=> {
  describe("Create new deck", () => {
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
            user: { id:"fakeid", name:"test", }, // will fail if user is not in db, valid user is required to add new users
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
      
        await expect(caller.deck.createDeck(deck)).rejects.toThrowError(TRPCError);
    
    });
  });
});