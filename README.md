# TGBot
A Discord bot to allow people to easily setup and play AoE2DE team games together on a server. This bot is still under development!

# Requirements
1. Node version: `^17.3.0`
2. NPM version `^8.3.0` (If using another package manager, use the equivalents for the npm commands shown below)


# Running The Code With Your Own Bot Application
In order to run this bot, you must first:
1. Create a discord account, 
2. Create a bot application from the discord developer portal
3. Invite the bot with the correct OAuth2 permissions to your server.
4. [This guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html) covers the above steps in detail.

After going through the above setup, clone the source code to a local directory, then follow these steps:

1. `cd` into the source directory
2. Run `npm i`
3. Create a `.env` file in the **root** directory of the source (**not** inside the `./src` folder) and add:
    1. A line containing your bot token as `TOKEN=<BOT TOKEN GOES HERE>` (Secret, should never be made public)
    2. Add your test server's guild ID as `TEST=<GUILD ID GOES HERE>`
4. `npm run dev` can then be used for developing the bot with hot reloading.
5. `npm run start` can be used to run the bot without hot reloading (should not be used in production)
6. `npm run deploy` can be used to run the bot in a production environment