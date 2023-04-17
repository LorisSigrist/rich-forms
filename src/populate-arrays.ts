/**
 * Loops through a deep object, and converts all objects with only numeric keys to arrays.
 * @param obj - The object to convert.
 * @returns - A new object with all objects with only numeric keys converted to arrays.
 */
export function populate_arrays(obj: Record<string, any>): Record<string, any> {
  if (typeof obj === "object" && obj !== null) {
    if (Array.isArray(obj)) {
      // recursively apply the function to all elements of the array
      return obj.map((val) => populate_arrays(val));
    } else {
      const keys = Object.keys(obj);
      const allNumeric = keys.every((key) => /^\d+$/.test(key));
      if (allNumeric) {
        // if all keys are numeric, convert the object to an array
        return keys.map((key) => populate_arrays(obj[key]));
      } else {
        // recursively apply the function to all values of the object
        const newObj: { [key: string]: any } = {};
        for (const key of keys) {
          newObj[key] = populate_arrays(obj[key]);
        }
        return newObj;
      }
    }
  } else {
    // base case: non-object values are returned as-is
    return obj;
  }
}