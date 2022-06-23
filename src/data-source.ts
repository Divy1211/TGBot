import "reflect-metadata";
import {DataSource} from "typeorm";

import {Guild} from "./entities/Guild";
import {GameMap} from "./entities/queues/GameMap";
import {Leaderboard} from "./entities/queues/Leaderboard";
import {Pool} from "./entities/queues/Pool";
import {PoolMap} from "./entities/queues/PoolMap";
import {Queue} from "./entities/queues/Queue";
import {PlayerStats} from "./entities/stats/PlayerStats";
import {User} from "./entities/User";
import {Account} from "./entities/user_data/Account";
import {Profile} from "./entities/user_data/Profile";

export const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: "database.sqlite",
    synchronize: true,
    logging: true,
    entities: [GameMap, Leaderboard, Pool, PoolMap, Queue, PlayerStats, Account, Profile, Guild, User],
    migrations: [],
    subscribers: [],
});
