import { FastifyReply, FastifyRequest } from 'fastify';

export const validationErrorHandler = (error: any, request: FastifyRequest, reply: FastifyReply) => {
    if (error.validation) {
        const errors = error.validation.map((e: any) => ({
            message: e.message,
            params: e.params,
            instancePath: e.instancePath,
        }));
        return reply.status(400).send({
            statusCode: 400,
            error: 'Bad Request',
            message: 'Validation errors',
            errors: errors,
        });
    }

    reply.status(error.statusCode || 500).send({
        statusCode: error.statusCode || 500,
        error: error.message || 'Internal Server Error',
    });
};
