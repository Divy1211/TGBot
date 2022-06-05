# TGBot

Discord bot to allow people to easily setup and play AoE2DE team games together on a server. This bot is still under developement.

# Running The Code With Your Own Bot Application
In order to run this bot, you must create a bot application and invite the bot with the correct OAuth2 permissions to your server. After Cloning the source code to a local directory, follow these steps:

1. Install node version `v17.3.0` or higher and npm version `8.3.0` or higher
2. `cd` into the source directory
3. Run `npm install .`
4. Run `npm install -g typescript ts-node`
5. Make a `.env` file in the root directory of the source and add your bot token under `TOKEN=<BOT TOKEN GOES HERE>`. Note: Make sure that you never post your bot token publicly! It allows anyone who has it to take control of your bot.
6. Add your server's guild ID under `TEST=<GUILD ID GOES HERE>`
7. `npm run dev` can then be used for developing the bot with hot reloading.