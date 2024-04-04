import { expect, test, vi } from "vitest";
import * as utils from "@/lib/utils"



describe("utils", async()=> {
    describe("getBaseUrl", () => {
        it("should give correct values", ()=>{
            if (process.env.NODE_ENV ==="production")
                expect(utils.getBaseUrl()).toBe("http://flashlearn.no:3000"); //TODO: Check if this is correct, might not be
            if (process.env.NODE_ENV ==="development")
                expect(utils.getBaseUrl()).toBe("http://localhost:3000");
            if (process.env.NODE_ENV ==="test")
                expect(utils.getBaseUrl()).toBe("http://localhost:3000");
        });
    });
        
    describe("percentageToHsl", () => {

        it("gives correct value for maximum possible hsl", ()=>{
            const goal = "hsl(359, 100%, 50%)"
            const actual = utils.percentageToHsl(1, 359, 359)
            expect(actual).toBe(goal)
        })

        it("gives correct value for minimum possible hsl", ()=>{
            const goal = "hsl(0, 100%, 50%)"
            const actual = utils.percentageToHsl(0.0, 0, 360)
            expect(actual).toBe(goal)
        })
        /*
        it("throws error on percentage larger than 1", ()=>{
            const goal = 
            const actual = utils.percentageToHsl(1.1, 0, 360)
            expect(actual).toThrow(goal)
        })
        */
        /*
        it("throws error on percentage smaller than 0", ()=>{
            const goal = 
            const actual = utils.percentageToHsl(-0.1, 0, 360)
            expect(actual).toThrow(goal)
        })
        */        
        /*
        it("throws error on lightness larger than 100%", ()=>{
            const goal = 
            const actual = utils.percentageToHsl(0.0, 0, 360, 101)
            expect(actual).toThrow(goal)
        })
        */
        /*
        it("throws error on lightness smaller than 0%", ()=>{
            const goal = 
            const actual = utils.percentageToHsl(0.0, 0, 360, -1)
            expect(actual).toThrow(goal)
        })
        */
    });
});
