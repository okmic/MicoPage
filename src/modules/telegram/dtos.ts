import {Request} from "express"

export class SendToTgDto {
    constructor(private readonly req: Request) {}

    getData() {
        return {
            userName: this.req.body.userName,
            userEmail: this.req.body.userEmail,
            userPhone: this.req.body.userPhone
        }
    }
}