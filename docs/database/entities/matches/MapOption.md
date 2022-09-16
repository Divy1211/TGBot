## Map Option

### 1. Functionality

In this bot, when players queue up for a game, 5 map voting options are generated for their match and the players can vote on those options to decide the map to play on. The following functionality must be supported by the voting system:

1. Allow a player to vote for one or more map options
2. Allow a player to rescind their vote for a map option
3. Track the total number of votes given to a particular option

### 2. Instance Attributes

This class has the following instance attributes:

#### 2.1. `uuid: number`
Database table primary key

#### 2.2. `numVotes: number`
Tracks the total number of votes given to an option

#### 2.3. `match: Match`
The match that this option was generated for.

Relation Options:

1. `ManyToOne`
   - Multiple `MatchOption`s are generated for one `Match`.
2. `onDelete: "CASCADE"`
   - If a `Match` is deleted, then its `MapOption` data is irrelevant, so we want to delete them as well.

#### 2.4. `map: GameMap`
The map that this option presents

Relation Options:

1. `ManyToOne::OneSided`
   - Multiple `MapOption`s can be generated to represent the same `GameMap` across multiple `Match`es.
2. `onDelete: "SET NULL"`
   - If a `GameMap` is deleted, we do not delete the `MapOption` itself, because its corresponding `Match` still needs to be able to account for all the options it provided the players, it just won't be able to display the name of the map.

#### 2.5. `players: Player[]`
The players that have voted for this option. Used to prevent multiple votes from the same player and allows for rescinding votes.

Relation Options:

1. `ManyToMany::OneSided`: Multiple `Player`s can vote for multiple `MapOption`s.
2. No `onDelete` action:
   - A `Player` is an internal object that can never be deleted by a user (and must not be deleted manually in code either) so we do not need to think about what happens to the relation in a `MapOption` if a `Player` is deleted.
   - The only case where a `Player` is deleted is through cascading a delete operation on a `Match`, in which case the corresponding `MapOption`s will be deleted as well though cascading.

### 3. Methods

#### 3.1 `updateVote`

Arguments:

1. `player: Player` - The player that clicked on this map option

Actions:

1. If the player has not already voted for this option:
   1. Increments:
      - the number of votes for this option
      - the number of total clicks for the map represented by this option
   2. Adds:
      - the player to the list of players who have voted for this map option

2. If the player has already voted for this option:
    1. Decrements:
        - the number of votes for this option
        - the number of total clicks for the map represented by this option
    2. Removes:
        - the player from the list of players who have voted for this map option

3. Returns a message informing the player of the action carried out