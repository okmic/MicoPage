import { PrismaClient } from "@prisma/client"
import { FastifyReply, FastifyRequest } from "fastify"
import { errorResponse, successResponse } from "../../utils/response.utils"

class VisitController {

    async create(req: FastifyRequest, reply: FastifyReply) {
        try {            
            const prisma = new PrismaClient()
    
            let json
            try {
                json = JSON.stringify(req.body)
            } catch {
                json = undefined
            }
    
            
            prisma.visit.create({
                data: {
                    json: json ? json : null
                }
             })
    
            return successResponse(reply, {msg: "saved"})
        } catch (e) {
            return errorResponse(reply, "error saved", 500)
        }
    }
}

export default new VisitController()