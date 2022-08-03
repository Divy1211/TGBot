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
import {AoE2Link} from "./entities/user_data/AoE2Link";
import {Ban} from "./entities/user_data/Ban";

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
        AoE2Link,
        Ban,
        Guild,
        User,
    ],
    migrations: [],
    subscribers: [],
});