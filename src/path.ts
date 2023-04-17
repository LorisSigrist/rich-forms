export function parsePath(str: string): string[] {
    const path: string[] = [];
    let currentKey = '';
    let inIndex = false;
    let currentIndex = '';

    for (let i = 0; i < str.length; i++) {
        const char = str.charAt(i);

        if (char === '[') {
            if (currentKey !== '') {
                path.push(currentKey);
                currentKey = '';
            }
            inIndex = true;
        } else if (char === ']') {
            const cleaned_index = currentIndex.replace(/"/g, ''); //remove quotes
            path.push(cleaned_index);

            currentIndex = '';
            inIndex = false;
        } else if (char === '.') {
            if (currentKey !== '') {
                path.push(currentKey);
                currentKey = '';
            }
        } else {
            if (inIndex) {
                currentIndex += char;
            } else {
                currentKey += char;
            }
        }
    }

    if (currentKey !== '') {
        path.push(currentKey);
    }
    if (currentIndex !== '') {
        path.push(currentIndex);
    }

    return path;
}