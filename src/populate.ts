/**
 * Takes a map of key-value pairs where the keys are paths, and converts it into a nested object.
 * @param keyValueMap
 * @returns
 */
export function makeObject(
	pathMap: Map<string[], FormDataEntryValue>
): Record<string, any> {
	const obj: Record<string, any> = {};

	for (const [path, value] of pathMap.entries()) {
		let currentObj = obj;

		for (let i = 0; i < path.length; i++) {
			const propName = path[i];

			if (!currentObj.hasOwnProperty(propName)) {
				currentObj[propName] = i === path.length - 1 ? value : {};
			}

			currentObj = currentObj[propName];
		}
	}

	return obj;
}
