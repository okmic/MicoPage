import { FastifyInstance } from 'fastify'
import pingController from '../modules/ping/ping.controller'
import siteController from '../modules/site/site.controller'
import visitController from '../modules/visit/visit.controller'
import micoPageGenerateController from '../modules/micoPage/micoPage.generate.controller'

export default async function routes(fastify: FastifyInstance) {

    fastify.get('/api/ping', pingController.ping)
    fastify.get('/api/mico-page/generate', micoPageGenerateController.generateHTML)
/*     fastify.get('/api/visit', visitController.create)
    fastify.get('/', siteController.home)
    fastify.get('/products', siteController.products) */

    fastify.setNotFoundHandler((request, reply) => {
        reply.view("error")
    })
}
