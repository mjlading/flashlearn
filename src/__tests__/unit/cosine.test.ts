import { expect, test, vi } from "vitest";
import * as math from "mathjs";
import * as cosine from "@/lib/cosine"


describe("cosine", async()=> {
    describe("cosineSimilarity", () => {
        it("should give correct values", ()=>{
            
            expect(cosine.cosineSimilarity([1, 0], [-1, 0])).toBe(-1);

            expect(cosine.cosineSimilarity([1, 0], [0, 1])).toBe(0);

            expect(cosine.cosineSimilarity([1, 0, 0], [1, 0, 0])).toBe(1);
        });
    });
        
    describe("getCosineSimilarities", () => {
        it("should give correct values", () => {
            expect(cosine.getCosineSimilarities([1, 0], [[-1, 0], [-1, 1]])).toStrictEqual([
                cosine.cosineSimilarity([1, 0], [-1, 0]),
                cosine.cosineSimilarity([1, 0], [-1, 1])
            ]);
            
            expect(cosine.getCosineSimilarities([1, 0, 0], [[-2, 0, 0], [1, 2, 3]])).toStrictEqual([
                cosine.cosineSimilarity([1, 0, 0], [-2, 0, 0]),
                cosine.cosineSimilarity([1, 0, 0], [1, 2, 3])
            ]);
        })
    });
});

