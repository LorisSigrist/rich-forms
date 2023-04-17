import { describe, it, expect } from "vitest";
import { parsePath } from "./path";

describe("parsePath", () => {
	it("should parse a simple path", () => {
		expect(parsePath("hello")).toEqual(["hello"]);
	});
	it("should parse a path with a dot", () => {
		expect(parsePath("hello.world")).toEqual(["hello", "world"]);
	});
	it("should parse a path with a dot and a bracket", () => {
		expect(parsePath("hello.world[0]")).toEqual(["hello", "world", "0"]);
	});
	it("should parse a path with a dot and a bracket and a dot", () => {
		expect(parsePath("hello.world[0].test")).toEqual([
			"hello",
			"world",
			"0",
			"test"
		]);
	});

	it("should parse a path with a dot and a bracket and a dot and a bracket", () => {
		expect(parsePath("hello.world[0].test[0]")).toEqual([
			"hello",
			"world",
			"0",
			"test",
			"0"
		]);
	});

	it("should parse a path with multiple dots", () => {
		expect(parsePath("hello.world[0].test.test")).toEqual([
			"hello",
			"world",
			"0",
			"test",
			"test"
		]);
	});
	it("should parse a path with multiple brackets", () => {
		expect(parsePath("hello[0][0][0]")).toEqual(["hello", "0", "0", "0"]);
	});
	it("should parse a path with strings as keys in brackets", () => {
		expect(parsePath('hello["world"]')).toEqual(["hello", "world"]);
	});
});
