import { FastifyRequest, FastifyReply } from 'fastify'
import { successResponse, errorResponse } from '../../utils/response.utils'
import { IGenerateHTMLBodyI } from './types'
import {renderFile} from "ejs"

class MicoPageGenerateController {

  async generateHTML(req: FastifyRequest<{Body: IGenerateHTMLBodyI}>, reply: FastifyReply): Promise<void> {
    try {

        const {entryPointPathsToPages,exitPointPathToDeploy} = req.body

        for (let i = 0; i < entryPointPathsToPages.length; i++) {
            renderFile(entryPointPathsToPages[i], (err, str) => {
                if(err) throw new Error()
                    
            })
        }

        return successResponse(reply, { msg: "pong"})
    } catch (e) {
        return errorResponse(reply, "Error code: fdsfds**j32kf32fh23lpoj, some error", 500)
    }
  }

} 

export default new MicoPageGenerateController()