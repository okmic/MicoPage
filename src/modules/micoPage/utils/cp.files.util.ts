import fs from 'fs/promises'
import path from 'path'

export default class CpFilesUtil {

    overwrite: boolean
    excludedExtensions: string[]
    excludedDirectories: string[]

    constructor(overwrite = true) {
        this.overwrite = overwrite
        this.excludedExtensions = ['.ejd', '.html', '.pug', '.ejs', '.hbs']
        this.excludedDirectories = ['templates', 'views', 'ejs', 'pug', "hbs"]
    }

    async copy(src:string, dest: string) {
        try {
            const stats = await fs.stat(src)

            if (stats.isDirectory()) {
                await this.copyDirectory(src, dest)
            } else {
                await this.copyFile(src, dest)
            }
        } catch (error) {
            console.error(`Ошибка при копировании ${src}:`, error.message)
        }
    }

    async copyDirectory(srcDir: string, destDir: string) {
        if (this.isExcludedDirectory(srcDir)) {
            return
        }

        await fs.mkdir(destDir, { recursive: true })
        const items = await fs.readdir(srcDir)

        const copyPromises = items.map(item => {
            const srcItem = path.join(srcDir, item)
            const destItem = path.join(destDir, item)
            return this.copy(srcItem, destItem)
        })

        await Promise.all(copyPromises)
    }

    async copyFile(srcFile: string, destFile: string) {
        if (this.isExcludedFile(srcFile)) {
            return
        }

        await fs.copyFile(srcFile, destFile)
    }

    isExcludedFile(filePath: string) {
        const extname = path.extname(filePath)
        return this.excludedExtensions.includes(extname)
    }

    isExcludedDirectory(dirPath: string) {
        const dirName = path.basename(dirPath)
        const isExtensionExcluded = this.excludedExtensions.some(ext => dirName === ext.slice(1))
        return this.excludedDirectories.includes(dirName) || isExtensionExcluded
    }
}
