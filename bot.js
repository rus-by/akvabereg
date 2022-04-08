const User = require('./models/user')
const { Telegraf, Markup } = require('telegraf');
const bot = new Telegraf('1875499476:AAEbYNFoGw-Ltw_6cIr4ADR_yoM93KhhGc4');

bot.start(async(ctx) => {
    const userName = ctx.message.from.username
    const findUser = await User.findOne({ telegram: userName })
    if (findUser) {
        findUser.chatId = ctx.from.id
        await findUser.save()
        ctx.reply('Test')
    }

});


bot.launch();

module.exports = bot;