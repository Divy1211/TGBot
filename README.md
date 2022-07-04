# TGBot

Discord bot to allow people to easily setup and play AoE2DE team games together on a server. This bot is still under developement.

# Running The Code With Your Own Bot Application
In order to run this bot, you must create a bot application and invite the bot with the correct OAuth2 permissions to your server. After Cloning the source code to a local directory, follow these steps:

1. Install node version `v17.3.0` or higher and npm version `8.3.0` or higher
2. `cd` into the source directory
3. Run `npm i`
4. Make a `.env` file in the **root** directory of the source and add:
    1. Your instance's bot token as `TOKEN=<BOT TOKEN GOES HERE>`. Note: Make sure that you never post your bot token publicly! It allows anyone who has it to take control of your bot.
    2. Add your test server's guild ID as `TEST=<GUILD ID GOES HERE>`
5. `npm run dev` can then be used for developing the bot with hot reloading.
6. `npm run start` can be used to run the bot without hot reloading (should not be used in production)
7. `npm run deploy` can be used to run the bot in a production environment