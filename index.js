const TelegramApi = require('node-telegram-bot-api')
const {gameOptions,againOptionns} = require('./options')
const token = '6825733462:AAGA2LOu2L9ng3Q1g2lWECLvXZkKqXcw9wg'

const bot = new TelegramApi(token,{polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Пока вы ждете свой заказ, давайте поиграем, я загадаю цифру от 1 до 9, а вы попробуете её угадать!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId,'Отгадаете?', gameOptions);
}

const start = () =>{
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра угадай цифру'},
    ])

    bot.on('message', async msg=>{
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start'){
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/3a3/83d/3a383d59-7d23-450e-aae1-ad0af390552f/3.webp')
            return bot.sendMessage(chatId, `Добро пожаловать в бота для покупки еды и напитков в поезде!`)
        }
        if (text === '/info'){
            return bot.sendMessage(chatId, `Вас зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game'){
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Ой, повторите запрос, я вас не понял')
    })
    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') {
            return startGame(chatId);
        }
        if (data == chats[chatId]){
            return bot.sendMessage(chatId,`Поздравляю, вы угадали цифру ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId,`К сожалению вы не угадали, бот загадал цифру ${chats[chatId]}`, againOptions)
        }

        bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)
    })
}

start()