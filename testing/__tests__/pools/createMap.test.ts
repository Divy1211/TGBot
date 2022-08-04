import { createMap } from "../../../src/abstract_commands/pools/create_map";
import { Guild } from "../../../src/entities/Guild";
import { GameMap } from "../../../src/entities/pools/GameMap";
import { ensure } from "../../../src/utils/general";


let guild: Guild;

beforeAll(async () => {
    guild = new Guild("guild-1");
    await guild.save();
});

afterAll(async () => {
    await Guild.remove(await Guild.find());
})

describe("Valid Create", () => {
    afterEach(async () => {
        await GameMap.remove(await GameMap.find());
    })

    test("Create map", async () => {
        const name = "map-test-1", imgLink = "https://upload.wikimedia.org/wikipedia/en/9/9b/Aoeiii-cover.jpg", guildId = "guild-1";
        expect(
            await createMap(guildId, name, imgLink)
        ).toBe(`Map "${name}" has been created successfully!`);

        const map = ensure(await GameMap.findOneBy({name: name}));
        expect(map.name).toBe(name);
        expect(map.imgLink).toBe(imgLink);
    })
})

// describe("Invalid Create", () => {
//     afterEach(async () => {
//         await GameMap.remove(await GameMap.find());
//     })

//     test("Create the map with a replicated map name", async () => {
//         const name = "map-test-1",
//         imgLink1 = "https://upload.wikimedia.org/wikipedia/en/9/9b/Aoeiii-cover.jpg",
//         imgLink2 = "https://static.wikia.nocookie.net/ageofempires/images/1/1a/Age3de-library-boxart.jpg/revision/latest?cb=20200916075046",
//         guildId = "guild-1";

//         await createMap(name, imgLink1, guildId);
//         expect(
//             await createMap(name, imgLink2, guildId)
//             ).toBe(`Invalid: map with name ${name} already exists in the database.`);
        
//         const maps = await GameMap.find(
//             {where: {guild: {id: guildId}}}
//         );
//         const map = ensure(await GameMap.findOneBy({name: name, guild: {id: guildId}}));
//         expect(maps.length).toBe(1);    // only one map is in the GameMap table
//         expect(map.name).toBe(name);
//     })

    // TODO: create a map with an invalid imgLink => result: send an alert (but GameMap can still be created)
    // test("Create map with an invalid imgLink", async () => {        
    // })
// })