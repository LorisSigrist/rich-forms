import { expect, it, describe } from "vitest";
import { parse } from "./index";

describe("parse", () => {
    it("parses a basic form with no nesting", () => {
        const formData = new FormData();
        formData.set("name", "John Doe");
        formData.set("age", "42");
        formData.set("isAlive", "true");

        expect(parse(formData)).toEqual({
            name: "John Doe",
            age: "42",
            isAlive: true,
        });
    });
});