import { FastifyReply } from 'fastify'

export function successResponse(reply: FastifyReply, data: any) {
    return reply.send({
        status: 'success',
        values: data
    })
}

export function errorResponse(reply: FastifyReply, message: string, statusCode: number = 500) {
    return reply.status(statusCode).send({
        status: 'error',
        message,
        code: statusCode
    })
}