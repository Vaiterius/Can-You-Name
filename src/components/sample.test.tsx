import { expect, test } from "vitest";
import { sum } from "./sample.tsx";

test("Adds 6 and 7 to equal 13", () => {
    expect(sum(6, 7)).toBe(13);
});