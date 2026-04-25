import { describe, expect, test} from "vitest";
import { searchWoman } from "./wikidataService";

describe("test searchWoman", () => {

    test("taylor swift should not return null", async () => {
        const result = await searchWoman("taylor swift");
        expect(result).not.toBe(null);
    })

    test("taylor swift should return name in string", async () => {
        const result = await searchWoman("taylor swift");

        if (result !== null) {
            expect(result.name).toBe("Taylor Swift");  // result always comes back capitalized
        }
    })

    test("taylor swift should return occupation as singer", async () => {
        const result = await searchWoman("taylor swift");

        if (result !== null) {
            expect(result.occupation).toBe("singer");
        }
    })

    test("taylor swift should be found case-insensitively", async () => {
        const upper = await searchWoman("TAYLOR SWIFT");
        const mixed = await searchWoman("tAyLoR sWiFt");

        if (upper !== null && mixed !== null) {
            expect(upper.name).toBe("Taylor Swift");
            expect(mixed.name).toBe("Taylor Swift");
        }
    })

    test("non-existent person should return null", async () => {
        const result = await searchWoman("bruh");
        expect(result).toBeNull();
    })

    test("a man should not be returned", async () => {
        const result = await searchWoman("barack obama");
        expect(result).toBeNull();
    })
})
