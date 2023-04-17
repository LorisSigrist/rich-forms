import { parsePath } from "./path";

/**
 * Takes a map of key-value pairs where the keys are paths, and converts it into a nested object.
 * @param keyValueMap
 * @returns
 */
export function makeObject(
	keyValueMap: Record<string, FormDataEntryValue>
): Record<string, any> {
	const obj: Record<string, any> = {};

	for (const key in keyValueMap) {
		if (keyValueMap.hasOwnProperty(key)) {
			const path = parsePath(key);
			let currentObj = obj;

			for (let i = 0; i < path.length; i++) {
				const propName = path[i];

				if (!currentObj.hasOwnProperty(propName)) {
					currentObj[propName] = i === path.length - 1 ? keyValueMap[key] : {};
				}

				currentObj = currentObj[propName];
			}
		}
	}

	return obj;
}
