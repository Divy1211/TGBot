# TG-Bot Commands

### Admin Commands

| Command               | Functionality                     | paras                                   | Status      |
|-----------------------|-----------------------------------|-----------------------------------------|-------------|
| `create_q`            | creates a new queue               | `name`, `num_players`                   | Done        |
| `delete_q`            | delete a queue                    | `uuid`                                  | Done        |
| `edit_q`              | edit the setting of a queue       | `queue_uuid`, `[name]`, `[num_players]` | Done        |
| `set_logging_channel` | sets a logging channel in a serer |                                         | Done        |
| `set_admin_role`      | sets a role as the admin          | `role`                                  | Done        |
| `set_mod_role`        | sets a role as the mod role       | `role`                                  | Done        |
| `set_promote_role`    | sets a role as the promotion role | `role`                                  | Done        |
| `set_promote_cd`      | sets the promotion cool down      | `role`                                  | Done        |
| `add_maps`            |                                   |                                         | WIP by Siqi |
| `remove_map`          |                                   |                                         | WIP by Siqi |
| `create_pool`         |                                   |                                         | WIP by Siqi |



### Mod Commands

| Command        | Functionality                                                                | paras                                 | Status |
|----------------|------------------------------------------------------------------------------|---------------------------------------|--------|
| `rating_set`   | sets the rating of a user for the leaderboard of a particular queue          | `rating`, `user`, `[queue_uuid]`      |        |
| `rating_reset` | resets the ratings of all the users in the server back to the default `1000` | `[user]`, `[leaderboard_uuid]`        |        |
| `stats_reset`  | resets all the statistics of all the users in the server                     | `[user]`, `leaderboard_uuid`          |        |
| `ban`          | bans a user from joining queues                                              | `user`, `[duration]`, `for`           | Done   |
| `unban`        | removes the ban from a user to join a queue                                  | `user`                                | Done   |
| `report_win`   | report the winning team for a game                                           | `match_uuid`, `team`, `overwite=True` |        |
| `cancel_match` | void the result of a match or cancel an ongoing match                        | `match_uuid`                          | Done   |
| `reset`        | removes all players from all the queues in the server                        |                                       |        |



### Captain Commands

| Command       | Functionality                     | paras | Status |
|---------------|-----------------------------------|-------|--------|
| `report_loss` | report the losing team for a game |       |        |



### Player/User Commands

| Command         | Functionality                                                                            | paras                                                                      | Status       |
|-----------------|------------------------------------------------------------------------------------------|----------------------------------------------------------------------------|--------------|
| `list_q`        | shows all the queues in a server                                                         | `all=True`, `show_leaderboard_id`, `show_pool_ids`                         | Done         |
| `join`          | allows a user to join a queue in the channel                                             | `[queue_uuid]` `[user]`                                                    | Done         |
| `leave`         | allows a user to leave a queue in the channel                                            | `[queue_uuid]` `[user]`                                                    | Done         |
| `leave_all`     | allows a user to leave all queues in a server                                            |                                                                            | WIP by Ishan |
| `set_default_q` | allow a user to set a queue as their default join queue in the channel                   | `queue_uuid`                                                               |              |
| `list_players`  | allow a user to see all the players in a queue                                           | `[queue_uuid]`                                                             | Done         |
| `profile`       | allow a user to see the profile of a user                                                | `[user]`, `[queue_uuid]`, `[leaderboard_uuid]`                             |              |
| `leaderboard`   | allow a user to see the players in leaderboard ranked by rating                          | `[queue_uuid]`, `[leaderboard_uuid]`                                       |              |
| `win_rate`      | allow a user to see their (or someone else's) win rate statistics                        |                                                                            |              |
| `civ_win_rate`  | see the win rates of a particular civ                                                    |                                                                            |              |
| `list_maps`     | list all the maps used by a queue or a pool                                              | `[queue_uuid]`, `[pool_uuid]`                                              | WIP By Siqi  |
| `list_pools`    | list all the pools in a server                                                           |                                                                            | WIP By Siqi  |
| `show_map`      | show a map and its statistics                                                            | `map_uuid`                                                                 | WIP By Siqi  |
| `top`           | show top players of this month / all time                                                | `[queue_uuid]`, `[leaderboard_uuid]`, `all_time=False`, `by_win_rate=True` |              |
| `list_matches`  | show a list of matches and map of that match                                             | `[queue_uuid]`, `[leaderboard_uuid]`                                       |              |
| `show_match`    | show all information (map, players, civilians, ratings, winners and lobby id) of a match | `match_uuid`                                                               |              |
| `last_match`    | show the last match of the user                                                          | `[user]`,, `[queue_uuid]` `[leaderboard_uuid]`                             |              |
| `promote`       | pings the promotion role as set by the `promotionRoleId` to beckon users to play a game  |                                                                            | Done         |
| `promo_sub`     | allow a user to add themselves to the promotion role                                     | `enable`                                                                   |              |
| `list_bans`     | allow a user to see the names of all the banned users and the reasons                    |                                                                            |              |
| `link`          |                                                                                          |                                                                            |              |
| `unlink`        |                                                                                          |                                                                            |              |
| `elo_graph`     |                                                                                          |                                                                            |              |
| `phrase`        |                                                                                          |                                                                            |              |
| `toss`          |                                                                                          |                                                                            |              |
