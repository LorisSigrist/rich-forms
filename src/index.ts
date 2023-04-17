import { populate_arrays } from "./populate-arrays";
import { populate_booleans } from "./populate-booleans";
import { makeObject } from "./populate";

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
};

const defaultOptions: FullParseOptions = {
	populate_arrays: true,
	populate_booleans: true
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

	for (const [key, value] of formData.entries()) {
		key_val[key] = value;
	}

	let object = makeObject(key_val);
	if (fullOptions.populate_arrays) object = populate_arrays(object);
	if (fullOptions.populate_booleans) populate_booleans(object);
	return object;
}
