## Functional Specifications

This document describes each command, its usage and permission scope. The functionality of these commands is implemented in functions inside the code files for each command. This is to allow for both easier testing and usage from the website interface.

Note: The terms guild and server are used interchangeably.

Note: In a lot of the places, there are phrases like "This command should only show a match which is on a leaderboard that belongs to the server that this command runs in". What this basically means is that since the `uuid` of a match is universally unique (hence the name **uu**id) a user can potentially request to show a match with a `uuid` which was played in a different server. This should not work, and correctly return an error stating that the match was not found!  

Note: These specifications are currently ignored due to development purposes, but it is really easy to add them in the finished product:
1. To run admin commands, a user must either have the `Manage Channel` permission, or have the `admin role`. 
2. To run moderator commands, a user must either have the `Manage Channel` permission or have the `mod role`.

### Admin Commands

1. `create_q`
   1. <span style="color:pink">Purpose</span>: This command creates a new queue in the channel that it is used in.
   2. <span style="color:pink">Constraints</span>: This command must be used inside a channel in a guild.
   3. <span style="color:pink">Actors</span>: Admins
   4. <span style="color:pink">Parameters</span>:
      1. <span style="color:blue">name</span>: The name of the queue.
      2. <span style="color:blue">num_players</span>: The max number of players for the queue.
   5. <span style="color:red">Normal Flow</span>: A new `Queue` object is created and saved in the database.
   6. <span style="color:red">Alternate Flow</span>: An error is returned if the command is run outside a server text channel.

2. `delete_q`
   1. <span style="color:pink">Purpose</span>: This command deletes a queue in a channel.
   2. <span style="color:pink">Constraints</span>: This command can only delete queues that were created in the channel that it is run in.
   3. <span style="color:pink">Actors</span>: Admins
   4. <span style="color:pink">Parameters</span>:
      1. <span style="color:blue">uuid</span>: The ID of the queue to delete.
   5. <span style="color:red">Normal Flow</span>: A `Queue` object with the provided `uuid` should be fetched and removed from the database.
   6. <span style="color:red">Alternate Flow</span>: An error is returned if the uuid specified does not belong to a queue in the channel that this command is run in.

3. `edit_q`
   1. <span style="color:pink">Purpose</span>: This command can be used to edit the settings of a queue.
   2. <span style="color:pink">Constraints</span>: This command can only edit queues in the channel that this command is run in.
   3. <span style="color:pink">Actors</span>: Admins
   4. <span style="color:pink">Parameters</span>:
      1. <span style="color:blue">queue_uuid</span>: The `uuid` of the queue to modify..\
      2. <span style="color:blue">name</span>: (optional) The new name of the queue. If unspecified, the name is not changed.
      3. <span style="color:blue">num_players</span>: (optional) The new number of players for the queue. If unspecified, the number of players are not changed.
   5. <span style="color:red">Normal Flow</span>: the `Queue` instance with the given `uuid` is fetched from the database, modified if necessary and saved back.
   6. <span style="color:red">Alternate Flow</span>: return an appropriate message if the queue `uuid` specified is not valid or exists in a different channel than in which this command is run.

4. `set_logging_channel`
   1. <span style="color:pink">Purpose</span>: This command sets a logging channel in a serer.
   2. <span style="color:pink">Constraints</span>: This command needs to be run in the channel which the user wants to set as the logging channel.
   3. <span style="color:pink">Actors</span>: Admins
   4. <span style="color:pink">Parameters</span>:
   5. <span style="color:red">Normal Flow</span>: Fetch the `Guild` instance of the guild where this command is run. Set the `loggingChannelId` on the guild instance and save the `Guild` object. (All commands and website interface actions must be properly logged in this channel, a logging class needs to be implemented!)

5. `set_admin_role`
   1. <span style="color:pink">Purpose</span>: This command sets a role as the admin role for the server. A user with this role on the server will be allowed to run all admin and moderator commands.
   2. <span style="color:pink">Constraints</span>: This command can only set the role for a particular server.
   3. <span style="color:pink">Actors</span>: Admins
   4. <span style="color:pink">Parameters</span>:
      1. <span style="color:blue">role</span>: The role to set as the admin role.
   5. <span style="color:red">Normal Flow</span>: Fetch the `Guild` instance of the guild where this command is run. Set the `adminRoleId` on the guild instance and save the `Guild` object.

