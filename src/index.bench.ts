import { bench, describe, beforeEach } from "vitest";
import { parse } from "./index";

describe("Nested Form Data", () => {
	let formData: FormData;

	beforeEach(() => {
		formData = new FormData();
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
	});

	bench("parse (arrays & booleans)", () => {
		const data = parse(formData, {
			populate_arrays: true,
			populate_booleans: true
		});
	});

	bench("parse (no arrays)", () => {
		const data = parse(formData, {
			populate_arrays: false,
			populate_booleans: true
		});
	});

	bench("parse (no booleans)", () => {
		const data = parse(formData, {
			populate_booleans: false,
			populate_arrays: true
		});
	});

	bench("parse (no arrays, no booleans)", () => {
		const data = parse(formData, {
			populate_arrays: false,
			populate_booleans: false
		});
	});
});
