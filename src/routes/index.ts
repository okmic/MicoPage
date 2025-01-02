import { FastifyInstance } from 'fastify'
import pingController from '../modules/ping/ping.controller'
import siteController from '../modules/site/site.controller'
import visitController from '../modules/visit/visit.controller'

export default async function routes(fastify: FastifyInstance) {

    fastify.get('/api/ping', pingController.ping)
    fastify.get('/api/visit', visitController.create)
    fastify.get('/', siteController.home)

    fastify.setNotFoundHandler((request, reply) => {
        reply.view("error")
    })
}