6. `set_mod_role`
   1. <span style="color:pink">Purpose</span>: This command sets a role as the mod role for the server. A user with this role on the server will be allowed to run all mod commands.
   2. <span style="color:pink">Constraints</span>: This command can only set the role for a particular server.
   3. <span style="color:pink">Actors</span>: Admins
   4. <span style="color:pink">Parameters</span>:
      1. <span style="color:blue">role</span>: The role to set as the mod role.
   5. <span style="color:red">Normal Flow</span>: Fetch the `Guild` instance of the guild where this command is run. Set the `modRoleId` on the guild instance and save the `Guild` object.

7. `set_promote_role`
   1. <span style="color:pink">Purpose</span>: This command sets a role as the promotion role for the server. A user with this role on the server will be pinged by the bot.
   2. <span style="color:pink">Constraints</span>: This command can only set the role for a particular server.
   3. <span style="color:pink">Actors</span>: Admins
   4. <span style="color:pink">Parameters</span>:
      1. <span style="color:blue">role</span>: The role to set as the promotion role.
   5. <span style="color:red">Normal Flow</span>: Fetch the `Guild` instance of the guild where this command is run. Set the `promotionRoleId` on the guild instance and save the `Guild` object.

8. `set_promote_cd`
   1. <span style="color:pink">Purpose</span>: This command sets the promotion cooldown.
   2. <span style="color:pink">Constraints</span>: This command can only set the cooldown for a particular server.
   3. <span style="color:pink">Actors</span>: Admins
   4. <span style="color:pink">Parameters</span>:
      1. <span style="color:blue">duration</span>: The duration for the cooldown `hh:mm[:ss]`.
   5. <span style="color:red">Normal Flow</span>: Fetch the `Guild` instance of the guild where this command is run. Set the `promotion duration`on the guild instance and save the `Guild` object.
   6. <span style="color:red">Alternate Flow</span>: Return an appropriate error message if the format used is incorrect.

9. `add_maps` The specifics of this command are yet to be determined
10. `remove_map` The specifics of this command are yet to be determined
11. `create_pool` The specifics of this command are yet to be determined

## Mod Commands

1. `rating_set`
   1. <span style="color:pink">Purpose</span>: This command sets the rating of a user for the leaderboard of a particular queue.
   2. <span style="color:pink">Constraints</span>: This command can only set the ratings for the queues in the channel that it is run in.
   3. <span style="color:pink">Actors</span>: Admins, Mods
   4. <span style="color:pink">Parameters</span>:
      1. <span style="color:blue">rating</span>: The new rating of the user.
      2. <span style="color:blue">user</span>: The user to set the rating for.
      3. <span style="color:blue">queue_uuid</span>: (optional) The ID of the queue to delete.
   5. <span style="color:red">Normal Flow</span>: All the `Queue`s in the channel that this command is run in should be retrieved. If there is a single queue in the channel, use its `Leaderboard` and set the given user's `rating` in the `PlayerStats` object. Save the `PlayerStats` object back to the database.
   6. <span style="color:red">Alternate Flow 1</span>: If there are more than 1 queues in the channel, ask the user to specify its ID.
   7. <span style="color:red">Alternate Flow 2</span> If there are no queues in the channel, return an appropriate error.

2. `rating_reset`
   1. <span style="color:pink">Purpose</span>: This command resets the ratings of all the users in the server back to the default `1000`.
   2. <span style="color:pink">Constraints</span>: This command can only reset the ratings for the leaderboards in the server that this command is run in.
   3. <span style="color:pink">Actors</span>: Admins, Mods
   4. <span style="color:pink">Parameters</span>:
      1. <span style="color:blue">user</span>: (optional): If specified, reset the ratings only for this user. 
      2. <span style="color:blue">leaderboard_uuid</span>: (optional) If specified, reset the ratings only for this leaderboard.
   5. <span style="color:red">Normal Flow</span>: Ask for confirmation from the user if they really want to reset ratings. If yes, set all the `rating` values for all the `PlayerStats` lists of all the `Leaderboard` instances in the server to `1000`. Save the modified `PlayerStats` and `Leaderboard` instances back to the database.

