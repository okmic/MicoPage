import { NextFunction } from "grammy"
import { KeyContentUpdate, KeyContentUpdateWord, MyContext } from "../types"
import TelegramAdminHelper from "../helper"

export async function updateAdminContentMiddleWare(ctx: MyContext, next: NextFunction) {
    try {
        const keysUpdateWords: KeyContentUpdateWord[] = TelegramAdminHelper.keysUpdateWords

        if (!ctx.message || !ctx.message.text) return await next()

        const text = ctx.message.text.toLocaleLowerCase()
        let savedKey

        for (const kuw of keysUpdateWords) {
            const regExp = new RegExp(kuw.word)
            if (regExp.test(text)) {
                if (kuw.key === "someUpdate") savedKey = "someUpdate"
                else savedKey = kuw.key
            }
        }
        ctx.session.updateContent = savedKey as KeyContentUpdate
        return
    } catch (e) {
        console.error(e)
        await next()
        return
    } finally {
        await next()
    }
}
