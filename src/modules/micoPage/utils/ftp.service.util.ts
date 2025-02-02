import { FtpServer } from '@prisma/client'
import { Client } from 'basic-ftp'
import fs from 'fs/promises'
import * as path from 'path'

export default class FTPUtil {
    private client: Client
    private remoteBasePath: string
    private ftpServer: FtpServer

    constructor(ftpServer: FtpServer, remoteBasePath: string = "/") {
        this.client = new Client(6900)
        this.remoteBasePath = remoteBasePath
        this.ftpServer = ftpServer

        this.client.ftp.verbose = true
    }

    async start(localDirectoryPath: string) {
        try {
            await this.client.access({
                host: this.ftpServer.ftpHost,
                user: this.ftpServer.ftpUser ,
                password: this.ftpServer.ftpPassword,
                secure: this.ftpServer.isSecureFtp,
            })

            await this.uploadDirectory(localDirectoryPath, this.remoteBasePath)

            return "Обновил!"
        } catch (e) {
            console.error(e)
            return "Произошла ошибка загрузки, проверьте свой ftp сервер и настройки доступа к нему, хост, логин, пароль и попробуйте снова!"
        } finally {
            this.close()
        }
    }

    private async uploadFile(localFilePath: string, remoteFilePath: string) {
        await this.client.uploadFrom(localFilePath, remoteFilePath)
        console.log(`Uploaded ${localFilePath} to ${remoteFilePath}`)
    }

    private async uploadDirectory(localDirPath: string, remoteDirPath: string) {
        await this.client.ensureDir(remoteDirPath)
        const files = await fs.readdir(localDirPath)

        for (const file of files) {
            const localFilePath = path.join(localDirPath, file)
            const remoteFilePath = path.join(remoteDirPath, file)
            const stat = await fs.stat(localFilePath)

            if (stat.isDirectory()) {
                await this.uploadDirectory(localFilePath, remoteFilePath)
            } else {
                await this.uploadFile(localFilePath, remoteFilePath)
            }
        }
    }

    private close() {
        this.client.close()
        console.log('Connection closed')
    }
}