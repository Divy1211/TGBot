import "reflect-metadata";
import {DataSource} from "typeorm";

import {Guild} from "./entities/Guild";
import {MapOption} from "./entities/matches/MapOption";
import {Match} from "./entities/matches/Match";
import {Player} from "./entities/matches/Player";
import {GameMap} from "./entities/pools/GameMap";
import {Pool} from "./entities/pools/Pool";
import {PoolMap} from "./entities/pools/PoolMap";
import {Leaderboard} from "./entities/queues/Leaderboard";
import {PlayerStats} from "./entities/queues/PlayerStats";
import {Queue} from "./entities/queues/Queue";
import {QueueDefault} from "./entities/queues/QueueDefault";
import {QueueMsg} from "./entities/queues/QueueMsg";
import {User} from "./entities/User";
import {Account} from "./entities/user_data/Account";
import {Ban} from "./entities/user_data/Ban";
import {Profile} from "./entities/user_data/Profile";

export const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: "data/database.sqlite",
    synchronize: true,
    logging: true,
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

export const TestDataSource = new DataSource({
    type: "better-sqlite3",
    database: "test.sqlite",
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

