import fs from "fs";
import path from "path";

import {TestDataSource} from "./test-data-source";

beforeAll(async () => {
    fs.rmSync(path.join(__dirname, "data"), {recursive: true, force: true});
    await TestDataSource.initialize();
});