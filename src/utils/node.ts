import fs from "fs";
import path from "path";

/**
 *
 * Finds the names of all the files inside a given directory and its sub directories.
 *
 * @param dir The directory to scan for files.
 * @param full_paths if true, the full relative path of the file is included instead of just filename.
 *
 * @returns A list of file names inside the directory and subdirectories in that directory.
 */
export function recursiveReaddir (dir: string, full_paths: boolean = false): string[] {
    const fileNames: string[] = [];
    const names = fs.readdirSync(dir);
    names.forEach((name) => {
        if (fs.lstatSync(path.join(dir, name)).isFile()) {
            fileNames.push(full_paths ? dir + "\\" + name : name);
        } else {
            fileNames.push(...recursiveReaddir(path.join(dir, name), full_paths));
        }
    });
    return fileNames;
}
