import { MessageEmbed } from "discord.js";
import { showMap } from "../../../src/abstract_commands/pools/show";
import { Guild } from "../../../src/entities/Guild";
import { GameMap } from "../../../src/entities/pools/GameMap";


let guild: Guild;
let map: GameMap;

beforeAll(async () => {
    guild = new Guild("guild-1");
    await guild.save();
})

afterAll(async () => {
    await Guild.remove(await Guild.find());
})

describe("Valid Show", () => {
    afterEach(async () => {
        await GameMap.remove(await GameMap.find());
    });

    test("Show a map statics", async () => {
        const name = "mapTest", guildId = "guild-1", imgLink = "https://upload.wikimedia.org/wikipedia/en/9/9b/Aoeiii-cover.jpg";
        map = new GameMap(name, imgLink, guild);
        await map.save();

        expect(
            await showMap(map.uuid, guildId)
            ).toBeInstanceOf(MessageEmbed);
    })
})

describe("Invalid Show", () => {
    test("Show a non-existing map statics", async () => {
        const guildId = "guild-1";
        expect(
            await showMap(1, guildId)
            ).toBe(`Map with ID 1 was not found.`);
    })
})