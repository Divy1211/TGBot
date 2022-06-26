## DB Class Design Philosophy

This document covers what should be kept in mind while designing the classes that make up the database. These are basically the guiding principles that should be used when designing a database class!

### Columns

1. Each class has a `PrimaryColumn` or a `PrimaryGeneratedColumn`.
    - For things like `guildId`, `discordId`, etc. which are provided to us by an external API (discord) use `PrimaryColumn`.
    - Use `PrimaryGeneratedColumn` for anything else.

### Relations
1. About the usage of `cascade: true`. Read [this](https://typeorm.io/relations#relation-options) if you do not know what cascade does.
    - A relation where one (composite) object has an instance of another object (eg. a `Queue` has a list of `User`s) may set `cascae: true` **if** changes to the second object can be made via the composite object, or if the composite object can add instances of the second object.
    - By design, we should refrain from saving an object that is cascaded by explicitly calling `save()` on it. For example, when we save a `Queue`, it is likely that a player has been added to/removed from the `players` property, and it makes sense to automatically save new entries when the `Queue` itself is saved.
    - An object that adds itself to a list of its type contained in another object should **not** be cascaded. For example, a `Guild` contains a list of `Queue`s, and the `Queue` objects contain a backref to the `Guild`. If a new queue is created, it is faster to set this backref for the `Queue` and save it directly, than load the entire `Queue`s list for the guild and then save that via cascading.
    - Why do we not do the same for `User`s in a `Queue` then? Because we need the total player count everytime someone leaves/joins the queue to determine if the game can be started, All the `players` must be loaded in the `Queue` anyway.
2. About the usage of `onDelete` Read [this](https://typeorm.io/relations#relation-options) if you do not know what onDelete does.
   - Any object that should be deleted if the object that it is in relation with is deleted has this set to `"CASCADE"`. For example, all the player statistics should be deleted if the leaderboard pertaining to them is deleted. This is usually used for many-one relations.
   - When an object whose relation should be set to null if the other object in the relation is deleted has this set to `"SET NULL"`. For example, if a user is deleted, we want to set its reference to null in all the players. This is usually seen in one-one relations 
3. About the usage of `eager: true` Read [this](https://typeorm.io/relations#relation-options) if you do not know what eager does.
    - Any relation that is frequently or always used with an object has an `eager: true` so that we do not need to explicitly specify loading it in each query.
    - For example, when we load a `Queue` there is a good chance that a player is trying to join/leave it, so we will always load the `players` in the `Queue` so we can determine if there are enough players to start a game.

### Constructors

The constructors for each class always initialise an instance's own columns. Any other objects that are in relation with the class may or may not be initialsied by the constructor.
- For example, a `Leaderboard` instance has a list of `PlayerStatistics` for each player that exists in the `Leaderboard`, but it does not make sense to create a new leaderboard with an existing list of `PlayerStatistics`. It makes more sense for a new `PlayerStatistics` object to set which `Leaderboard` it belongs to using its `leaderboard` backref instead. This is also faster query-wise, as explained in the [Relations](#relations) section.