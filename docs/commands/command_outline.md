# TG-Bot Commands

### Admin Commands

| Command               | Functionality                     | paras                                   |
|-----------------------|-----------------------------------|-----------------------------------------|
| `create_q`            | creates a new queue               | `name`, `num_players`                   |
| `delete_q`            | delete a queue                    | `uuid`                                  |
| `edit_q`              | edit the setting of a queue       | `queue_uuid`, `[name]`, `[num_players]` |
| `set_logging_channel` | sets a logging channel in a serer |                                         |
| `set_admin_role`      | sets a role as the admin          | `role`                                  |
| `set_mod_role`        | sets a role as the mod role       | `role`                                  |
| `set_promote_role`    | sets a role as the promotion role | `role`                                  |
| `set_promote_cd`      | sets the promotion cool down      | `role`                                  |
| `add_maps`            |                                   |                                         |
| `remove_map`          |                                   |                                         |
| `create_pool`         |                                   |                                         |



### Mod Commands

| Command        | Functionality                                                                | paras                                 |
|----------------|------------------------------------------------------------------------------|---------------------------------------|
| `rating_set`   | sets the rating of a user for the leaderboard of a particular queue          | `rating`, `user`, `[queue_uuid]`      |
| `rating_reset` | resets the ratings of all the users in the server back to the default `1000` | `[user]`, `[leaderboard_uuid]`        |
| `stats_reset`  | resets all the statistics of all the users in the server                     | `[user]`, `leaderboard_uuid`          |
| `ban`          | bans a user from joining queues                                              | `user`, `[duration]`, `for`           |
| `unban`        | removes the ban from a user to join a queue                                  | `user`                                |
| `report_win`   | report the winning team for a game                                           | `match_uuid`, `team`, `overwite=True` |
| `cancel_match` | void the result of a match or cancel an ongoing match                        | `match_uuid`                          |
| `reset`        | removes all players from all the queues in the server                        |                                       |



### Captain Commands

| Command       | Functionality                     | paras |
|---------------|-----------------------------------|-------|
| `report_loss` | report the losing team for a game |       |



### Player/User Commands

| Command         | Functionality                                                                            | paras                                                                      |
|-----------------|------------------------------------------------------------------------------------------|----------------------------------------------------------------------------|
| `list_q`        | shows all the queues in a server                                                         | `all=True`, `show_leaderboard_id`, `show_pool_ids`                         |
| `join`          | allows a user to join a queue in the channel                                             | `[queue_uuid]`                                                             |
| `leave`         | allows a user to leave a queue in the channel                                            | `[queue_uuid]`                                                             |
| `leave_all`     | allows a user to leave all queues in a server                                            |                                                                            |
| `set_default_q` | allow a user to set a queue as their default join queue in the channel                   | `queue_uuid`                                                               |
| `list_players`  | allow a user to see all the players in a queue                                           | `[queue_uuid]`                                                             |
| `profile`       | allow a user to see the profile of a user                                                | `[user]`, `[queue_uuid]`, `[leaderboard_uuid]`                             |
| `leaderboard`   | allow a user to see the players in leaderboard ranked by rating                          | `[queue_uuid]`, `[leaderboard_uuid]`                                       |
| `win_rate`      | allow a user to see their (or someone else's) win rate statistics                        |                                                                            |
| `civ_win_rate`  | see the win rates of a particular civ                                                    |                                                                            |
| `list_maps`     | list all the maps used by a queue or a pool                                              | `[queue_uuid]`, `[pool_uuid]`                                              |
| `list_pools`    | list all the pools in a server                                                           |                                                                            |
| `show_map`      | show a map and its statistics                                                            | `map_uuid`                                                                 |
| `top`           | show top players of this month / all time                                                | `[queue_uuid]`, `[leaderboard_uuid]`, `all_time=False`, `by_win_rate=True` |
| `list_matches`  | show a list of matches and map of that match                                             | `[queue_uuid]`, `[leaderboard_uuid]`                                       |
| `show_match`    | show all information (map, players, civilians, ratings, winners and lobby id) of a match | `match_uuid`                                                               |
| `last_game`     | show the last match of the user                                                          | `[user]`,, `[queue_uuid]` `[leaderboard_uuid]`                             |
| `promote`       | pings the promotion role as set by the `promotionRoleId` to beckon users to play a game  |                                                                            |
| `promo_sub`     | allow a user to add themselves to the promotion role                                     | `enable`                                                                   |
| `list_bans`     | allow a user to see the names of all the banned users and the reasons                    |                                                                            |
| `link`          |                                                                                          |                                                                            |
| `unlink`        |                                                                                          |                                                                            |
| `elo_graph`     |                                                                                          |                                                                            |
| `phrase`        |                                                                                          |                                                                            |
| `toss`          |                                                                                          |                                                                            |
