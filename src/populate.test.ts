import { describe, it, expect } from "vitest";
import { makeObject } from "./populate";
import { createPathMap } from "./path";

describe("makeObject", () => {
	it("should populate a simple object", () => {
		const path_map = createPathMap({ hello: "world" });
		expect(makeObject(path_map)).toEqual({ hello: "world" });
	});

	it("should populate a simple object with a dot", () => {
		const path_map = createPathMap({ "hello.world": "test" });
		expect(makeObject(path_map)).toEqual({
			hello: { world: "test" }
		});
	});

	it("should populate a simple object with a dot and a bracket", () => {
		const path_map = createPathMap({ "hello.world[0]": "test" });
		expect(makeObject(path_map)).toEqual({
			hello: { world: { 0: "test" } }
		});
	});

	it("should populate an object when given multiple paths", () => {
		const path_map = createPathMap({
			"hello.world[0]": "test",
			"hello.world[1]": "test2"
		});

		expect(makeObject(path_map)).toEqual({
			hello: {
				world: {
					0: "test",
					1: "test2"
				}
			}
		});
	});
});
