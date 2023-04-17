import { describe, it, expect } from 'vitest';
import { populate_booleans } from './populate-booleans';

describe('populate_booleans', () => {
    it("should turn a value 'true' into a boolean true", () => {
        const obj = { test: "true" };
        populate_booleans(obj);
        expect(obj).toEqual({ test: true });
    });
    it("should turn a value 'false' into a boolean false", () => {
        const obj = { test: "false" };
        populate_booleans(obj);
        expect(obj).toEqual({ test: false });
    });
    it("should turn a value 'true' into a boolean true, even if it's nested", () => {
        const obj = { test: [{ test: "true" }] };
        populate_booleans(obj);
        expect(obj).toEqual({ test: [{ test: true }] });
    });
    it("should turn a value 'false' into a boolean false, even if it's nested", () => {
        const obj = { test: [{ test: "false" }] };
        populate_booleans(obj);
        expect(obj).toEqual({ test: [{ test: false }] });
    });
});

