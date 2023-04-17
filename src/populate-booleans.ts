export function populate_booleans(obj: Record<string, any>): void {
	for (const [key, value] of Object.entries(obj)) {
		if (typeof value === "string") {
			if (value === "true") {
				obj[key] = true;
			} else if (value === "false") {
				obj[key] = false;
			}
		} else if (typeof value === "object") {
			populate_booleans(value);
		}
	}
}
