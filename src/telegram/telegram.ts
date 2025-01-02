import { Bot, Context, session, SessionFlavor } from 'grammy'
import dotenv from 'dotenv'
import { Content, PrismaClient } from '@prisma/client'

dotenv.config()

const PRISMA = new PrismaClient()

interface MySession {
    content?: keyof Content
}

type MyContext = Context & SessionFlavor<MySession>

export default class TelegramBot {
    private bot: Bot<MyContext>
    private keysContent: (keyof Content)[] = [
        'service1_title',
        'service1_items',
        'service2_title',
        'service2_items',
        'service3_title',
        'service3_items',
        'service4_title',
        'service4_items',
        'service5_title',
        'service5_items',
        'service6_title',
        'service6_items',
        'work1_title',
        'work1_items',
        'work2_title',
        'work2_items',
        'address',
        'phone',
        'email',
    ]

    constructor(token: string) {
        this.bot = new Bot<MyContext>(token)
        this.bot.use(session<MySession, Context>())

        this.bot.use(this.authMiddleware)

        const createMenu = () => ({
            reply_markup: {
                keyboard: [
                    [{ text: '/setcontent' }, { text: '/getcontent' }],
                    [{ text: '/getvisits' }],
                ],
                resize_keyboard: true,
                one_time_keyboard: true,
            },
        })

        this.bot.command('start', (ctx) => {
            ctx.reply('Выберите опцию:', createMenu())
        })

        this.bot.command('menu', (ctx) => {
            ctx.reply('Выберите опцию:', createMenu())
        })

        this.bot.command('getcontent', async (ctx) => {
            const content = await PRISMA.content.findFirst()
            ctx.reply(`Содержимое:\n\n\n${JSON.stringify(content)}`)
        })

        this.bot.command('setcontent', async (ctx) => {
            await ctx.reply('Выберите действие:', {
                reply_markup: {
                    inline_keyboard: this.keysContent.map((property) => [
                        { text: property, callback_data: property },
                    ]),
                },
            })
        })

        this.bot.command('getvisits', async (ctx) => {
            const content = await PRISMA.visit.findMany()
            const lastDates = content.slice(-10).map((v) => {
                const date = new Date(v.createdAt)
                const options: Intl.DateTimeFormatOptions = {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                }
                return date.toLocaleDateString('ru-RU', options)
            }).join('\n')

            ctx.reply(`Количество посещений на сайт (за все время): ${content.length + 1}\n\nПоследние 10 посещений:\n${lastDates}`)
        })

        this.keysContent.forEach((property) => {
            const msg = /items/.test(property) 
            ? `Пожалуйста, введите новый список значений для ${property}\nнапример\nТекст1\nТекст2\nТекст3` 
            : `Пожалуйста, введите новое значение для ${property}:`

        this.bot.callbackQuery(property, (ctx) => {
            ctx.session.content = property
            ctx.reply(msg)
        })
    })

    this.bot.on('message', async (ctx) => {
        if (ctx.session && ctx.session.content) {
            let valueContent
            if (/items/.test(ctx.session.content)) {
                valueContent = ctx.message.text.split(/\r?\n/).map(line => line.trim())
            } else {
                valueContent = ctx.message.text.trim()
            }
            await this.saveContent(ctx.session.content, valueContent)
            ctx.session.content = null
            ctx.reply('Записал и обновил на сайте!')
        }
    })
}

async saveContent(propertyType: keyof Content, value: any) {
    const content = await PRISMA.content.findFirst()
    if (!content) throw new Error('Контент не найден.')

    await PRISMA.content.update({
        data: {
            [propertyType]: value,
        },
        where: {
            id: content.id,
        },
    })
}

private authMiddleware = async (ctx: MyContext, next: () => Promise<void>) => {
    const chatId = ctx.chat?.id
    if (chatId && String(chatId) === process.env.TG_CHAT_ID) {
        await next()
    } else {
        await ctx.reply('У вас нет доступа к этому боту.')
    }
}

async startPolling() {
    try {
        await this.bot.start()
    } catch (e) {
        console.error('Telegram error', e)
    }
}
}