2. `stats_reset`
   1. <span style="color:pink">Purpose</span>: This command resets all the statistics of all the users in the server.
   2. <span style="color:pink">Constraints</span>: This command can only reset the stats for the leaderboards in the server that this command is run in.
   3. <span style="color:pink">Actors</span>: Admins, Mods
   4. <span style="color:pink">Parameters</span>:
      1. <span style="color:blue">user</span>: (optional): If specified, reset the stats only for this user.
      2. <span style="color:blue">leaderboard_uuid</span>: (optional) If specified, reset the ratings only for this leaderboard.
   5. <span style="color:red">Normal Flow</span>: Ask for confirmation from the user if they really want to reset stats. If yes, set all the `numGames` etc. values for all the `PlayerStats` lists of all the `Leaderboard` instances in the server to `0`. Save the modified `PlayerStats` and `Leaderboard` instances back to the database.

3. `ban`
   1. <span style="color:pink">Purpose</span>: This command bans a user from joining queues.
   2. <span style="color:pink">Constraints</span>: This command can only ban users from joining queues in a particular server.
   3. <span style="color:pink">Actors</span>: Admins, Mods
   4. <span style="color:pink">Parameters</span>:
      1. <span style="color:blue">user</span>: The user to ban.
      2. <span style="color:blue">duration</span>: (optional) if unspecified, permanently ban the user. String, in `hh:mm[:ss]` format.
      3. <span style="color:blue">for</span>: (optional) The reason for banning the user.
   5. <span style="color:red">Normal Flow</span>: A new `Ban` instance is created, the duration is converted to seconds and added to the current epoch timestamp and saved in `Ban.until`. Save the ban instance in the database.
   6. <span style="color:red">Alternate Flow 1</span>: If the user specified is invalid, return an appropriate error.
   7. <span style="color:red">Alternate Flow 2</span> If the duration specified is in an invalid format, return an appropriate error.

4. `unban`
   1. <span style="color:pink">Purpose</span>: This command removes the ban from a user to join a queue.
   2. <span style="color:pink">Constraints</span>: This command can only unban users from joining queues in a particular server.
   3. <span style="color:pink">Actors</span>: Admins, Mods
   4. <span style="color:pink">Parameters</span>:
      1. <span style="color:blue">user</span>: The user to unban.
   5. <span style="color:red">Normal Flow</span>: The `Ban` instance for the specified `user` (and `guild`) is fetched from the database and removed.
   6. <span style="color:red">Alternate Flow 1</span>: If the user specified is invalid, return an appropriate error.
   7. <span style="color:red">Alternate Flow 2</span> If the timestamp of the `Ban.until` is already passed or there is no ban entry for the user specified, return an error saying that the user is not banned.

5. `report_win`
   1. <span style="color:pink">Purpose</span>: This command can be used to report the winning team for a game.
   2. <span style="color:pink">Constraints</span>: This command can only report the wins for matches happening in a queue in the same channel as the one where this command is run.
   3. <span style="color:pink">Actors</span>: Admins, Mods
   4. <span style="color:pink">Parameters</span>:
      1. <span style="color:blue">match_uuid</span>: The match to report the result for.
      2. <span style="color:blue">team</span>: The number of the team that won. (`minValue = 1`, `maxValue = 2`)
      3. <span style="color:blue">overwrite</span>: (default: `false`) if true, this will overwrite the result of the match even if it has already been registered
   5. <span style="color:red">Normal Flow</span>: The `Match` instance with the given `uuid` is fetched and the result is stored in the `winningTeam` attribute and saved. The ratings of all the players are adjusted in the `PlayerStats` object to reflect the outcome of the match. Save all the modified database objects. 
   6. <span style="color:red">Alternate Flow 1</span>: If the provided `match_uuid` is invalid, return an appropriate error message.
   7. <span style="color:red">Alternate Flow 2</span> If the result for the match for the provided `match_uuid` is already registered, return an appropriate message if `overwrite` is set to `false`.
   8. <span style="color:red">Alternate Flow 3</span> If `overwrite` is set to `true`, then store the new result for the match and re-calculate the elo changes for every player and reflect them in the appropriate `PlayerStats` object (the elo BEFORE the match started are stored in the player objects in every match, so this should be trivial).

6. `cancel_match`
   1. <span style="color:pink">Purpose</span>: This command can be used to void the result of a match or cancel an ongoing match.
   2. <span style="color:pink">Constraints</span>: This command can only cancel matches happening in a queue in the same channel as the one where this command is run.
   3. <span style="color:pink">Actors</span>: Admins, Mods
   4. <span style="color:pink">Parameters</span>:
      1. <span style="color:blue">match_uuid</span>: The match to cancel.
   5. <span style="color:red">Normal Flow</span>: The `Match` instance with the given `uuid` is fetched and if its result has already been registered, undo the rating changes and `numGames` etc. changes to the appropriate `PlayerStats` objects. Remove the match object from the database.
   6. <span style="color:red">Alternate Flow 1</span>: If the provided `match_uuid` is invalid, return an appropriate error message.
   7. <span style="color:red">Alternate Flow 2</span> If the result for the match for the provided `match_uuid` is already registered, return an appropriate message.

