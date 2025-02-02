import { FastifyRequest, FastifyReply } from 'fastify'
import { successResponse } from '../../utils/response.utils'
import { IGenerateHTMLBodyI } from './types'
import ejs from "ejs"
import { PrismaClient } from '@prisma/client'
import fs from "fs/promises"
import path from 'path'
import CpFilesUtil from './utils/cp.files.util'
import FTPUtil from './utils/ftp.service.util'

class MicoPageGenerateController {

  async generateHTML(req: FastifyRequest<{ Body: IGenerateHTMLBodyI }>, reply: FastifyReply): Promise<void> {

    try {
        const { entryPointPathsToPages, exitPointPathToDeploy, contentId, entryPointPath, ftpServerId } = req.body

        const prisma = new PrismaClient()

        const [content, ftpServer] = await prisma.$transaction([
          prisma.content.findUnique({
            where: {id: contentId},
            include: {
              works: true,
              services: { include: { items: true } },
              socialMedia: true,
              products: true
            }
          }),
          prisma.ftpServer.findUnique({
            where: {id: ftpServerId}
          })

        ])
        

        if(!content || ftpServer) return successResponse(reply, { msg: false})

        let successBuild = true
        
        for (let i = 0; i < entryPointPathsToPages.length; i++) {

          await ejs.renderFile(entryPointPathsToPages[i], {content: content}, async (err, str) => {
            if (err) {
              return successBuild = false
            }
            const fileName = path.basename(entryPointPathsToPages[i], path.extname(entryPointPathsToPages[i]))
            await fs.writeFile(exitPointPathToDeploy+`/${fileName}.html`, str)
          })
        }

        await new CpFilesUtil(true)
        .copy(entryPointPath, exitPointPathToDeploy)
        .catch(e => successBuild = false)

        await new FTPUtil(ftpServer).start(exitPointPathToDeploy)
        .catch(e => successBuild = false)

        if(successBuild) return successResponse(reply, { msg: true})
        else return successResponse(reply, { msg: false})
    } catch (e) {
        return successResponse(reply, { msg: false})
      }
  }
  
} 

export default new MicoPageGenerateController()