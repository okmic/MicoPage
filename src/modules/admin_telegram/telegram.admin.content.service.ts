import { PrismaClient } from "@prisma/client"
import { Context } from "grammy"

class TelegramAdminContentService {
    private prismaClient: PrismaClient

    constructor() {
        this.prismaClient = new PrismaClient()
    }

    async getContentDetailsCommand(ctx: Context) {
        const content = await this.prismaClient.content.findFirst({
            include: {
                services: {
                    include: {
                        items: true
                    }
                },
                works: true,
                socialMedia: true,
                products: true
            }
        })

        if (!content) {
            return ctx.reply('Контент не найден.')
        }

        await ctx.reply(`*Основная информация сайта*\n\n*Название:* ${content.logoName}\n*Описание компании:* ${content.companyDescription}\n*Адрес:* ${content.address}\n*Телефон:* ${content.phone}\n*Email:* ${content.email}`, { parse_mode: 'Markdown' })

        // Работы
        if (content.works.length > 0) {
            let worksMessage = `*Как это работает:*\n`
            content.works.forEach(work => {
                worksMessage += `- *Название:* ${work.title}\n  *Изображение:* ${work.imgUrl}\n`
            })
            await ctx.reply(worksMessage, { parse_mode: 'Markdown' })
        } else {
            await ctx.reply(`*Как это работает:*\nНет доступных работ.`, { parse_mode: 'Markdown' })
        }

        // Услуги
        if (content.services.length > 0) {
            let servicesMessage = `*Услуги:*\n`
            content.services.forEach(service => {
                servicesMessage += `- *Название:* ${service.title}\n  *Изображение:* ${service.imgUrl}\n`
                service.items.forEach(item => {
                    servicesMessage += `  - *Элемент:* ${item.text}\n`
                })
            })
            await ctx.reply(servicesMessage, { parse_mode: 'Markdown' })
        } else {
            await ctx.reply(`*Услуги:*\nНет доступных услуг.`, { parse_mode: 'Markdown' })
        }

        // Социальные медиа
        if (content.socialMedia.length > 0) {
            let socialMediaMessage = `*Социальные медиа:*\n`
            content.socialMedia.forEach(social => {
                socialMediaMessage += `- *Название:* ${social.title}\n  *Ссылка:* ${social.linkToSM}\n  *Изображение:* ${social.imgUrl}\n`
            })
            await ctx.reply(socialMediaMessage, { parse_mode: 'Markdown' })
        } else {
            await ctx.reply(`*Социальные медиа:*\nНет доступных социальных медиа.`, { parse_mode: 'Markdown' })
        }

        // Продукты
        if (content.products.length > 0) {
            let productsMessage = `*Продукты:*\n`
            content.products.forEach(product => {
                productsMessage += `- *Название:* ${product.title}\n  *Описание:* ${product.description}\n  *Цена:* ${product.price}\n  *Изображение:* ${product.imgUrl}\n`
            })
            await ctx.reply(productsMessage, { parse_mode: 'Markdown' })
        } else {
            await ctx.reply(`*Продукты:*\nНет доступных продуктов.`, { parse_mode: 'Markdown' })
        }
    }
}



export default new TelegramAdminContentService()