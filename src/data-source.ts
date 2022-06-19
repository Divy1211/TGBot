import "reflect-metadata";
import {DataSource} from "typeorm";
import {Profile} from "./entities/Profile";
import {Account} from "./entities/Account";
import {User} from "./entities/User";

export const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: "database.sqlite",
    synchronize: true,
    logging: true,
    entities: [User, Profile, Account],
    migrations: [],
    subscribers: [],
});
