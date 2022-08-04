import { Guild } from "../../../src/entities/Guild";
import { GameMap } from "../../../src/entities/pools/GameMap";
import {editMap} from "../../../src/abstract_commands/pools/edit_map"


let guild: Guild;
let gameMap: GameMap;

beforeAll(async () => {
    guild = new Guild("guild-1");
    await guild.save();
})

afterAll(async ()=> {
    await Guild.remove(await Guild.find());
})

describe("Valid Edit", () => {
    afterEach(async () => {
        await GameMap.remove(await GameMap.find());
    })

    test("Edit a map in the server", async () => {
        const mapName = "mapTest", imgLink = "https://upload.wikimedia.org/wikipedia/en/9/9b/Aoeiii-cover.jpg", guildId =  "guild-1";
        const editName = "editName";
        gameMap = new GameMap(mapName, imgLink, guild);
        await gameMap.save();

        expect(
            await editMap(guildId, gameMap.uuid, {newName: editName})
        ).toBe(`Map "${editName}" has been edited successfully!`);

        const editImgLink = "https://static.wikia.nocookie.net/ageofempires/images/1/1a/Age3de-library-boxart.jpg/revision/latest?cb=20200916075046";
        await editMap(guildId, gameMap.uuid, {newImgLink: editImgLink});
        let newGameMap = await GameMap.findOneBy({guild: {id: guildId}});
        expect(newGameMap?.imgLink).toBe(editImgLink);  // new game map found
    })
})

describe("Invalid Edit", () => {
    afterEach(async () => {
        await GameMap.remove(await GameMap.find());
    })

    test("Edit a non-existing map in the server", async () => {
        const guildId = "guild-1", editName = "editName";
        
        expect(
            await editMap(guildId, 1, {newName: editName})
        ).toBe("Map with ID 1 does not exist in this server");
    })

    test("Provide an invalid URL for the image link", async () => {
        const mapName = "mapTest", imgLink = "https://upload.wikimedia.org/wikipedia/en/9/9b/Aoeiii-cover.jpg", guildId =  "guild-1";
        const editImgLink = "Invalid.link";
        gameMap = new GameMap(mapName, imgLink, guild);
        await gameMap.save();

        expect(
            await editMap(guildId, gameMap.uuid, {newImgLink: editImgLink})
        ).toBe("The URL provided for the image link is not valid");
    })
})