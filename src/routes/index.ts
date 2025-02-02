import { FastifyInstance } from 'fastify'
import pingController from '../modules/ping/ping.controller'
import micoPageGenerateController from '../modules/micoPage/micoPage.generate.controller'

export default async function routes(fastify: FastifyInstance) {

    fastify.get('/api/ping', pingController.ping)
    fastify.post('/api/mico-page/generate/ejs', micoPageGenerateController.generateHTML)
/*     fastify.get('/api/visit', visitController.create)
    fastify.get('/', siteController.home)
    fastify.get('/products', siteController.products) */

    fastify.setNotFoundHandler((request, reply) => {
        reply.view("error")
    })
}
