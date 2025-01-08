import fastify, { FastifyInstance } from 'fastify'
import pointOfView from '@fastify/view'
import ejs from "ejs"
import routes from './routes/index'
import dotenv from 'dotenv'
import { errorResponse } from './utils/response.utils'
import path from 'path'

dotenv.config()

const app: FastifyInstance = fastify({ logger: true })

app.register(require('@fastify/cors'), {
    origin: '*', 
})

app.register(require('@fastify/static'), {
    root: [
        path.join(__dirname, "..", "..", "app", 'public'),
        path.join(__dirname, "..", "..", "storage")
    ],
})

app.register(pointOfView, {
    engine: {
      ejs: ejs
    },
    root: path.join(__dirname, "..", "..", "app", 'ejs')
})

app.register(routes)

app.setErrorHandler((error, request, reply) => {
    const statusCode = error.statusCode || 500
    return errorResponse(reply, error.message || 'Internal Server Error', statusCode)
})

const start = async (): Promise<void> => {
    try {
        const PORT = Number(process.env.PORT)
        await app.listen({ port: PORT })
        const address = app.server.address()

        if (typeof address === 'object' && address !== null) {
            app.log.info(`Server listening on ${address.address}:${address.port}`)
        } else {
            app.log.info(`Server listening on ${address}`)
        }
    } catch (err) {
        app.log.error(err)
    }
}

start()
