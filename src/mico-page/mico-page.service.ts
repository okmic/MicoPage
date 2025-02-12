import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import ejs from 'ejs';
import { promises as fs } from 'fs';
import path from 'path';
import CpFilesUtil  from './utils/cp.files.util';
import FTPUtil from './utils/ftp.service.util';
import { GenerateHTMLDto } from './dto/generate-html.dto';

@Injectable()
export class MicoPageService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async generateHTML(dto: GenerateHTMLDto): Promise<{ msg: boolean }> {
    const { entryPointPathsToPages, exitPointPathToDeploy, contentId, entryPointPath, ftpServerId } = dto;

    try {
      const [content, ftpServer] = await this.prisma.$transaction([
        this.prisma.content.findUnique({
          where: { id: contentId },
          include: {
            works: true,
            services: { include: { items: true } },
            socialMedia: true,
            products: true,
          },
        }),
        this.prisma.ftpServer.findUnique({
          where: { id: ftpServerId },
        }),
      ]);

      if (!content || !ftpServer) {
        return { msg: false };
      }

      let successBuild = true;

      for (let i = 0; i < entryPointPathsToPages.length; i++) {
        await ejs.renderFile(entryPointPathsToPages[i], { content }, async (err, str) => {
          if (err) {
            successBuild = false;
            return;
          }
          const fileName = path.basename(entryPointPathsToPages[i], path.extname(entryPointPathsToPages[i]));
          await fs.writeFile(`${exitPointPathToDeploy}/${fileName}.html`, str);
        });
      }

      await new CpFilesUtil(true)
        .copy(entryPointPath, exitPointPathToDeploy)
        .catch(() => (successBuild = false));

      await new FTPUtil(ftpServer)
        .start(exitPointPathToDeploy)
        .catch(() => (successBuild = false));

      return { msg: successBuild };
    } catch (e) {
      return { msg: false };
    }
  }
}