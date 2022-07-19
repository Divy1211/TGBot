/**
 * Ensure that the parameter exists. Mostly useful in combination with 'Array.find()' which can return undefined.
 *
 * @param argument The argument which is ensured to not be undefined or null
 * @param message The message to use in the error throw when the argument is undefined or null
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
 * Assert the parameter given to not be undefined or null. Works in the same way `ensure` does except no
 * value is returned. This is useful for already existing values that might also be 'null' or 'undefined'.
 *
 * @param value The value which is asserted to not be undefined or null
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