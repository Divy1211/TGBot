import {TestDataSource} from "./test-data-source";

beforeAll(async () => {
    await TestDataSource.initialize();
})

afterAll(async () => {
    for(const entity of TestDataSource.entityMetadatas) {
        const repository = TestDataSource.getRepository(entity.name)
        await repository.clear();
    }
    await TestDataSource.destroy();
})