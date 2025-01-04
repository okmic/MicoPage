import { PrismaClient } from "@prisma/client"
import { Bot, InlineKeyboard } from "grammy"
import { MyContext } from "../types"

class TelegramAdminContentUpdateService {

    private prismaClient: PrismaClient
    private bot: Bot<MyContext>

    constructor(bot) {
        this.prismaClient = new PrismaClient()
        this.bot = bot
    }

    async handleUpdates() {
        try {
            
        } catch (e) {
            console.error(e)
        }
    }    
    
}

export default TelegramAdminContentUpdateService
