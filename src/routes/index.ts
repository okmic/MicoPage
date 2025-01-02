import { FastifyInstance } from 'fastify'
import { pingController } from '../modules/ping/ping.controller'
import { homeController } from '../modules/home/home.controller'
import { visitCreateController } from '../modules/visit/visit.controller'

export default async function routes(fastify: FastifyInstance) {

    fastify.get('/api/ping', pingController)
    fastify.get('/api/visit', visitCreateController)
    fastify.get('/', homeController)

    fastify.setNotFoundHandler((request, reply) => {
        reply.view("error")
    })
}