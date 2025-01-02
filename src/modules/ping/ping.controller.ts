import { FastifyRequest, FastifyReply } from 'fastify'
import { successResponse, errorResponse } from '../../utils/response.utils'

class PingController {

  async ping(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      return successResponse(reply, { msg: "pong"})
    } catch (e) {
      return errorResponse(reply, "Error code: fdsfds**j32kf32fh23lpoj, some error", 500)
    }
  }

} 

export default new PingController()