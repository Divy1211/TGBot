/**
 * Same as the python enumerate function
 *
 * @param iteratble: an iterable
 * @param start: the number to start from (default: 0)
 */
export function enumerate<T>(iteratble: T[], start: number = 0): [number, T][] {
    return Array.from({length: iteratble.length}).map((_, i) => [i, iteratble[i]]);
}

/**
 * Same as the python zip function
 *
 * @param rows: a list of arrays
 */
export function zip<T extends any[][], K>(...rows: T): {[K in keyof T]: T[K][0]}[] {
    const minLen = Math.min(...rows.map(row => row.length));

    return Array.from({length: minLen}).map(
        (_, i) => rows.map(row => row[i])
    ) as {[K in keyof T]: T[K][0]}[];
}

/**
 * Ensure that the parameter is not null or undefined. Returns the given argument
 *
 * @param argument The argument which is ensured to not be undefined or null
 * @param message The message to use in the error throw when the argument is undefined or null
 *
 * @throws TypeError if the parameter is null or undefined
 *
 * @author Karol Majewski @ https://stackoverflow.com/a/54738437/7230293
 */
export function ensure<T>(argument: T | undefined | null, message = "This value was promised to be there."): T {
    if (argument === undefined || argument === null) {
        throw new TypeError(message);
    }

    return argument;
}

/**
 * sets an interval but also runs the callback immediately
 *
 * @param callback
 * @param ms
 */
export function startInterval(callback: () => void, ms: number): NodeJS.Timer {
    callback();
    return setInterval(callback, ms);
}


/**
 * Assert the parameter given to not be undefined or null. Does not return the given argument
 *
 * @param value The value which is asserted to not be undefined or null
 * @throws TypeError if the parameter is null or undefined
 *
 * @author Aleksey L. @ https://stackoverflow.com/a/59017341/7230293
 */
export function assert(value: unknown): asserts value {
    if (value === undefined || value === null) {
        throw new TypeError("value must be defined");
    }
}

/**
 * Choose one element randomly from the given array
 *
 * @param array The array to chose elements from
 */
export function choose<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Choose k elements randomly from the given array
 *
 * @param array The array to chose elements from
 * @param k The number of elements to choose
 * @param replacement choose with replacement
 */
export function choices<T>(array: T[], k: number, replacement = false): T[] {
    let choicesLs: T[] = [];

    for (let i = 0; i < k; ++i) {
        const choice = array[Math.floor(Math.random() * array.length)];
        if (!replacement && choicesLs.includes(choice)) {
            --i;
            continue;
        }
        choicesLs.push(choice);
    }
    return choicesLs;
}

/**
 * Generates a combination of r things and their complement
 *
 * @param array The array to generate the combinations from
 * @param r The group size
 */
export function combinations<T>(array: T[], r: number): T[][] {
    if (r > array.length) {
        throw Error("the number of elements to choose from must be larger than the amount to choose");
    }

    if (r === 1) {
        return array.map((element: T) => [element]);
    }

    let combos: T[][] = [];

    let copy = [...array];
    while (r - 1 < copy.length) {
        const first = copy.splice(0, 1);

        for (const combo of combinations(copy, r - 1)) {
            combos.push(first.concat(combo));
        }
    }
    return combos;
}

/**
 * Extract the hh, mm and ss values as numbers from a provided time in hh:mm[:ss] (string) format.
 * If an invalid format is given, an error is returned.
 *
 * @param hhmmss The string to extract the hh, mm and ss values from
 */
export function getDuration(hhmmss: string): {error?: string, hh: number, mm: number, ss: number} {
    // ss will be undefined if not specified
    let [_, hh, mm, ss]: (string | number)[] = hhmmss.match(/^(\d+):(\d{2})(?::(\d{2}))?$/) ?? ["-1", "-1", "-1", "-1"];
    if (hh === "-1") {
        return {error: "Error: The format of the specified duration is invalid, please try again", hh: 0, mm: 0, ss: 0};
    }

    hh = parseInt(hh);
    mm = parseInt(mm);
    ss = ss ? parseInt(ss) : 0;

    if (ss > 59 && mm > 59) {
        return {error: "Error: Minutes & Seconds cannot be greater than 59", hh, mm, ss};
    }
    if (mm > 59) {
        return {error: "Error: Minutes cannot be greater than 59", hh, mm, ss};
    }
    if (ss > 59) {
        return {error: "Error: Seconds cannot be greater than 59", hh, mm, ss};
    }

    return {hh, mm, ss};
}

/**
 * Split an array based on a boolean function
 *
 * @param array An array to split
 * @param fn The boolean function to split by
 *
 * @return A tuple of two arrays, the first array containing all values for which fn is true, the second containing the
 * rest
 */
export function partition<T>(array: T[], fn: (element: T) => boolean) {
    return array.reduce(
        (result: T[][], element) => {
            result[fn(element)?0:1].push(element)
            return result;
        },
        [[], []]
    );
}