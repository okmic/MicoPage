import { Content, PrismaClient } from "@prisma/client"
import { FastifyReply, FastifyRequest } from "fastify"

export const homeController = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const prisma = new PrismaClient()
        const content: Content = await prisma.content.findFirst({
            include: {
                works: true,
                services: {include: {items: true}},
                socialMedia: true
            }    
        })
        
        console.log(content)

        return reply.view('home', {content: content})
    } catch (e) {
        console.error(e)
        return reply.view('error')
    }
}
