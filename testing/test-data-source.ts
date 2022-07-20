import "reflect-metadata";
import {DataSource} from "typeorm";

import {Guild} from "../src/entities/Guild";
import {MapOption} from "../src/entities/matches/MapOption";
import {Match} from "../src/entities/matches/Match";
import {Player} from "../src/entities/matches/Player";
import {GameMap} from "../src/entities/pools/GameMap";
import {Pool} from "../src/entities/pools/Pool";
import {PoolMap} from "../src/entities/pools/PoolMap";
import {Leaderboard} from "../src/entities/queues/Leaderboard";
import {PlayerStats} from "../src/entities/queues/PlayerStats";
import {Queue} from "../src/entities/queues/Queue";
import {QueueDefault} from "../src/entities/queues/QueueDefault";
import {QueueMsg} from "../src/entities/queues/QueueMsg";
import {User} from "../src/entities/User";
import {Account} from "../src/entities/user_data/Account";
import {Ban} from "../src/entities/user_data/Ban";
import {Profile} from "../src/entities/user_data/Profile";

export const TestDataSource = new DataSource({
    type: "better-sqlite3",
    database: "testing/data/database.sqlite",
    synchronize: true,
    logging: false,
    entities: [
        MapOption,
        Match,
        Player,
        GameMap,
        Leaderboard,
        Pool,
        PoolMap,
        Queue,
        QueueDefault,
        QueueMsg,
        PlayerStats,
        Account,
        Ban,
        Profile,
        Guild,
        User,
    ],
    migrations: [],
    subscribers: [],
});
