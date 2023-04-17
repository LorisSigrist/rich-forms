import { expect, it, describe } from "vitest";
import { parse } from "./index";

describe("parse", () => {
	it("parses a basic form with no nesting (default options)", () => {
		const formData = new FormData();
		formData.set("name", "John Doe");
		formData.set("age", "42");
		formData.set("isAlive", "true");

		expect(parse(formData)).toEqual({
			name: "John Doe",
			age: "42",
			isAlive: true
		});
	});
	it("parses a basic form with no nesting (custom options)", () => {
		const formData = new FormData();
		formData.set("name", "John Doe");
		formData.set("age", "42");
		formData.set("isAlive", "true");

		expect(
			parse(formData, {
				populate_arrays: false,
				populate_booleans: false
			})
		).toEqual({
			name: "John Doe",
			age: "42",
			isAlive: "true"
		});
	});

	it("parses a complex form with nesting (default options)", () => {
		const formData = new FormData();
		formData.set("users[0].name", "John Doe");
		formData.set("users[0].age", "42");
		formData.set("users[1].name", "Jane Doe");
		formData.set("users[1].age", "42");
		formData.set("users[1].address[0].street", "123 Main St");
		formData.set("users[1].address[0].city", "New York");
		formData.set("users[1].address[0].state", "NY");
		formData.set("users[1].address[0].zip", "12345");
		formData.set("users[1].address[1].street", "456 Main St");
		formData.set("users[1].address[1].city", "New York");
		formData.set("users[1].address[1].state", "NY");
		formData.set("users[1].address[1].zip", "12345");

		expect(parse(formData)).toEqual({
			users: [
				{
					name: "John Doe",
					age: "42"
				},
				{
					name: "Jane Doe",
					age: "42",
					address: [
						{
							street: "123 Main St",
							city: "New York",
							state: "NY",
							zip: "12345"
						},
						{
							street: "456 Main St",
							city: "New York",
							state: "NY",
							zip: "12345"
						}
					]
				}
			]
		});
	});

	it("parses a complex form with nesting (no arrays)", () => {
		const formData = new FormData();
		formData.set("users[0].name", "John Doe");
		formData.set("users[0].age", "42");
		formData.set("users[1].name", "Jane Doe");
		formData.set("users[1].age", "42");
		formData.set("users[1].address[0].street", "123 Main St");
		formData.set("users[1].address[0].city", "New York");
		formData.set("users[1].address[0].state", "NY");
		formData.set("users[1].address[0].zip", "12345");
		formData.set("users[1].address[1].street", "456 Main St");
		formData.set("users[1].address[1].city", "New York");
		formData.set("users[1].address[1].state", "NY");
		formData.set("users[1].address[1].zip", "12345");

		expect(parse(formData, { populate_arrays: false })).toEqual({
			users: {
				"0": {
					name: "John Doe",
					age: "42"
				},
				"1": {
					name: "Jane Doe",
					age: "42",
					address: {
						"0": {
							street: "123 Main St",
							city: "New York",
							state: "NY",
							zip: "12345"
						},
						"1": {
							street: "456 Main St",
							city: "New York",
							state: "NY",
							zip: "12345"
						}
					}
				}
			}
		});
	});
});

describe("duplicate keys and paths (when disallowed)", () => {
	it("should throw a SyntaxError if duplicate keys are encountered", () => {
		const formData = new FormData();

		//Use append to add duplicate keys - set will overried
		formData.append("name", "John Doe");
		formData.append("name", "Jane Doe");

		expect(() => parse(formData)).toThrow(SyntaxError);
	});

	it("should throw a SyntaxError if duplicate paths are encountered, even if the notation is different", () => {
		const formData = new FormData();

		formData.set("users[0].name", "John Doe");
		formData.set("users.0.name", "Jane Doe");

		expect(() => parse(formData)).toThrow(SyntaxError);
	});
});

describe("duplicate keys and paths (when duplicates_as_array is set)", () => {
	it("should turn duplicate keys into an array", () => {
		const formData = new FormData();

		//Use append to add duplicate keys - set will overried
		formData.append("name", "John Doe");
		formData.append("name", "Jane Doe");

		expect(parse(formData, { duplicates_as_array: true })).toEqual({
			name: ["John Doe", "Jane Doe"]
		});
	});
});

describe("ignore empty values", () => {
	it("should ignore empty values", () => {
		const formData = new FormData();

		formData.set("name", "John Doe");
		formData.set("age", "");

		expect(parse(formData, { ignore_empty: true })).toEqual({
			name: "John Doe"
		});
	});

	it("should not ignore empty values when ignore_empty is false", () => {
		const formData = new FormData();

		formData.set("name", "John Doe");
		formData.set("age", "");

		expect(parse(formData, { ignore_empty: false })).toEqual({
			name: "John Doe",
			age: ""
		});
	});
});
