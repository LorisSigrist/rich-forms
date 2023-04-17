import { populate_arrays } from "./populate-arrays";
import { populate_booleans } from "./populate-booleans";
import { makeObject } from "./populate";
import { createPathMap } from "./path";

type FullParseOptions = {
	/**
	 * If true, any object with only numeric keys will be converted to an array.
	 * @default true
	 */
	populate_arrays: boolean;

	/**
	 * If true, any string that is "true" or "false" will be converted to a boolean.
	 * If false, they will remain strings
	 * @default true
	 */
	populate_booleans: boolean;

	/**
	 * If true, any duplicate keys will be merged into an array.
	 * If false, duplicate keys will throw a SyntaxError.
	 *
	 * THIS DOES NOT TURN DUPLICATE *PATHS* INTO ARRAYS - Eg Different spellings of the same path,
	 * only the same spelling.
	 *
	 * Keeping this off is faster,
	 * but it will break if you are using `multiple` on any of your inputs.
	 * @default false
	 */
	duplicates_as_array: boolean;
};

const defaultOptions: FullParseOptions = {
	populate_arrays: true,
	populate_booleans: true,
	duplicates_as_array: false
};

export type ParseOptions = Partial<FullParseOptions>;

/**
 * Takes a FormData object or a Form Element and uses it to create a deep javascript object.
 *
 * @param form A Form Element, or a FormData object
 * @param options Parser Options. Import the `ParseOptions` type to see the available options.
 * @thows SyntaxError if the form data is not properly formatted
 * @returns POJS
 */
export function parse(
	form: FormData | HTMLFormElement,
	options: ParseOptions = {}
): Record<string, any> {
	const fullOptions = { ...defaultOptions, ...options };
	const formData = form instanceof FormData ? form : new FormData(form);

	const key_val: Record<string, FormDataEntryValue> = {};

	if (fullOptions.duplicates_as_array) {
		//Keep track of which keys have been converted to arrays, and which index they are on
		const keys_converted_to_arrays = new Map<string, number>();
		for (const [key, value] of formData.entries()) {
			if (key in key_val) {
				//If the key has already been converted to an array, push the value to the array
				if (keys_converted_to_arrays.has(key)) {
					const index = keys_converted_to_arrays.get(key)!;
					const new_key = `${key}[${index}]`;
					key_val[new_key] = value;
					keys_converted_to_arrays.set(key, index + 1);
				} else {
					//Set the existing value as the first element in the array
					const already_existing_value = key_val[key];
					const new_key_for_existing = `${key}[0]`;

					key_val[new_key_for_existing] = already_existing_value;
					delete key_val[key];

					//Set the new value as the second element in the array
					const new_key_for_new = `${key}[1]`;
					key_val[new_key_for_new] = value;

					keys_converted_to_arrays.set(key, 2);
				}
			} else {
				key_val[key] = value;
			}
		}
	} else {
		//Populate key_val and throw an error if there are duplicate keys
		for (const [key, value] of formData.entries()) {
			if (key in key_val) throw new SyntaxError(`Duplicate key: ${key}`);
			key_val[key] = value;
		}
	}

	const path_map = createPathMap(key_val);
	let object = makeObject(path_map);

	if (fullOptions.populate_arrays) object = populate_arrays(object);
	if (fullOptions.populate_booleans) populate_booleans(object);
	return object;
}