7. `reset`
   1. <span style="color:pink">Purpose</span>: This command removes all players from all the queues in the server.
   2. <span style="color:pink">Constraints</span>: This command can only reset the queues on a particular server
   3. <span style="color:pink">Actors</span>: Admins, Mods
   4. <span style="color:pink">Parameters</span>:
   5. <span style="color:red">Normal Flow</span>: Fetch all the `Queue`s of the guild where this command is run. Remove all the users from all the queues obtained. Save the queues back to the database.

### Captain Commands

A captain is a player/user

1. `report_loss`
   1. <span style="color:pink">Purpose</span>: This command can be used by to report the losing team for a game.
   2. <span style="color:pink">Constraints</span>: This command must be used by an admin, mod or captain who is currently in an ongoing match.
   3. <span style="color:pink">Actors</span>: Admins, Mods, Captains
   4. <span style="color:pink">Parameters</span>:
   5. <span style="color:red">Normal Flow</span>: The `currentMatch` instance for the usernof this command is fetched and the result is stored in the `winningTeam` attribute and saved. The ratings of all the players are adjusted in the `PlayerStats` object to reflect the outcome of the match.
   6. <span style="color:red">Alternate Flow 1</span>: If the provided `match_uuid` is invalid, return an appropriate error message.
   7. <span style="color:red">Alternate Flow 2</span> If the result for the match for the provided `match_uuid` is already registered, return an appropriate message if `overwrite` is set to `false`.
   8. <span style="color:red">Alternate Flow 3</span> If `overwrite` is set to `true`, then store the new result for the match and re-calculate the elo changes for every player and reflect them in the appropriate `PlayerStats` object (the elo BEFORE the match started are stored in the player objects in every match, so this should be trivial).

### Player/User Commands

1. `list_q`
   1. <span style="color:pink">Purpose</span>: This command shows all the queues in a server. This shows a possibly paged embed
   2. <span style="color:pink">Constraints</span>: This command must be used in a channel in a guild.
   3. <span style="color:pink">Actors</span>: Admins, Mods, Users.
   4. <span style="color:pink">Parameters</span>:
      1. <span style="color:blue">all</span>: (default: `true`) If false, only the queues in the current channel are shown.
      2. <span style="color:blue">show_leaderboard_id</span>: (default: `false`) If true, show the leaderboard IDs for the queue.
      3. <span style="color:blue">show_pool_ids</span>: (default: `false`) If true, show the pool IDs for the queue.
   5. <span style="color:red">Normal Flow</span>: Show an embed with all the queues in the server. 
   6. <span style="color:red">Alternate Flow</span>: If no queues are found in the server, show a relevant message.

2. `join`
   1. <span style="color:pink">Purpose</span>: This command allows a user to join a queue in the channel that this command is run in.
   2. <span style="color:pink">Constraints</span>: This command must be used in a channel in a guild.
   3. <span style="color:pink">Actors</span>: Admins, Mods, Users.
   4. <span style="color:pink">Parameters</span>:
      1. <span style="color:blue">queue_uuid</span>: (optional) put the user in the queue with this `uuid`. Useful when there are multiple queues in a single channel only.
   5. <span style="color:red">Normal Flow</span>: All the queues in the channel where this command is used are fetched. If there is just one queue, add the user to that queue. If there are multiple queues, fetch the queue default for the user for this channel and join the `defaultQ` or the `lastQ` in that priority. Save the queue back to the database.
   6. <span style="color:red">Alternate Flow 1</span>: If none of the `defaultQ` or `lastQ`s are defined and the `queue_uuid` parameter is unspecified, return a message asking the user to specify it.
   7. <span style="color:red">Alternate Flow 2</span> If no queues are found in the channel, show a relevant message.
   8. Additional Flow: When the number of users in the queue are == `numPlayers` of the queue, then start a match in that queue. When a match is started, remove all the users from any other queues that they are in, *even queues that are on other servers*

