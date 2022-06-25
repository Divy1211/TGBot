## Queues and Pools

This document explains how the data structures under `./queues` are related to each other.

## GameMap

A map is the "domain" where the players play the game.

A map has the following properties:

1. `name: string`
2. `imgLink: string`: An optional link to an external image preview of the map.

## Pool

A pool is a large set of maps that are used to generate a smaller, random subset of maps (eg: 5 maps) for each game. The maps of the smaller subset become the "choices" that the players vote on to pick a single map for that game.

Additionally, every map in the pool has a _number of occurrences_ which is unique to that pool. This number is meant to allow certain maps to appear more often in the generated subset than others. For example, say a pool has two maps: `Arabia - 5` and `Arena - 3`. This means that `Arabia` has a `5/8` chance of being chosen as a map in the generated subset, and `Arena` has a `3/8` of being chosen as a map in the generated subset. This is the same as if we effectively had multiple copies of the same map in the pool, like so: `[Arabia, Arabia, Arabia, Arabia, Arabia, Arena, Arena, Arena]`.

A pool has the following properties:

1. `name: string`
2. `guild: Guild`: The discord sever that the pool belongs to.
3. `queues: Queue[]`: The list of queues that this pool is used by.
4. `maps: PoolMap[]`: The set of maps to use in this pool. Why is this not a list of `GameMap`s? See the [PoolMap](#poolmap) section for more details

## PoolMap

This is the data structure which links a `GameMap` to a `Pool`. This is required because each map has a number of occurrences which is unique to every pool that the map may be in. This allows for the same map to be in multiple pools with different number of occurrences for each pool.

A pool map has the following properties:

1. `map: GameMap`: A reference to a `GameMap`.
2. `pool: Pool`: A reference to the a `Pool`.
3. `multiplier: number`: The number of occurrences of the `GameMap` in the `Pool`.

## Queue

A queue is where users/players can "sign up" for playing game

A queue has the following properties:

1. `numPlayers: number`: The number of players needed to start a game
2. `channelId: string`: The discord channel in which the queue can be used
3. `guild: Guild`: The discord server that the queue belongs to.
4. `pools: Pool[]`: The list of pools used by this queue.
   - Normally a queue only has one pool from which the entire subset is generated, but with a list of pools, we can support a system where the generated subset of maps uses a particular pool for each of the choices. This is useful if the maps can be categorised into multiple types.
   - For instance, two pools including `Land` maps and `Water` maps can be made, which fix two choices in the subset to be limited to the maps chosen from those pools only.
5. `users: User[]`: The list of users currently in the queue.
6. `leaderboard: Leaderboard`: A reference to a data structure that contains the information about the players such as elo. See the [Leaderboard](#leaderboard) section for more details

## Leaderboard

A leaderboard contains information about players like their elo and number of games won/lost. Multiple queues can use the same leaderboard.

A leaderboard has the following properties:

1. `guild: Guild`: The discord server that the queue belongs to
2. `queues: Queue[]`: The list of queues that use this leaderboard
3. `playerStats: PlayerStats[]`: A list of stats per player in the leaderboard.