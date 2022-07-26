import { Guild } from "../../../src/entities/Guild";
import { GameMap } from "../../../src/entities/pools/GameMap";
import { deleteGameMap } from "../../../src/abstract_commands/pools/delete_map";


let guild: Guild;
let map: GameMap;

beforeAll(async () => {
    guild = new Guild("guild-1");
    await guild.save();
})

afterAll(async ()=> {
    await Guild.remove(await Guild.find());
})

describe("Valid Delete", () => {
    afterEach(async () => {
        await GameMap.remove(await GameMap.find());
    })

    test("Delete a map from the database", async () => {
        const mapName = "mapTest", guildId =  "guild-1",
        imgLink = "https://upload.wikimedia.org/wikipedia/en/9/9b/Aoeiii-cover.jpg";
        map = new GameMap(mapName, imgLink, guild);
        await map.save();

        expect(
            await deleteGameMap(map.uuid, guildId)
        ).toBe(`Map "${mapName}" with ID ${map.uuid} has been deleted successfully!`);

        await deleteGameMap(map.uuid, guildId);
        expect(
            await GameMap.findOneBy({name: mapName})
        ).toBeNull();
    })
})

describe("Invalid Delete", () => {
    afterEach(async () => {
        await GameMap.remove(await GameMap.find());
    })

    test("Delete a non-existing map", async () => {
        const guildId =  "guild-1";
        expect(
            await deleteGameMap(1, guildId)
        ).toBe(`Map with ID 1 was not found`);
    })
})