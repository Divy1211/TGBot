import {TestDataSource} from "./test-data-source";

beforeAll(async () => {
    await TestDataSource.initialize();
})