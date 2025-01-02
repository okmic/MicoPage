import { FastifyRequest, FastifyReply } from 'fastify'
import { successResponse, errorResponse } from '../../utils/response.utils'

export const pingController = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    return successResponse(reply, { msg: "pong"})
  } catch (e) {
    return errorResponse(reply, "Error code: fdsfds**j32kf32fh23lpoj, some error", 500)
  }
}
