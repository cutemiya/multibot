const TelegramBot = require('node-telegram-bot-api')

const pg = require('pg')

const host = 'database'
const port = 5432
const database = 'production'
const user = 'fly_db_admin'
const password = 'password'

const createTgChat = `
    create table if not exists tgchat (
        id serial primary key,
        company_id int references "CompanyDetails"(id),
        chat_id decimal not null
    ); 
`

const runMigrate = async () => {
    const client = new pg.Client({
        host: host,
        port: port,
        database: database,
        user: user,
        password: password,
    })
    await client.connect()
    await client.query(createTgChat)
}
runMigrate()
const tokens = ['6960608719:AAEKyvS0-mUDcF-cucRSvbd4UjrxZLjJfyc.1', '6707483063:AAGSh_BYFVKofIfzfH-cxkU80PohHD4q3fM.1']

initBots = async () => {
    for (let token of tokens) {
        let companyId = token.split(".")[1]
        token = token.split(".")[0]
        let bot = new TelegramBot(token, {polling: true})

        bot.on('new_chat_members', async (msg) => {
            const chatId = msg.chat.id

            if (await check(chatId) < 1) {
                await insertOne(companyId, chatId)
                bot.sendMessage(chatId, "питон говно")
            }
        })
    }
}

const check = async (chatId) => {
    const client = new pg.Client({
        host: host,
        port: port,
        database: database,
        user: user,
        password: password,
    })
    await client.connect()
    let res = await client.query(`select Count(*) from tgchat where chat_id = ${chatId}`)
    return Number(res.rows[0].count)
}


const insertOne = async (companyId, chatId) => {
    const client = new pg.Client({
        host: host,
        port: port,
        database: database,
        user: user,
        password: password,
    })
    await client.connect()
    await client.query(`insert into tgchat (company_id, chat_id) values(${companyId}, ${chatId})`)
}

initBots()