import { Content, PrismaClient } from "@prisma/client"
import { FastifyReply, FastifyRequest } from "fastify"

class SiteController {

    async home(req: FastifyRequest, reply: FastifyReply) {
        try {
            const prisma = new PrismaClient()
            const content: Content = await prisma.content.findFirst({
                include: {
                    works: true,
                    services: {include: {items: true}},
                    socialMedia: true
                }    
            })
            return reply.view('home', {content})
        } catch (e) {
            console.error(e)
            return reply.view('error')
        }
    }

    async products(req: FastifyRequest, reply: FastifyReply) {
        try {
            const prisma = new PrismaClient()

            const content: Content = await prisma.content.findFirst({
                include: {
                    works: true,
                    services: {include: {items: true}},
                    socialMedia: true,
                    products: true
                }    
            })
            return reply.view('products', {content})
        } catch (e) {
            console.error(e)
            return reply.view('error')
        }
    }
}

export default new SiteController()