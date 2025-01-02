import { Request, Response, NextFunction } from "express"
import axios from "axios"
import dotenv from "dotenv"
import { SendToTgDto } from "./dtos"
dotenv.config()

class TelegramController {

    async send(req: Request, res: Response, next: NextFunction) {
        try {
            const {userName, userEmail, userPhone} = new SendToTgDto(req).getData()
            if(!userName || !userEmail || !userPhone) return res.status(400).json({msg: "bad request"})

            const token = process.env.TG_TOKEN
            const chatId = process.env.TG_CHAT_ID
            
            await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, null, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                params: {
                    chat_id: chatId,
                    text: `Поступила заявка из сайта!👇\n\nИмя: ${userName}\nПочта: ${userEmail}\nТелефон: ${userPhone}`,
                }
            })
            .then(r => {
                return res.status(200).json({msg: "ok"})
            })
            .catch(e => {
                return res.status(500).json({msg: "error sending msg"})
            })
            
            
        } catch (e) {
            return res.status(500).json({msg: "some error"})
        }
    }

}

export default new TelegramController()