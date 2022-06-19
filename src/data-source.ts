import "reflect-metadata";
import {DataSource} from "typeorm";

import {Guild} from "./entities/Guild";
import {Leaderboard} from "./entities/Leaderboard";
import {Queue} from "./entities/Queue";
import {PlayerStatistics} from "./entities/stats/PlayerStatistics";
import {User} from "./entities/User";
import {Account} from "./entities/user_data/Account";
import {Profile} from "./entities/user_data/Profile";

export const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: "database.sqlite",
    synchronize: true,
    logging: true,
    entities: [PlayerStatistics, Account, Profile, Guild, Leaderboard, Queue, User],
    migrations: [],
    subscribers: [],
});
