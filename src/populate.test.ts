import { describe, it, expect } from "vitest";
import { makeObject } from "./populate";

describe("makeObject", () => {
	it("should populate a simple object", () => {
		expect(makeObject({ hello: "world" })).toEqual({ hello: "world" });
	});

	it("should populate a simple object with a dot", () => {
		expect(makeObject({ "hello.world": "test" })).toEqual({
			hello: { world: "test" }
		});
	});

	it("should populate a simple object with a dot and a bracket", () => {
		expect(makeObject({ "hello[0]": "test" })).toEqual({
			hello: {
				0: "test"
			}
		});
	});

	it("should populate an object when given multiple paths", () => {
		expect(
			makeObject({ "hello.world[0]": "test", "hello.world[1]": "test2" })
		).toEqual({
			hello: {
				world: {
					0: "test",
					1: "test2"
				}
			}
		});
	});
});