3. `leave`
   1. <span style="color:pink">Purpose</span>: This command allows a user to leave a queue in the channel that this command is run in.
   2. <span style="color:pink">Constraints</span>: This command must be used in a channel in a guild.
   3. <span style="color:pink">Actors</span>: Admins, Mods, Users.
   4. <span style="color:pink">Parameters</span>:
      1. <span style="color:blue">queue_uuid</span>: (optional) remove the user from the queue with this `uuid`. Useful when there are multiple queues in a single channel only.
   5. <span style="color:red">Normal Flow</span>: All the queues in the channel where this command is used are fetched. If there is just one queue, remove the user from that queue. Save the queue back to the database.
   6. <span style="color:red">Alternate Flow 1</span>: If the channel has multiple queues:
      - The user is in just one queue, leave that queue. 
      - The user is in multiple queues, and the `queue_id` is not specified - show a message asking the user to specify which queue they want to leave.
   7. <span style="color:red">Alternate Flow 2</span> If no queues are found in the channel, show a relevant message.

4. `leave_all`
   1. <span style="color:pink">Purpose</span>: This command allows a user to leave all queues in a server.
   2. <span style="color:pink">Constraints</span>: This command must be used in a channel in a guild.
   3. <span style="color:pink">Actors</span>: Admins, Mods, Users.
   4. <span style="color:pink">Parameters</span>:
   5. <span style="color:red">Normal Flow</span>: Remove the user from all the queues in the guild that this command is run in.

5. `set_default_q`
   1. <span style="color:pink">Purpose</span>: Allow a user to set a queue as their default join queue in a channel.
   2. <span style="color:pink">Constraints</span>: This command must be used in a channel in a guild.
   3. <span style="color:pink">Actors</span>: Admins, Mods, Users.
   4. <span style="color:pink">Parameters</span>:
      1. <span style="color:blue">queue_uuid</span>: Set this queue as the default join queue
   5. <span style="color:red">Normal Flow</span>: fetch (or create if not present) the `QueueDefaults` for the user and for the channel that this command is run in. set the `defaultQ` property and save the `QueueDefaults` instance back to the database.

6. `list_players`
   1. <span style="color:pink">Purpose</span>: Allow a user to see all the players in a queue. This will show a possible paged embed
   2. <span style="color:pink">Constraints</span>: This command must be used in a channel in a guild, and should only list players from the queues of the channel that this command is used in.
   3. <span style="color:pink">Actors</span>: Admins, Mods, Users.
   4. <span style="color:pink">Parameters</span>:
      1. <span style="color:blue">queue_uuid</span>: (optional) show the players in this queue.
   5. <span style="color:red">Normal Flow</span>: fetch all the `Queue`s in the channel that this command is used in. If there is just one queue, display an embed with the list of all the players in the queue
   6. <span style="color:red">Alternate Flow</span>: If there are multiple queues in the channel and `queue_uuid` is not specified, return an appropriate message asking the user to specify the queue for which they want to see the players.

7. `profile`
   1. <span style="color:pink">Purpose</span>: Allow a user to see the profile of a user. This shows the user's rank, rating, total/wins/losses/streak, win rate and the rating changes in the last (max) 5 matches. This will show an embed.
   2. <span style="color:pink">Constraints</span>: This command must be used in a channel in a guild. This command should only show the profiles from the leaderboards in the server that this command is run in.
   3. <span style="color:pink">Actors</span>: Admins, Mods, Users.
   4. <span style="color:pink">Parameters</span>:
      1. <span style="color:blue">user</span>: (optional) show the profile of this user. If unspecified, show the profile of the user that used this command 
      2. <span style="color:blue">queue_uuid</span>: (optional) show the profile from the leaderboard of this queue.
      3. <span style="color:blue">leaderboard_uuid</span>: (optional) show the profile from this leaderboard. 
   5. <span style="color:red">Normal Flow</span>: fetch all the `Queue`s in the channel that this command is used in. If there is just one queue, display the profile of the user for the `Leaderboard` of that queue.
   6. <span style="color:red">Alternate Flow</span>: If there are multiple queues and `queue_uuid` or `leaderboard_uuid` is unspecified, return a message asking the user to specify the `queue_uuid` or the `leaderboard_uuid` that they want to see the profile from.

