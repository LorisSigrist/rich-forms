import { describe, it, expect } from "vitest";
import { populate_arrays } from "./populate-arrays";

describe("populate_arrays", () => {
	it("should turn an object with only numeric keys into an array", () => {
		expect(populate_arrays({ 0: "hello", 1: "world" })).toEqual([
			"hello",
			"world"
		]);
	});
	it("should convert deeply nested objects with only numeric keys into arrays", () => {
		expect(populate_arrays({ 0: { 0: "hello", 1: "world" } })).toEqual([
			["hello", "world"]
		]);
	});
	it("should not convert an object with any non-numeric keys into an array", () => {
		expect(populate_arrays({ 0: "hello", 1: "world", test: "test" })).toEqual({
			0: "hello",
			1: "world",
			test: "test"
		});
	});
});
