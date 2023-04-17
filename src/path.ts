export function parsePath(str: string): string[] {
	const path: string[] = [];
	let currentKey = "";
	let inIndex = false;
	let currentIndex = "";

	for (let i = 0; i < str.length; i++) {
		const char = str.charAt(i);

		if (char === "[") {
			if (currentKey !== "") {
				path.push(currentKey);
				currentKey = "";
			}
			inIndex = true;
		} else if (char === "]") {
			const cleaned_index = currentIndex.replace(/"/g, ""); //remove quotes
			path.push(cleaned_index);

			currentIndex = "";
			inIndex = false;
		} else if (char === ".") {
			if (currentKey !== "") {
				path.push(currentKey);
				currentKey = "";
			}
		} else {
			if (inIndex) {
				currentIndex += char;
			} else {
				currentKey += char;
			}
		}
	}

	if (currentKey !== "") {
		path.push(currentKey);
	}
	if (currentIndex !== "") {
		path.push(currentIndex);
	}

	return path;
}

export function createPathMap(
	keyval: Record<string, FormDataEntryValue>
): Map<string[], FormDataEntryValue> {


	const encountered_paths = new Set<string>();

	const map = new Map<string[], FormDataEntryValue>();
	for (const [key, value] of Object.entries(keyval)) {
		const path = parsePath(key);

		//Detect duplicate paths
		const path_in_standard_notation = standard_path_notation(path);
		if (encountered_paths.has(path_in_standard_notation)) {
			throw new SyntaxError(`Duplicate key: ${path_in_standard_notation}`);
		}
		encountered_paths.add(path_in_standard_notation);

		//Add path to map
		map.set(path, value);
	}
	return map;
}

/**
 * Concatonates a path into a string. All paths that are equal will result in the same string.
 * Format path_1.path_2.path_3
 */
function standard_path_notation(path: string[]): string {
	return path.join(".");
}