8. `leaderboard`
   1. <span style="color:pink">Purpose</span>: Allow a user to see the players in leaderboard ranked by rating. Also shows the players `Total/Win/Loss/Streak` counts. This will show a possibly paged embed.
   2. <span style="color:pink">Constraints</span>: This command must be used in a channel in a guild. This command should only show the leaderboards of queues that belong to the server in which this command is run
   3. <span style="color:pink">Actors</span>: Admins, Mods, Users.
   4. <span style="color:pink">Parameters</span>:
      1. <span style="color:blue">queue_uuid</span>: (optional) show the leaderboard of this queue.
      2. <span style="color:blue">leaderboard_uuid</span>: (optional) show this leaderboard.
   5. <span style="color:red">Normal Flow</span>: fetch all the `Queue`s in the channel that this command is used in. If there is just one queue, display the `Leaderboard` of that queue.
   6. <span style="color:red">Alternate Flow</span>: If there are multiple queues and `queue_uuid` or `leaderboard_uuid` is unspecified, return a message asking the user to specify the `queue_uuid` or the `leaderboard_uuid` that they want to see the profile from.

9. `win_rate`
   1. <span style="color:pink">Purpose</span>: Allow a user to see their (or someone else's) win rate statistics.
   2. <span style="color:pink">Constraints</span>: This command must be used in a channel in a guild. This command should only show the statistics from a leaderboard that belongs to the server where this command is run in.
   3. <span style="color:pink">Actors</span>: Admins, Mods, Users.
   4. <span style="color:pink">Parameters</span>: <span style="color:orange">ALL of these are optional! If a parameter is left out, its not used in the filter basically</span>.
      1. <span style="color:blue">user</span>: show the win rates of this user. if unspecified, show the winrates of the user of this command.
      2. <span style="color:blue">as</span>: when they play as this civilization.
      3. <span style="color:blue">against</span>: against this civilization.
      4. <span style="color:blue">with1</span>: with this user as ally.
      5. <span style="color:blue">as1</span>: as this civilization.
      6. <span style="color:blue">with2</span>: with this user as second ally.
      7. <span style="color:blue">as2</span>: as this civilization.
      8. <span style="color:blue">with3</span>: with this user as third ally.
      9. <span style="color:blue">as3</span>: as this civilization.
      10. <span style="color:blue">vs1</span>: vs this user as enemy.
      11. <span style="color:blue">as1</span>: as this civilization.
      12. <span style="color:blue">vs2</span>: vs this user as second enemy.
      13. <span style="color:blue">as2</span>: as this civilization.
      14. <span style="color:blue">vs3</span>: vs this user as third enemy.
      15. <span style="color:blue">as3</span>: as this civilization.
      16. <span style="color:blue">vs4</span>: vs this user as fourth enemy.
      17. <span style="color:blue">as4</span>: as this civilization.
      18. <span style="color:blue">on_map_uuid</span>: show the win rates on this map.
      19. <span style="color:blue">queue_uuid</span>: show the statistics from the leaderboard of this queue.
      20. <span style="color:blue">leaderboard_uuid</span>: show the statistics from this leaderboard.
   5. <span style="color:red">Normal Flow</span>: fetch all the `Queue`s in the channel that this command is used in. If there is just one queue, display the win rates from the `Leaderboard` of that queue. Calculating this will require looping through all the `Match`s and filtering them as specified by the arguments.
   6. <span style="color:red">Alternate Flow</span>: If there are multiple queues and `queue_uuid` or `leaderboard_uuid` is unspecified, return a message asking the user to specify the `queue_uuid` or the `leaderboard_uuid` that they want to see the win rates from.

10. `civ_win_rate`
    1. <span style="color:pink">Purpose</span>: see the win rates of a particular civ.
       1. <span style="color:pink">Constraints</span>: This command must be used in a channel in a guild. This command should only show the statistics from a leaderboard that belongs to the server in which the command is run.
       2. <span style="color:pink">Actors</span>: Admins, Mods, Users.
       3. <span style="color:pink">Parameters</span>:
          1. <span style="color:blue">against1</span>: (optional) against this civilization.
          2. <span style="color:blue">against2</span>: (optional) against this second civilization.
          3. <span style="color:blue">against3</span>: (optional) against this third civilization.
          4. <span style="color:blue">against4</span>: (optional) against this fourth civilization.
          5. <span style="color:blue">on_map_uuid</span>: (optional) show the win rates on this map.
          6. <span style="color:blue">queue_uuid</span>: (optional) show the win rates from the leaderboard of this queue.
          7. <span style="color:blue">leaderboard_uuid</span>: (optional) show win rates from this leaderboard.
       4. <span style="color:red">Normal Flow</span>: fetch all the `Queue`s in the channel that this command is used in. If there is just one queue, display the win rates from the `Leaderboard` of that queue. Calculating this will require looping through all the `Match`s and filtering them as specified by the arguments.
       5. <span style="color:red">Alternate Flow</span>: If there are multiple queues and `queue_uuid` or `leaderboard_uuid` is unspecified, return a message asking the user to specify the `queue_uuid` or the `leaderboard_uuid` that they want to see the win rates from.

11. `list_maps`
    1. <span style="color:pink">Purpose</span>: list all the maps used by a queue or a pool.
    2. <span style="color:pink">Constraints</span>: This command must be used in a channel in a guild. This command should only show maps from queues or pools that belong to the server in which this command is run.
    3. <span style="color:pink">Actors</span>: Admins, Mods, Users.
    4. <span style="color:pink">Parameters</span>:
       1. <span style="color:blue">queue_uuid</span>: (optional) see the maps of the pool of this queue.
       2. <span style="color:blue">pool_uuid</span>: (optional) see the maps of this pool.
    5. <span style="color:red">Normal Flow</span>: fetch all the `Queue`s in the channel that this command is used in. If there is just one queue, display the maps from the `Pool` of this queue.
    6. <span style="color:red">Alternate Flow</span>: If there are multiple queues and `queue_uuid` or `leaderboard_uuid` is unspecified, return a message asking the user to specify the `queue_uuid` or the `leaderboard_uuid` that they want to see the maps from.

12. `list_pools`
    1. <span style="color:pink">Purpose</span>: list all the pools in a server. Displays an embed
    2. <span style="color:pink">Constraints</span>: This command must be used in a channel in a guild. This command should only show pools that belong to the server in which this command is run.
    3. <span style="color:pink">Actors</span>: Admins, Mods, Users.
    4. <span style="color:pink">Parameters</span>:
    5. <span style="color:red">Normal Flow</span>: fetch all the `Pool`s in the server that this command is used in, and display an embed

13. `show_map`
    1. <span style="color:pink">Purpose</span>: show an embed with this map and its statistics.
    2. <span style="color:pink">Constraints</span>: This command must be used in a channel in a guild. This command should only show maps that 
    3. <span style="color:pink">Actors</span>: Admins, Mods, Users.
    4. <span style="color:pink">Parameters</span>:
       1. <span style="color:blue">map_uuid</span>: show the statistics and preview of this map (if available)
    5. <span style="color:red">Normal Flow</span>: fetch the `GameMap` with this uuid and show its stats and preview.
    6. <span style="color:red">Alternate Flow</span>: If no `GameMap` with this uuid is found, return an appropriate message.

14. `top`
    1. <span style="color:pink">Purpose</span>: show an embed with the top players of this month (or all time).
    2. <span style="color:pink">Constraints</span>: This command must be used in a channel in a guild. This command should only show the top players from a leaderboard that belongs to the server that this command is run in
    3. <span style="color:pink">Actors</span>: Admins, Mods, Users.
    4. <span style="color:pink">Parameters</span>:
       1. <span style="color:blue">queue_uuid</span>: (optional) use the leaderboard from this queue
       2. <span style="color:blue">leaderboard_uuid</span>: (optional) use this leaderboard
       3. <span style="color:blue">all_time</span>: (default: `false`) if `true`, see all time top players instead of just from the 1st of the current month
       4. <span style="color:blue">by_win_rate</span>: (default: `true`) if `false` see the top players by number of games played
    5. <span style="color:red">Normal Flow</span>: fetch all the `Queue`s in the channel that this command is used in. If there is just one queue, use the `Leaderboard` from this queue to display the top players. 
    6. <span style="color:red">Alternate Flow</span>: If there are multiple queues and `queue_uuid` or `leaderboard_uuid` is unspecified, return a message asking the user to specify the `queue_uuid` or the `leaderboard_uuid` that they want to see the top players from.

15. `list_matches`
    1. <span style="color:pink">Purpose</span>: show a (probably paged) embed with the matches and map of that match.
    2. <span style="color:pink">Constraints</span>: This command must be used in a channel in a guild. This command should only show matches from leaderboards that belong to the server that this command is run in.
    3. <span style="color:pink">Actors</span>: Admins, Mods, Users.
    4. <span style="color:pink">Parameters</span>:
       1. <span style="color:blue">queue_uuid</span>: (optional) use the leaderboard from this queue
       2. <span style="color:blue">leaderboard_uuid</span>: (optional) use this leaderboard
    5. <span style="color:red">Normal Flow</span>: fetch all the `Queue`s in the channel that this command is used in. If there is just one queue, use the `Leaderboard` from this queue to display the matches.
    6. <span style="color:red">Alternate Flow</span>: If there are multiple queues and `queue_uuid` or `leaderboard_uuid` is unspecified, return a message asking the user to specify the `queue_uuid` or the `leaderboard_uuid` that they want to see the matches from.

16. `show_match`
    1. <span style="color:pink">Purpose</span>: show an embed with the map, players, civs, ratings, winners and lobby id (if available) of this match.
    2. <span style="color:pink">Constraints</span>: This command must be used in a channel in a guild. This command should only show a match which is on a leaderboard that belongs to the server that this command runs in.
    3. <span style="color:pink">Actors</span>: Admins, Mods, Users.
    4. <span style="color:pink">Parameters</span>:
       1. <span style="color:blue">match_uuid</span>: show the match with this `uuid`
    5. <span style="color:red">Normal Flow</span>: fetch the map with the given `uuid` and show the embed.
    6. <span style="color:red">Alternate Flow</span>: If the given `uuid` is invalid, return an appropriate error message.

17. `last_game`
    1. <span style="color:pink">Purpose</span>: show the last match of the user 
    2. <span style="color:pink">Constraints</span>: This command must be used in a channel in a guild.
    3. <span style="color:pink">Actors</span>: Admins, Mods, Users.
    4. <span style="color:pink">Parameters</span>:
       1. <span style="color:blue">user</span>: (optional) show the last match of this user. If unspecified, show the last match of the user of this command 
       2. <span style="color:blue">queue_uuid</span>: (optional) use the leaderboard from this queue
       3. <span style="color:blue">leaderboard_uuid</span>: (optional) use this leaderboard to find the last match of the user
    5. <span style="color:red">Normal Flow</span>: fetch all the `Queue`s in the channel that this command is used in. If there is just one queue, use the `Leaderboard` from this queue to display the last match.
    6. <span style="color:red">Alternate Flow</span>: If there are multiple queues and `queue_uuid` or `leaderboard_uuid` is unspecified, return a message asking the user to specify the `queue_uuid` or the `leaderboard_uuid` that they want to see the last match from.

18. `promote`
    1. <span style="color:pink">Purpose</span>: pings the promotion role as set by the `promotionRoleId` to beckon users to play a game.
    2. <span style="color:pink">Constraints</span>: This command must be used in a channel in a guild. This command must only be allowed to use once every `promotionCooldown` seconds specified by the `Guild` instance.
    3. <span style="color:pink">Actors</span>: Admins, Mods, Users.
    4. <span style="color:pink">Parameters</span>:
    5. <span style="color:red">Normal Flow</span>: Ping the promotion role.
    6. <span style="color:red">Alternate Flow 1</span>: If the promotion role is not set, show an appropriate error message
    7. <span style="color:red">Alternate Flow 2</span>: If the current time is not at least `promotionCooldown` seconds after the `lastPromotion` of the `Guild` instance, show a mesasge saying that the promotion is not allowed.

19. `promo_sub`
    1. <span style="color:pink">Purpose</span>: allow a user to add themselves to the promotion role (if set) of the `Guild`.
    2. <span style="color:pink">Constraints</span>: This command must be used in a channel in a guild.
    3. <span style="color:pink">Actors</span>: Admins, Mods, Users.
    4. <span style="color:pink">Parameters</span>:
       1. <span style="color:blue">enable</span>: `true/false`.
    5. <span style="color:red">Normal Flow</span>: Give/Take the promotion role to/from this user in the server where this command is used.
    6. <span style="color:red">Alternate Flow</span>: If the promotion role is not set, show an appropriate error message

20. `list_bans`
    1. <span style="color:pink">Purpose</span>: Allow a user to see the names of all the banned users and the reasons for their bans and the time left until the ban expires. Displays an embed.
    2. <span style="color:pink">Constraints</span>: This command must be used in a channel in a guild. This command must only show the bans from the server where this command is run
    3. <span style="color:pink">Actors</span>: Admins, Mods, Users.
    4. <span style="color:pink">Parameters</span>:
    5. <span style="color:red">Normal Flow</span>: show an embed with the names of the banned players, the reasons for their bans and the timer until when the ban lasts.

21. `link` command specifics yet to be decided
22. `unlink` command specifics yet to be decided
23. `elo_graph` command specifics yet to be decided
24. `phrase` command specifics yet to be decided
25. `toss` command specifics yet to be decided